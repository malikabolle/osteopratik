import { AngularFireOfflineDatabase } from 'angularfire2-offline'
import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { UiFeedbackService } from './../../common/services/ui-feedback.service'
import * as localForage from 'localforage'

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignOutComponent implements OnInit {

  constructor(
    private _auth: AngularFireAuth,
    private _odb: AngularFireOfflineDatabase,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {

    this._auth.auth.signOut()
      .then(() => {
        localStorage.clear()
        localForage.getItem('write')
          .then((item: any) => {
            if (item) {
              const { cache } = item
              const _cache = []
              for (const k in cache) {
                if (cache.hasOwnProperty(k)) {
                  _cache.push(cache[k])
                }
              }
              return localForage.removeItem('token')
                .then(() => {
                  if (!_cache.length) {
                    this._odb.reset()
                  }
                })
            }
          })
        return this._router.navigate(['/'])
      })
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}
