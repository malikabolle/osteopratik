import { AngularFireOfflineDatabase } from 'angularfire2-offline'
import { ThemeService } from './../common/services/theme.service'
import { Subscription } from 'rxjs/Rx'
import { DataService } from './../common/services/data.service'
import { Router, NavigationStart, NavigationEnd } from '@angular/router'
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { Observable } from 'rxjs/Observable'

import * as firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth'

import { MatSidenav } from '@angular/material/sidenav'
import { MatIconRegistry } from '@angular/material/icon'

import { MediaQueryService } from './../common/services/media-query.service'
import { SidenavLink } from './../components/sidenav-list/sidenav-list.component'

import { visitorNavigation, inactiveAccountNavigation, activeAccountNavigation, adminNavigation } from './../common/static/navigation'
import * as localForage from 'localforage'

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav: MatSidenav

  links: SidenavLink[] = visitorNavigation
  isCaching: boolean
  subscriptions: Subscription[] = []

  constructor(
    public mediaQueryService: MediaQueryService,
    private _themeService: ThemeService,
    private _auth: AngularFireAuth,
    private _dataService: DataService,
    private _router: Router,
    _iconRegistry: MatIconRegistry,
    _domSanitizer: DomSanitizer,
    private _elementRef: ElementRef,
  ) {
    _iconRegistry.addSvgIcon('gender_female', _domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/gender-female.svg'))
    _iconRegistry.addSvgIcon('gender_male', _domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/gender-male.svg'))
    _iconRegistry.addSvgIcon('gender_undefined', _domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/gender-male-female.svg'))
    _iconRegistry.addSvgIcon('app_icon', _domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/animal-rights.svg'))
  }

  ngOnInit() {
    this._auth.authState.subscribe((user) => {
      if (user) {
        user.getIdToken(true).then((token) => {
          localForage.setItem('token', token)
        })
      }
    })

    const [user$, visitor$] = this._auth.authState.partition(user => !!user)

    const userSub = user$
      .switchMap(({ uid }) => this._dataService.access$)
      .subscribe(({ active, admin }) => {
        if (admin) {
          this.links = adminNavigation
        } else if (active) {
          this.links = activeAccountNavigation
        } else {
          this.links = inactiveAccountNavigation
        }
      })

    const visitorSub = visitor$
      .subscribe(() => {
        this.links = visitorNavigation
      })

    this.subscriptions.push(userSub, visitorSub)

    // closes the sidenav on navigation if the sidenav isn't in persistant mode
    this._router.events
      .do(event => {
        if (event instanceof NavigationStart) {
          const now = +new Date()
          window['myTimestamp'] = now
        }
        if (event instanceof NavigationEnd) {
          const now = +new Date()
          const s = now - window['myTimestamp'] || now
        }
      })
      .filter(event => event instanceof NavigationStart)
      .subscribe(() => {
        if (this.sidenav.mode !== 'side' && this.sidenav.opened) {
          this.sidenav.close()
        }
      })
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
  ngAfterViewInit() { }

  // @todo is only called when root node is rendered
  isOnline() {
    return navigator.onLine
  }

  toggleTheme() {
    this._themeService.toggleTheme()
  }

  reload() {
    location.reload()
  }

  handleSidenavAction(action: string) {
    this[action]()
  }
}
