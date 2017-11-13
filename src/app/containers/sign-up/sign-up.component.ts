import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AngularFireAuth } from 'angularfire2/auth'
import { UiFeedbackService } from './../../common/services/ui-feedback.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent implements OnInit {

  form: FormGroup

  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this._createForm()
  }

  signUp(formData: any) {
    const { email, password, passwordConfirmation } = formData
    if (password === passwordConfirmation) {
      this._angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(() => this._router.navigate(['./shell/register']))
        .then((response: any | null | undefined) => this._feedbackService.success$$.next())
        .catch((error: Error | any) => this._feedbackService.error$$.next(error))
    } else {
      // @todo ui feedback pwd not same
    }
  }

  private _createForm() {
    this.form = this._formBuilder
      .group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
      })
  }
}

