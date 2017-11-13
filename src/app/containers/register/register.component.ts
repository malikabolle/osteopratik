import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'
import { UiFeedbackService } from './../../common/services/ui-feedback.service'
import { DataService } from './../../common/services/data.service'
import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { currencies, CurrencyEUR } from './../../common/models/currency'
import { MatSelectChange } from '@angular/material/select'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  currencies = currencies
  profileForm: FormGroup
  addressForm: FormGroup
  settingsForm: FormGroup
  validForm: FormGroup
  dummyForm: FormGroup

  @ViewChild('action') action: MatButton

  constructor(
    private _formBuilder: FormBuilder,
    private _dataService: DataService,
    private _feedbackService: UiFeedbackService,
    private _auth: AngularFireAuth,
    private _router: Router
  ) { }

  ngOnInit() {
    this._createForms()
    this._dataService.access$.first()
      .subscribe(({ valid }) => {
        if (valid) {
          this._router.navigate(['/'])
          this._feedbackService.success$$.next(`L'enregistrement a déjà été effectué.`)
        }
      })
  }

  handleCurrencyChange(event: MatSelectChange) {
    if (event.value === CurrencyEUR) {
      this.settingsForm.controls['siret'].enable()
    } else {
      this.settingsForm.controls['siret'].disable()
    }
  }

  handleValidityChange(event: MatCheckboxChange) {
    this.action.disabled = !event.checked
  }

  private _createForms() {
    this.settingsForm = this._formBuilder
      .group({
        vat: ['', Validators.required],
        invoiceNumber: ['', Validators.required],
        currency: ['', Validators.required],
        iban: ['', Validators.required],
        siret: [{ value: '', disabled: true }],
        swift: [''],
      })

    this.profileForm = this._formBuilder
      .group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        tel: ['', Validators.required],
        company: [''],
      })

    this.addressForm = this._formBuilder
      .group({
        street: ['', Validators.required],
        zip: ['', Validators.required],
        city: ['', Validators.required],
        region: ['', Validators.required],
        country: ['', Validators.required],
      })

    this.validForm = this._formBuilder
      .group({
        valid: [false, Validators.required],
      })
    this.dummyForm = this._formBuilder.group({})
  }

  handleSubmit() {
    this._auth.authState
      .switchMap(({ email }) => {
        const profile = { address: { ...this.addressForm.value }, ...this.profileForm.value, email }
        const settings = { siret: '', ...this.settingsForm.value }

        const profileUpdate = this._dataService.updateProfile(profile)
        const settingsUpdate = this._dataService.updateSettings(settings)
        const accessUpdate = this._dataService.updateAccess()

        return Promise.all([profileUpdate, settingsUpdate, accessUpdate])
      })
      .first()
      .toPromise()
      .then(() => this._router.navigate(['/shell']))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }

}
