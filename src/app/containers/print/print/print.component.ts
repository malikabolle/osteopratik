import { Settings } from './../../../common/models/settings'
import { Consultation } from './../../../common/models/consultation'
import { Animal } from './../../../common/models/animal'
import { Customer } from './../../../common/models/customer'
import { Profile } from './../../../common/models/profile'
import { SafeHtml } from '@angular/platform-browser'
import { InvoiceRendererService } from './../../../common/services/invoice-renderer.service'
import { Invoice } from './../../../common/models/invoice'
import { Observable } from 'rxjs/Rx'
import { DataService } from './../../../common/services/data.service'
import { ActivatedRoute } from '@angular/router'
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core'

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent implements OnInit, OnDestroy {

  invoice$: Observable<Invoice>
  profile$: Observable<Profile>
  settings$: Observable<Settings>
  customer$: Observable<Customer>
  animal$: Observable<Animal>
  consultation$: Observable<Consultation>
  html$: Observable<SafeHtml>

  constructor(
    private _route: ActivatedRoute,
    private _dataService: DataService,
    private _invoiceRenderer: InvoiceRendererService,
  ) { }

  ngOnInit() {
    this._route.params
      .subscribe(({ customerKey, animalKey, consultationKey, }) => {
        this._dataService.customerKey$$.next(customerKey)
        this._dataService.animalKey$$.next(animalKey)
        this._dataService.consultationKey$$.next(consultationKey)
      })
    this.profile$ = this._dataService.profile$
    this.settings$ = this._dataService.settings$
    this.customer$ = this._dataService.customer$
    this.invoice$ = this._dataService.invoice$
    this.animal$ = this._dataService.animal$
    this.consultation$ = this._dataService.consultation$

    this.html$ = this._invoiceRenderer.html$

    if (document) {
      document.querySelector('body').classList.add('print-fix')
    }
  }
  ngOnDestroy() {
    if (document) {
      document.querySelector('body').classList.remove('print-fix')
    }
  }

}
