import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
export const DARK_THEME = 'dark-theme'
export const LIGHT_THEME = 'light-theme'

@Injectable()
export class ThemeService {

  theme$$ = new BehaviorSubject(DARK_THEME)

  constructor() { }

  toggleTheme() {
    if (document.body.classList.contains(LIGHT_THEME)) {
      document.body.classList.remove(LIGHT_THEME)
      document.body.classList.add(DARK_THEME)
      this.theme$$.next(DARK_THEME)
    } else {
      document.body.classList.remove(DARK_THEME)
      document.body.classList.add(LIGHT_THEME)
      this.theme$$.next(LIGHT_THEME)
    }
  }

}
