import { Router } from '@angular/router'
import { UiFeedbackService } from './../../common/services/ui-feedback.service'
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { Observable } from 'rxjs/Rx'

import { DataService } from './../../common/services/data.service'
import { Profile } from './../../common/models/profile'

/*
@todo: numero de facture doit etre au format suivant: année-numéro
exemple:
2017-0
2018-225
*/

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  @ViewChild('addressRef', { read: ElementRef })
  addressRef: ElementRef

  profile$: Observable<Profile>
  form: FormGroup

  constructor(
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _feedbackService: UiFeedbackService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.profile$ = this._dataService.profile$
    this._createForm()
    this._initializeForm()
  }

  handleSubmit(profile) {
    this.form.controls['email'].enable()
    this._dataService
      .updateProfile({ ...profile })
      .then(() => { this._router.navigate(['/']) })
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', Validators.required],
      company: [''],
      address: this._formBuilder.group({
        street: ['', Validators.required],
        zip: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      })
    })
  }

  private _initializeForm() {
    this.profile$
      .first()
      .subscribe(profile => {
        for (const key in profile) {
          if (profile.hasOwnProperty(key)) {
            this.form.controls[key].setValue(profile[key])
          }
        }
      })
  }
}
