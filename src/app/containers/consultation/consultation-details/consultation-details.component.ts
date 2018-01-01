import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router'
import { DataSource } from '@angular/cdk/table'
import { MatSort } from '@angular/material/sort'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

import { Consultation, consultationStatus } from './../../../common/models/consultation'
import { Settings } from './../../../common/models/settings'
import { Breed } from './../../../common/models/breed'
import { Customer } from './../../../common/models/customer'
import { Currency, CurrencyEUR } from './../../../common/models/currency'
import { Invoice, invoiceStatus } from './../../../common/models/invoice'
import { Animal } from './../../../common/models/animal'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'


const filterable = new Map()
filterable.set('name', 'Nom')
filterable.set('sex', 'Sexe')
filterable.set('breed', 'Race')

@Component({
  selector: 'app-consultation-details',
  templateUrl: './consultation-details.component.html',
  styleUrls: ['./consultation-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationDetailsComponent implements OnInit, OnDestroy {
  customer$: Observable<Customer>
  animal$: Observable<Animal>
  consultation$: Observable<Consultation>
  consultations$: Observable<Consultation[]>
  invoice$: Observable<Invoice>
  breeds$: Observable<Breed[]>
  pictures$: Observable<any[]>
  settings$: Observable<Settings>
  activeCurrency: Currency
  invoiceStatus = invoiceStatus
  consultationStatus = consultationStatus

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this._route.params.first().subscribe(({ customerKey, animalKey, consultationKey }) => {
      this._dataService.customerKey$$.next(customerKey)
      this._dataService.animalKey$$.next(animalKey)
      this._dataService.consultationKey$$.next(consultationKey)
    })
    this.settings$ = this._dataService.settings$
    this.breeds$ = this._dataService.breeds$

    this.animal$ = this._dataService.animal$

    this.consultations$ = this._dataService.consultations$
    this.consultation$ = this._dataService.consultation$

    this.invoice$ = this._dataService.invoice$
    this.pictures$ = this._dataService.pictures$

    this.settings$
      .first()
      .subscribe(({ currency }) => {
        this.activeCurrency = currency
      })
  }

  handleImageClick(event: Event) {
  }

  addInvoice() {
    this._dataService.addInvoice()
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
  updateInvoice(invoice: Invoice | any) {
    // console.log(invoice)
    this._dataService.updateInvoice({ ...invoice })
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }

  removeInvoice() {
    this._dataService.removeInvoice()
  }

  printInvoice() {
    const customerKey = this._dataService.customerKey$$.value
    const animalKey = this._dataService.animalKey$$.value
    const consultationKey = this._dataService.consultationKey$$.value
    this._router.navigate(['/print', customerKey, animalKey, consultationKey])
  }

  navigate(commands: any[], extras?: NavigationExtras) {
    this._router.navigate(commands, extras)
  }

  ngOnDestroy() { }
}
