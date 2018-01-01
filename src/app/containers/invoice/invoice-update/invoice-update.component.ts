import { FIREBASE_FUNCTIONS_ROOT } from './../../../common/config/firebase.config'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DataService } from './../../../common/services/data.service'
import { Invoice, invoiceStatus } from './../../../common/models/invoice'
import { Observable } from 'rxjs/Observable'
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'

@Component({
  selector: 'app-invoice-update',
  templateUrl: './invoice-update.component.html',
  styleUrls: ['./invoice-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceUpdateComponent implements OnInit {

  form: FormGroup
  invoice$: Observable<Invoice>

  constructor(
    private _feedbackService: UiFeedbackService,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit() {
    this._route.params
      .subscribe(({ customerKey, animalKey, consultationKey }) => {
        this._dataService.customerKey$$.next(customerKey)
        this._dataService.animalKey$$.next(animalKey)
        this._dataService.consultationKey$$.next(consultationKey)
      })
    this.invoice$ = this._dataService.invoice$
    this._createForm()
    this._initializeForm()
  }

  updateInvoice(invoice: Invoice | any) {
    this._dataService.year$.switchMap((year) => this._dataService.settings$
      .switchMap(({ invoiceNumber }) => this._dataService
        .updateInvoice({ ...invoice, status: invoiceStatus.invoiceDone, invoiceNumber: `${year}-${invoiceNumber}`, comment: '' }, true)))
      .first()
      .toPromise()
      .then(() => this._router.navigate(['../../../read'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }


  private _createForm() {
    this.form = this._formBuilder
      .group({
        fees: ['', Validators.required],
        discount: ['', Validators.required],
        amount: ['', Validators.required],
      })
  }

  private _initializeForm() {
    this.invoice$
      .first()
      .subscribe(({ amount, fees, discount }) => {
        this.form.setValue({ fees, discount, amount })
      })

  }

}
