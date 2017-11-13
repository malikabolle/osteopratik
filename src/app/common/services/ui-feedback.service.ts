import { ThemeService } from './theme.service'
import { Subject } from 'rxjs/Subject'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class UiFeedbackService {
  success$$ = new Subject()
  error$$ = new Subject()

  constructor(
    private _snackBar: MatSnackBar,
    private _themeService: ThemeService
  ) {
    this.success$$
      .asObservable()
      .subscribe((value: string | any) => {
        if (!value) {
          value = 'Opération effectuée avec succès'
          const duration = 8000
          this._snackBar.open(value, 'OK', { duration, extraClasses: [this._themeService.theme$$.value] })
        } else if (typeof value === 'string') {
          const duration = 8000
          this._snackBar.open(value, 'OK', { duration, extraClasses: [this._themeService.theme$$.value] })
        } else if (typeof value !== 'string') {
          const { duration, message } = value
          this._snackBar.open(message, 'OK', { duration, extraClasses: [this._themeService.theme$$.value] })
        }

      })
    this.error$$
      .asObservable()
      .subscribe((error: any) => {
        let message
        if (error instanceof Error) {
          message = error.message
        } else if (typeof error === 'string') {
          message = error
        } else {
          message = 'L\'opération à échouée'
        }
        this._snackBar.open(message, 'OK', { duration: 60000, extraClasses: [this._themeService.theme$$.value] })
        console.error(error)
      })
  }

}
