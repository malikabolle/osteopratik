import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { MatSort } from '@angular/material/sort'
import { DataSource } from '@angular/cdk/table'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'

import { DataService } from './../../../common/services/data.service'
import { GeocoderService } from './../../../common/services/geocoder.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerAddComponent implements OnInit {
  form: FormGroup
  @ViewChild('action') action: MatButton

  constructor(
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this._createForm()
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      firstName: [''],
      lastName: ['', Validators.required],
      tel: ['', Validators.required],
      email: [''],
      company: [''],
      address: this._formBuilder.group({
        street: ['', Validators.required],
        zip: [''],
        city: [''],
        country: [''],
      })
    })
  }

  addCustomer(customer) {
    this.action.disabled = true
    this._dataService
      .addCustomer(customer)
      .then(() => this._router.navigate(['..'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}
