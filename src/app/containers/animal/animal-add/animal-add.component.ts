import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatSort } from '@angular/material/sort'
import { MatButton } from '@angular/material/button'
import { DataSource } from '@angular/cdk/table'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'

import { Breed } from './../../../common/models/breed'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'
import { isHashed } from './../../../common/functions/utilities'


@Component({
  selector: 'app-animal-add',
  templateUrl: './animal-add.component.html',
  styleUrls: ['./animal-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalAddComponent implements OnInit {
  form: FormGroup
  @ViewChild('action') action: MatButton
  breeds$: Observable<Breed[]>

  constructor(
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(({ customerKey }) => {
      this._dataService.customerKey$$.next(customerKey)
    })
    this.breeds$ = this._dataService.breeds$.map(breeds => breeds.filter(({ name }) => !isHashed(name)))
    this._createForm()
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      birthday: [new Date(), Validators.required],
      sex: ['', Validators.required],
      breedKey: ['', Validators.required],
      background: ['']
    })
  }

  addAnimal(animal) {
    this.action.disabled = true
    const { birthday } = animal
    animal.birthday = +birthday

    this._dataService
      .addAnimal(animal)
      .then(() => this._router.navigate(['./../../../read'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }
}
