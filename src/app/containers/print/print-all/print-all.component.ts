import { Subscription } from 'rxjs/Subscription'
import { CurrencyCHF, CurrencyEUR } from './../../../common/models/currency'
import { DataService } from './../../../common/services/data.service'
import { Profile } from './../../../common/models/profile'
import { Observable } from 'rxjs/Rx'
import { FIREBASE_FUNCTIONS_ROOT } from './../../../common/config/firebase.config'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'

@Component({
  selector: 'app-print-all',
  templateUrl: './print-all.component.html',
  styleUrls: ['./print-all.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintAllComponent implements OnInit {

  accounting$: Observable<any>
  profile$: Observable<Profile>
  currency$: Subscription
  currency: CurrencyCHF | CurrencyEUR

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
    private _route: ActivatedRoute,
    private _dataService: DataService
  ) { }


  ngOnInit() {
    this.currency$ = this._dataService.settings$.map(({ currency }) => this.currency = currency).first().subscribe()
    this.profile$ = this._dataService.profile$
    this.accounting$ = this._route.params
      .switchMap(({ year }) => this._http.post(`${FIREBASE_FUNCTIONS_ROOT}/accounting`, { year }))
  }


}
