import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { MatSort } from '@angular/material/sort'
import { DataSource } from '@angular/cdk/table'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'

import { Breed } from './../../../common/models/breed'
import { Customer } from './../../../common/models/customer'
import { Animal } from './../../../common/models/animal'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'
import { isHashed } from './../../../common/functions/utilities'

@Component({
  selector: 'app-animal-update',
  templateUrl: './animal-update.component.html',
  styleUrls: ['./animal-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalUpdateComponent implements OnInit {
  form: FormGroup
  breeds$: Observable<Breed[]>
  customer$: Observable<Customer>
  animal$: Observable<Animal>
  startDate: Date

  constructor(
    private _dataService: DataService,
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
    this.breeds$ = this._dataService.breeds$.map(breeds => breeds.filter(({ name }) => !isHashed(name)))
    this.customer$ = this._dataService.customer$
    this.animal$ = this._dataService.animal$
    this._createForm()
    this._initializeForm()
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      name: [''],
      birthday: [new Date()],
      sex: [''],
      breedKey: ['', Validators.required],
      background: ['']
    })
  }

  private _initializeForm() {
    this._dataService.animal$
      .first()
      .subscribe(
      ({ name, birthday, sex, breedKey, background }) => {
        this.startDate = birthday = new Date(+birthday)
        this.form.setValue({
          name,
          birthday,
          sex,
          breedKey,
          background
        })
      })
  }

  updateAnimal(animal: Animal | any) {
    const { birthday } = animal
    animal.birthday = +birthday
    this._dataService
      .updateAnimal(this._dataService.animalKey$$.value, animal)
      .then(() => this._router.navigate(['../read'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}
