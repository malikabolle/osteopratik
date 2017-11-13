import { Router } from '@angular/router'
import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import { FIREBASE_FUNCTIONS_ROOT } from './../../../common/config/firebase.config'

import { UiFeedbackService } from './../../../common/services/ui-feedback.service'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupComponent implements OnInit {

  @ViewChild('action') action: MatButton

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() { }

  getRawBackup() {
    this._feedbackService.success$$.next('Opération lancée. Cela risque de prendre du temps.')
    this.action.disabled = true
    this._http
      .post(`${FIREBASE_FUNCTIONS_ROOT}/backup`, {})
      .toPromise()
      .then((response: any | null | undefined) => {
        this._router.navigate(['/'])
        return response
      })
      .then((response: any | null | undefined) => this._feedbackService.success$$.next({ message: 'Sauvegarde de la base de donnée effectuée avec succès.', duration: 0 }))
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}
