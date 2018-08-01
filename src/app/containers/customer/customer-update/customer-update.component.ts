import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import { MatSort } from '@angular/material/sort'
import { DataSource } from '@angular/cdk/table'

import { Customer } from './../../../common/models/customer'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerUpdateComponent implements OnInit {
  form: FormGroup
  customer$: Observable<Customer>

  constructor(
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this._route.params
      .first()
      .subscribe(({ customerKey }) => this._dataService.customerKey$$.next(customerKey))

    this.customer$ = this._dataService.customer$

    this._createForm()
    this._initializeForm()
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
  private _initializeForm() {
    this.customer$
      .first()
      .subscribe(({ firstName, lastName, tel, email, company, address }) => {
        this.form.controls['firstName'].setValue(firstName)
        this.form.controls['lastName'].setValue(lastName)
        this.form.controls['tel'].setValue(tel)
        this.form.controls['email'].setValue(email)
        this.form.controls['address'].setValue(address)
        if (company) {
          this.form.controls['company'].setValue(company)
        }
      })
  }
  updateCustomer(customerKey: string, customer: Customer) {
    return this._dataService
      .updateCustomer(customerKey, customer)
      .then(() => this._router.navigate(['../read'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}
