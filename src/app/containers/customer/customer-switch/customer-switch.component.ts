import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'

import { Observable } from 'rxjs/Rx'
import { AngularFireAuth } from 'angularfire2/auth'

import { MatButton } from '@angular/material/button'
import { MatSelectChange } from '@angular/material/select'

import { Profile } from './../../../common/models/profile'
import { Customer } from './../../../common/models/customer'
import { Animal } from './../../../common/models/animal'
import { Consultation, consultationStatus } from './../../../common/models/consultation'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'

@Component({
  selector: 'app-customer-switch',
  templateUrl: './customer-switch.component.html',
  styleUrls: ['./customer-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSwitchComponent implements OnInit {
  @ViewChild('action') action: MatButton
  form: FormGroup

  customer$: Observable<Customer>
  profiles$: Observable<Profile[]>
  profile$: Observable<Profile> // src
  osteopath$: Observable<Profile> // target

  constructor(
    private _dataService: DataService,
    private _auth: AngularFireAuth,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(({ customerKey }) => {
      this._dataService.customerKey$$.next(customerKey)
    })
    this.customer$ = this._dataService.customer$

    this.profiles$ = this._dataService.uid$
      .switchMap(uid => this._dataService.profiles$.map(profiles => profiles.filter(profile => profile.$key !== uid)))

    this._createForm()
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      osteopath: ['', Validators.required],
    })
  }

  selectOsteopath(event: MatSelectChange) {
    const { value } = event
    const { $key } = value
    this.osteopath$ = this.profiles$
      .switchMap(p => p)
      .find((p: Profile) => p.$key === $key)
  }

  transferCustomer(forMatata: any) {
    this.action.disabled = true
    const { osteopath } = forMatata
    const { $key } = osteopath
    const customerKey = this._dataService.customerKey$$.value
    this._dataService
      .transferCustomerToSharedSpace(customerKey, $key)
      .then(() => this._router.navigate(['..'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))

  }
}
