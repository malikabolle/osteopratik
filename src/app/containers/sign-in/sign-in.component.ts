import { DataService } from './../../common/services/data.service'
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'
import { UiFeedbackService } from './../../common/services/ui-feedback.service'
import * as localForage from 'localforage'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent implements OnInit {

  isCaching: boolean
  loginError: any
  form: FormGroup

  constructor(
    private _auth: AngularFireAuth,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _feedbackService: UiFeedbackService,
    private _dataService: DataService
  ) { }

  ngOnInit() {
    this._createForm()
  }

  signIn(formData: any) {
    const { email, password, passwordConfirmation } = formData
    this._auth.auth.signInWithEmailAndPassword(email, password)
      .then(() => this._auth.auth.currentUser.getIdToken(true)
        .then((token) => { localForage.setItem('token', token) })
        .then((token) => { this._router.navigate(['/']) }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }

  private _createForm() {
    this.form = this._formBuilder
      .group({
        email: ['', Validators.required],
        password: ['', Validators.required],
      })
  }
}
