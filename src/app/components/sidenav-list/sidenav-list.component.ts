import { MatSidenav } from '@angular/material/sidenav'
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core'
import { SafeResourceUrl } from '@angular/platform-browser'
import { Router } from '@angular/router'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListComponent {
  @Output() click = new EventEmitter()
  @Output() actions = new EventEmitter()
  private _links: SidenavLink[]
  @Input() public set links(links: SidenavLink[]) {
    this._links = links
      .map((link: SidenavLink) => {
        if (link.label) {
          const lowerCased = link.label.toLowerCase()
          const upperCased = link.label.toUpperCase()
          const first = upperCased[0]
          const rest = lowerCased.substring(1)
          link.label = first + rest
        }
        return link
      })
  }

  public get links() {
    return this._links
  }

  constructor(
    private _router: Router,
  ) { }

  public onClick($event) {
    this.click.emit($event)
  }

}

export class SidenavLink {
  constructor(
    public label: string,
    public path?: any[] | SafeResourceUrl,
    public icon?: string,
    public isSubHeader?: boolean,
    public isHeader?: boolean,
    public isExternal?: boolean,
    public isAction?: boolean,
  ) { }
}
