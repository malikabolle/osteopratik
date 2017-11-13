import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

import { Consultation, consultationStatus } from './../../../common/models/consultation'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-consultation-add',
  templateUrl: './consultation-add.component.html',
  styleUrls: ['./consultation-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationAddComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  @ViewChild('action') action: MatButton
  form: FormGroup

  constructor(
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    const routeParamsSub = this._route.params
      .first()
      .subscribe(({ customerKey, animalKey }) => {
        this._dataService.customerKey$$.next(customerKey)
        this._dataService.animalKey$$.next(animalKey)
      })
    this.subscriptions.push(routeParamsSub)
    this._createForm()
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      date: [new Date(), Validators.required],
      time: ['08:00', Validators.required],
      reason: ['', Validators.required]
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  addConsultation({ time, date, reason }) {
    this.action.disabled = true
    this._dataService
      .addConsultation({ date, time, reason, })
      .then(() => this._router.navigate(['../../../'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}
