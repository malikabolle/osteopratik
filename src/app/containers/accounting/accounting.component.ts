import { UiFeedbackService } from './../../common/services/ui-feedback.service'
import { Router } from '@angular/router'
import { FIREBASE_FUNCTIONS_ROOT } from './../../common/config/firebase.config'
import { HttpClient } from '@angular/common/http'
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AccountingComponent implements OnInit {

  years: number[]
  year: number

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    // app launched in 2017, so there will never be invoice created before this year *in theory*
    const firstYear = 2017
    const now = new Date()
    const actualYear = this.year = now.getFullYear()
    this.years = Array.from(Array(actualYear - firstYear + 1).keys()).map((_, i) => i + firstYear)
  }

  navigate(year: number) {
    this._router.navigate(['/print', year])
  }

}
