import { SafeHtml } from '@angular/platform-browser'
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { MatSelectChange } from '@angular/material/select'

import { InvoiceTemplate } from './../../../common/models/invoice'
import { Breed } from './../../../common/models/breed'
import { Settings } from './../../../common/models/settings'
import {
  Currency,
  currencies,
  CurrencyEUR
} from './../../../common/models/currency'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'


@Component({
  selector: 'app-financial-settings',
  templateUrl: './financial-settings.component.html',
  styleUrls: ['./financial-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialSettingsComponent implements OnInit {
  localeForm: FormGroup
  billingForm: FormGroup
  currencies = currencies
  isCurrencyEUR: boolean
  settings$: Observable<Settings>

  html: SafeHtml
  invoiceTemplate$: Observable<InvoiceTemplate>
  invoiceLogo$: Observable<string>

  constructor(
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this.settings$ = this._dataService.settings$
    this.invoiceTemplate$ = this._dataService.invoiceTemplate$
    this.invoiceLogo$ = this._dataService.invoiceLogo$
    this._createLocaleForm()
    this._createBillingForm()
    this._initializeForms()
  }

  private _createLocaleForm() {
    this.localeForm = this._formBuilder.group({
      vat: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      currency: ['', Validators.required],
      siret: ['']
    })
  }

  private _createBillingForm() {
    this.billingForm = this._formBuilder
      .group({
        iban: ['', Validators.required],
        swift: [''],
      })
  }

  private _initializeForms() {
    this._dataService.settings$
      .first()
      .subscribe(({ vat, invoiceNumber, currency, siret, iban, swift }) => {
        this.isCurrencyEUR = currency === CurrencyEUR
        if (invoiceNumber) {
          this.localeForm.controls['invoiceNumber'].disable()
          this.localeForm.controls['invoiceNumber'].setValue(invoiceNumber)
        }
        if (currency) {
          this.localeForm.controls['currency'].disable()
          this.localeForm.controls['currency'].setValue(currency)
        }
        this.localeForm.controls['vat'].setValue(vat)
        this.localeForm.controls['siret'].setValue(siret)
        iban = iban || ''
        swift = swift || ''
        this.billingForm.setValue({ iban, swift })
      })
  }

  updateSettings(settings) {
    this._dataService
      .updateSettings(settings)
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }

  handleCurrencyChange(event: MatSelectChange) {
    const { value } = event
    this.isCurrencyEUR = value === CurrencyEUR
  }

  onHtmlChange(html: SafeHtml) {
    this.html = html
  }

  updateInvoiceTemplate(template: InvoiceTemplate, logo: string) {
    this._dataService
      .updateInvoiceTemplate(template, logo)
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}
