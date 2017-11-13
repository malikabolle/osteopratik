import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { FIREBASE_FUNCTIONS_ROOT } from './../../common/config/firebase.config'

import { buildOptions } from './../../components/chart/chart.model'

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent implements OnInit {

  annualRevenueData$: Observable<any>
  annualRevenueOptions$: Observable<any>
  annualBreedsData$: Observable<any>
  annualBreedsOptions$: Observable<any>
  buildOptions = buildOptions

  constructor(
    private _httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.annualRevenueData$ = this._httpClient.post(`${FIREBASE_FUNCTIONS_ROOT}/annualRevenueStatistics`, {}).first()
    this.annualRevenueOptions$ = this.annualRevenueData$.map(({ datasets }) => buildOptions(datasets))
    this.annualBreedsData$ = this._httpClient.post(`${FIREBASE_FUNCTIONS_ROOT}/annualBreedsStatistics`, {}).first()
    this.annualBreedsOptions$ = this.annualBreedsData$.map(({ datasets }) => {
      const values = datasets.reduce((acc, curr) => [...acc, ...curr.data], [])
      const max = Math.max(...values) + 1
      const options = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max
            }
          }]
        }
      }
      return options
    })
  }
}
