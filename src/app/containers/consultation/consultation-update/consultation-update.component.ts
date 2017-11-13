import { invoiceStatus } from './../../../common/models/invoice'
import { Component, ChangeDetectionStrategy, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core'
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { Observable } from 'rxjs/Observable'

import { Consultation, consultationStatus } from './../../../common/models/consultation'
import { Customer } from './../../../common/models/customer'
import { Animal } from './../../../common/models/animal'

import { DataService } from './../../../common/services/data.service'
import { UiFeedbackService } from './../../../common/services/ui-feedback.service'

import { DynamicFormComponent } from './../../../components/dynamic-form/containers/dynamic-form/dynamic-form.component'

@Component({
  selector: 'app-consultation-update',
  templateUrl: './consultation-update.component.html',
  styleUrls: ['./consultation-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationUpdateComponent implements OnInit {

  @ViewChild('dynamicFormRef') dynamicFormRef: DynamicFormComponent

  customer$: Observable<Customer>
  animal$: Observable<Animal>
  consultation$: Observable<Consultation>
  pictures$: Observable<any>

  form: FormGroup
  startDate: Date
  consultationStatus = consultationStatus
  config = [
  ]

  constructor(

    private _resolver: ComponentFactoryResolver,
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _feedbackService: UiFeedbackService,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(({ customerKey, animalKey, consultationKey }) => {
      this._dataService.customerKey$$.next(customerKey)
      this._dataService.animalKey$$.next(animalKey)
      this._dataService.consultationKey$$.next(consultationKey)
      this.pictures$ = this._dataService.uid$.switchMap(uid => this._dataService._odb.list(`data/${uid}/pictures/${customerKey}/${animalKey}/${consultationKey}`))
    })
    this.customer$ = this._dataService.customer$
    this.animal$ = this._dataService.animal$
    this.consultation$ = this._dataService.consultation$

    this.pictures$.subscribe(console.log)
    this._createForm()
    this._initializeForm()
  }

  updateConsultation(consultation: Consultation | any) {
    this._dataService
      .updateConsultation(consultation)
      .switchMap(() => {
        if (navigator.onLine) {
          return this.pictures$
            .first()
            .switchMap((pics) => {
              const pictures = [...pics, ...this._readPictures(this.dynamicFormRef.form.value)]
              return this._dataService.updateConsultationImages(this._dataService.consultationKey$$.value, pictures)
            })
        } else {
          const customerKey = this._dataService.customerKey$$.value
          const animalKey = this._dataService.animalKey$$.value
          const consultationKey = this._dataService.consultationKey$$.value
          return this._dataService.uid$
            .switchMap(uid => {
              return this._dataService._odb.list(`data/${uid}/pictures/${customerKey}/${animalKey}/${consultationKey}`)
                .first()
                .timeout(100)
                .catch(() => Observable.of([]))
                .switchMap(pics => {
                  const pictures = [...pics, ...this._readPictures(this.dynamicFormRef.form.value)]
                  return this._dataService.updateConsultationImages(this._dataService.consultationKey$$.value, pictures)
                })
            })
            .first()
        }
      })
      .toPromise()
      .then(() => this._router.navigate(['../read'], { relativeTo: this._route }))
      .then((response: any | null | undefined) => this._feedbackService.success$$.next())
      .catch((error: Error | any) => this._feedbackService.error$$.next(error))
  }

  removePicture(picture: any) {
    if (navigator.onLine) {
      this.pictures$ = this.pictures$.map(pictures => pictures.filter(p => p.$key !== picture.$key))
    } else {
      this._feedbackService.error$$.next(`La suppression d'image n'est pas disponible hors-ligne`)
    }
  }

  private _createForm() {
    this.form = this._formBuilder.group({
      date: [new Date(), Validators.required],
      time: ['00:00', Validators.required],
      reason: ['', Validators.required],
      remarks: [''],
      report: [''],
      status: ['', Validators.required],
    })
  }

  private _initializeForm() {
    this._dataService.consultation$
      .first()
      .subscribe(({ date, time, reason, remarks, report, status, pictures }) => {
        this.startDate = date = new Date(+date)
        remarks = remarks ? remarks : ''
        report = report ? report : ''
        this.form.setValue({ date, time, reason, remarks, report, status })
      })
  }

  private _readPictures(pictures: any) {
    const pics = []
    for (const key in pictures) {
      if (pictures.hasOwnProperty(key)) {
        pics.push({ base64: pictures[key], name: 'image' })
      }
    }
    return pics.filter(p => !!p.base64)
  }

  addPictureControl() {
    const imageControl = {
      name: `image-${this.config.length}`,
      type: 'image'
    }
    this.config = [...this.config, imageControl]
  }

  removePictureControl() {
    const config = this.config
    config.pop()
    this.config = config
  }
}
