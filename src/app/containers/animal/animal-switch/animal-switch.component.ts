import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'
import { MatButton } from '@angular/material/button'
import { MatSelectChange } from '@angular/material/select'

import { Observable } from 'rxjs/Rx'

import { Consultation } from './../../../common/models/consultation'
import { Animal } from './../../../common/models/animal'
import { Customer } from './../../../common/models/customer'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'

@Component({
  selector: 'app-animal-switch',
  templateUrl: './animal-switch.component.html',
  styleUrls: ['./animal-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalSwitchComponent implements OnInit {
  @ViewChild('action') action: MatButton
  form: FormGroup

  customers$: Observable<Customer[]>
  customer$: Observable<Customer>
  key$: Observable<string>

  constructor(
    private _dataService: DataService,
    private _auth: AngularFireAuth,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(({ customerKey, animalKey }) => {
      this._dataService.customerKey$$.next(customerKey)
      this._dataService.animalKey$$.next(animalKey)
    })

    this.customers$ = this._dataService.customer$
      .switchMap((customer: Customer) => this._dataService.customers$
        .map((customers: Customer[]) => customers
          .filter((c: Customer) => c.$key !== customer.$key)))
    this.customer$ = this._dataService.customer$

    this._createForm()
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      customerTarget: ['', Validators.required],
    })
  }

  selectCustomer(event: MatSelectChange) {
    const { value } = event
    const { $key } = value
    this.key$ = this.customers$
      .switchMap(c => c)
      .find((c: Customer) => c.$key === $key)
      .map(({ $key: customerKey }) => customerKey)
  }

  transferAnimal() {
    this.action.disabled = true
    this.key$.switchMap(customerKey => this._dataService.transferAnimal(customerKey, this._dataService.customerKey$$.value))
      .first()
      .toPromise()
      .then(() => this._router.navigate(['../../../../../../customers'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }

}
