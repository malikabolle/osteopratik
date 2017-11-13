import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { MatSelectChange } from '@angular/material/select'

import { isHashed } from './../../../common/functions/utilities'
import { Breed } from './../../../common/models/breed'
import { Settings } from './../../../common/models/settings'
import {
  Currency,
  currencies,
  CurrencyEUR
} from './../../../common/models/currency'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'

@Component({
  selector: 'app-animal-settings',
  templateUrl: './animal-settings.component.html',
  styleUrls: ['./animal-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalSettingsComponent implements OnInit {
  addBreedForm: FormGroup
  updateBreedForm: FormGroup

  currencies = currencies
  isCurrencyEUR = false

  settings$: Observable<Settings>
  breeds$: Observable<Breed[]>
  autoCompleteAnimals$: Observable<any[]>

  @ViewChild('breedAddRef') breedAddRef: ElementRef

  constructor(
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this.settings$ = this._dataService.settings$
    this.breeds$ = this._dataService.breeds$.map(breeds => breeds.filter(({ name }) => !isHashed(name)))
    this._createAddBreedForm()
    this._createUpdateBreedForm()
  }

  private _createAddBreedForm() {
    this.addBreedForm = this._formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required]
    })
  }
  private _createUpdateBreedForm() {
    this.updateBreedForm = this._formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  handleBreedChange(event: MatSelectChange | any) {
    const { value } = event
    this.breeds$
      .switchMap((breeds: Breed[]) => breeds)
      .find(({ name }) => name.toLowerCase() === value.toLowerCase())
      .map(({ price }) => price)
      .first()
      .subscribe(price => this.updateBreedForm.controls['price'].setValue(+price))
  }

  addBreed(breed: Breed) {
    this._dataService.addBreed(breed)
      .then(() => {
        // invalid class not removed it seems ?
        this.addBreedForm.reset()
        this.updateBreedForm.controls['name'].setValue(breed.name)
        this.handleBreedChange({ value: breed.name })
          ; (this.breedAddRef.nativeElement as HTMLInputElement).focus()
      })
  }

  updateBreed(breed: Breed) {
    this.breeds$
      .switchMap((breeds: Breed[]) => breeds)
      .find(({ name }) => name.toLowerCase() === breed.name.toLowerCase())
      .switchMap(({ $key }) => this._dataService.updateBreed($key, breed))
      .toPromise()
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }

}
