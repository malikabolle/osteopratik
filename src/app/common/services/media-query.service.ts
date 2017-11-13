import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { ObservableMedia } from '@angular/flex-layout'

@Injectable()
export class MediaQueryService {

  _isMobile$: ReplaySubject<boolean> = new ReplaySubject(1)

  constructor(
    private _observableMedia: ObservableMedia,
  ) {
    this._observableMedia
      .asObservable()
      .map(({ mqAlias }) => {
        switch (mqAlias) {
          case 'xs': return true
          case 'sm': return true
          default: return false
        }
      })
      .startWith(this._startWith())
      .subscribe((value) => this._isMobile$.next(value))
  }

  get isMobile$() {
    return this._isMobile$
  }

  private _startWith() {
    if (window && window.matchMedia) {
      return window.matchMedia('(max-width: 759px)').matches
    } else {
      // likely IE 9
      return false
    }
  }

}
