import { Injectable } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFireOfflineDatabase, AfoListObservable, AfoObjectObservable } from 'angularfire2-offline'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'

import { GeocoderService } from './geocoder.service'
import { toArray } from './../functions/utilities'

import { Settings } from './../models/settings'
import { Profile } from './../models/profile'
import { Breed } from './../models/breed'
import { Customer } from './../models/customer'
import { Animal } from './../models/animal'
import { Consultation, consultationStatus } from './../models/consultation'
import { Invoice, InvoiceTemplate, invoiceStatus } from './../models/invoice'

@Injectable()
export class DataService {
  uid$: Observable<string>

  breeds$: Observable<Breed[]>

  settings$: Observable<Settings>

  profile$: Observable<Profile>
  profiles$: Observable<Profile[]>

  access$: Observable<any>
  accesses$: Observable<{ active: boolean, admin: boolean, $key?: string, $exists?: string, $value?: string }[]>

  customerKey$$: BehaviorSubject<string> = new BehaviorSubject('')
  customers$: Observable<Customer[]>
  customer$: Observable<Customer>

  animalKey$$: BehaviorSubject<string> = new BehaviorSubject('')
  animals$: Observable<Animal[]>
  animal$: Observable<Animal>

  consultationKey$$: BehaviorSubject<string> = new BehaviorSubject('')
  consultations$: Observable<Consultation[]>
  consultation$: Observable<Consultation>

  // consultation's pictures (assoc)
  pictures$: Observable<any[]>

  // consultation's invoice (child)
  invoiceKey$$: BehaviorSubject<string> = new BehaviorSubject('')
  invoice$: Observable<Invoice>
  allInvoices$: Observable<Invoice[]>

  // custom interpolation + markdown template (see invoice-renderer service)
  invoiceTemplate$: Observable<InvoiceTemplate | any>
  // base64 logo
  invoiceLogo$: Observable<string>

  // shared space
  share$: Observable<any>

  // actual year
  // year$: Observable<number>

  constructor(
    public _odb: AngularFireOfflineDatabase,
    public _db: AngularFireDatabase,
    private _auth: AngularFireAuth,
    private _geocoderService: GeocoderService
  ) {
    this.uid$ = this._auth.authState.filter(user => !!user).map(({ uid }) => uid)

    // available offline
    // this.year$ = this._odb.object('public/year').map(s => s.$value)

    this.breeds$ = this.uid$.switchMap(uid => this._odb.list(`users/${uid}/breeds`))
      .map((breeds: Breed[]) => breeds.sort((a: Breed, b: Breed) => a.name >= b.name ? 1 : -1))

    this.settings$ = this.uid$.switchMap(uid => this._odb.object(`users/${uid}/settings`))
    this.profile$ = this.uid$.switchMap(uid => this._odb.object(`users/${uid}/profile`))

    this.invoiceTemplate$ = this.uid$.switchMap(uid => this._odb.object(`users/${uid}/settings/invoiceTemplate`))
      .map(template => template.$value)
    this.invoiceLogo$ = this.uid$.switchMap(uid => this._odb.object(`users/${uid}/settings/invoiceLogo`))
      .map(template => template.$value)
    this.access$ = this.uid$.switchMap(uid => this._odb.object(`users/${uid}/access`))

    this.customer$ = this.uid$.switchMap(uid => this.customerKey$$.asObservable()
      .switchMap(customerKey => this._odb.object(`users/${uid}/customers/${customerKey}`)))
    this.customers$ = this.uid$.switchMap(uid => this.customerKey$$.asObservable()
      .switchMap(customerKey => this._odb.list(`users/${uid}/customers`)))

    this.animal$ = this.uid$.switchMap(uid => this.customerKey$$.asObservable()
      .switchMap((customerKey: string) => this.animalKey$$.asObservable()
        .switchMap(animalKey => this._odb.object(`users/${uid}/customers/${customerKey}/animals/${animalKey}`))
        .switchMap((animal: Animal) => this.breeds$.map(breeds => {
          const _breed = breeds.find(breed => animal.breedKey === breed.$key) || { name: '' }
          animal.breed = _breed.name
          return animal
        }))))

    this.animals$ = this.uid$.switchMap(uid => this.customerKey$$.asObservable()
      .switchMap(customerKey => this._odb.list(`users/${uid}/customers/${customerKey}/animals`)
        .switchMap((animals: Animal[]) => Observable.from(animals)
          .mergeMap((animal: Animal) => this.breeds$.map(breeds => {
            const _breed = breeds.find(breed => animal.breedKey === breed.$key) || { name: '' }
            animal.breed = _breed.name
            return animal
          }))
          .scan((acc, curr) => [...acc, curr], []))))
      .debounceTime(5)

    this.consultations$ = this.uid$.switchMap(uid => this.customerKey$$.asObservable()
      .switchMap(customerKey => this.animalKey$$.asObservable()
        .switchMap(animalKey => this._odb.list(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations`))))
    this.consultation$ = this.uid$.switchMap(uid => this.customerKey$$.asObservable()
      .switchMap(customerKey => this.animalKey$$.asObservable()
        .switchMap(animalKey => this.consultationKey$$.asObservable()
          .switchMap(consultationKey => this._odb.object(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations/${consultationKey}`)))))

    this.invoice$ = this.uid$.switchMap(uid => this.customerKey$$.asObservable()
      .switchMap(customerKey => this.animalKey$$.asObservable()
        .switchMap(animalKey => this.consultationKey$$.asObservable()
          .switchMap(consultationKey => this._odb.object(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations/${consultationKey}/invoice`)))))


    // avaiable online only

    //  has to be out of the user structure as it's the only thing that really eat up disk space and so bandwith
    this.pictures$ = this.uid$
      .switchMap(uid => this.customerKey$$.asObservable()
        .switchMap(customerKey => this.animalKey$$.asObservable()
          .switchMap(animalKey => this.consultationKey$$.asObservable()
            .switchMap(consultationKey => this._db.list(`data/${uid}/pictures/${customerKey}/${animalKey}/${consultationKey}`)))))
      .startWith([])
      .map(pictures => {
        console.log(!navigator.onLine, !pictures)
        if (!navigator.onLine && !pictures) {
          return []
        } else {
          return pictures
        }
      })

    this.share$ = this.uid$
      .switchMap(uid => this._db.list(`share-access/${uid}`)
        .switchMap((keys: any[]) => keys)
        .switchMap(({ $key: access }) => this._db.list(`share/${access}/${uid}/customers`)))


    this.profiles$ = this._db.list(`public/users/profiles`)

    this.accesses$ = this._db.list(`public/users/profiles`).map(keys => toArray(keys))

    this.allInvoices$ = this.customers$
      .map((customers: Customer[]) => customers
        .reduce((acc, { animals }) => [...acc, ...toArray(animals)], [])
        .filter((animal: Animal) => !!animal.consultations)
        .reduce((acc, { consultations }) => [...acc, ...toArray(consultations)], [])
        .filter((consultation: Consultation) => !!consultation.invoice)
        .map(({ invoice }) => invoice))
  }

  updateSettings(settings: Settings | any) {
    for (const prop in settings) {
      if (settings[prop] === undefined) {
        settings[prop] = ''
      }
    }
    return this.uid$.switchMap(uid => this._odb.object(`users/${uid}/settings`).update({ ...settings })['offline'])
      .first()
      .toPromise()
  }

  updateProfile(profile: Profile | any) {
    return this.uid$.switchMap(uid => this._odb.object(`users/${uid}/profile`).update({ ...profile })['offline'])
      .first()
      .toPromise()
  }

  toggleAccount(uid: string, active: boolean): Promise<any> {
    return this._odb.object(`users/${uid}/access`).update({ active })['offline']
  }

  addBreed(breed: Breed) {
    return this.uid$.switchMap(uid => this._odb.list(`users/${uid}/breeds`).push(breed)['offline'])
      .first()
      .toPromise()
  }

  updateBreed(breedKey: string, breed: Breed | any) {
    return this.uid$.switchMap(uid => this._odb.object(`users/${uid}/breeds/${breedKey}`).set(breed)['offline'])
      .first()
      .toPromise()
  }

  addCustomer(customer: Customer) {
    return this.uid$.switchMap(uid => {
      const { street, zip, city, region, country } = customer.address
      return this._geocoderService
        .geocode(street, zip, city, region, country)
        .switchMap(latlng => {
          customer.latlng = latlng
          return this._odb.list(`users/${uid}/customers`).push(customer)['offline']
        })
    })
      .first()
      .toPromise()
  }

  updateCustomer(customerKey: string, customer: Customer | any) {
    return this.uid$.switchMap(uid => {
      const { street, zip, city, region, country } = customer.address
      if (navigator.onLine) {
        return this._geocoderService
          .geocode(street, zip, city, region, country)
          .switchMap(latlng => {
            customer.latlng = latlng
            return this._odb.object(`users/${uid}/customers/${customerKey}`).update({ ...customer })['offline']
          })
      } else {
        return this._odb.object(`users/${uid}/customers/${customerKey}`).update({ ...customer })['offline']
      }
    })
      .first()
      .toPromise()
  }

  addAnimal(animal: Animal) {
    const customerKey = this.customerKey$$.value
    return this.uid$.switchMap(uid => this._odb.list(`users/${uid}/customers/${customerKey}/animals`).push(animal)['offline'])
      .first()
      .toPromise()
  }

  updateAnimal(animalKey: string, animal: Animal | any) {
    const customerKey = this.customerKey$$.value
    return this.uid$.switchMap(uid => this._odb.object(`users/${uid}/customers/${customerKey}/animals/${animalKey}`).update({ ...animal })['offline'])
      .first()
      .toPromise()
  }

  addConsultation(consultation: Consultation | any) {

    const customerKey = this.customerKey$$.value
    const animalKey = this.animalKey$$.value
    const status = consultationStatus.consultationProgrammed
    const { date } = consultation
    return this.uid$.switchMap(uid => this._odb.list(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations`).push({ ...consultation, status, date: +date })['offline'])
      .first()
      .toPromise()
  }

  updateConsultation(consultation: Consultation | any) {
    const customerKey = this.customerKey$$.value
    const animalKey = this.animalKey$$.value
    const consultationKey = this.consultationKey$$.value
    const { date } = consultation
    return this.uid$
      .switchMap(uid => this._odb
        .object(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations/${consultationKey}`)
        .update({ ...consultation, date: +date })['offline'])
      .first()
  }

  //  has to be out of the user structure as it's the only thing that really eat up disk space and so bandwith and we don't want it to be accessible offline
  updateConsultationImages(consultationKey: string, pictures: any[]) {
    const customerKey = this.customerKey$$.value
    const animalKey = this.animalKey$$.value
    return this.uid$
      .switchMap(uid => Observable
        .fromPromise(this._odb.list(`data/${uid}/pictures/${customerKey}/${animalKey}/${consultationKey}`).remove()['offline'])
        .switchMap(() => Observable
          .from(pictures)
          .switchMap(p => this._odb.list(`data/${uid}/pictures/${customerKey}/${animalKey}/${consultationKey}`).push(p)['offline'])
          .defaultIfEmpty(true)
        ))
      .first()
      .toPromise()
  }

  addInvoice() {
    const amount$ = this.animal$
      .switchMap(({ breedKey }) => this.breeds$
        .switchMap(x => x)
        .find(({ $key }) => breedKey === $key)
        .first()
        .map(({ price }) => price))

    const settings$ = this.settings$
      .switchMap(({ invoiceNumber, siret, currency, vat }) => this.consultations$
        .map(consultations => ({ invoiceNumber, siret, currency, vat, })))

    return Observable
      .zip(amount$, settings$)
      .first()
      .switchMap(([amount, { siret, currency, vat }]) => {
        // @todo, calculate itinary between A and B to determinate fees on a $/kilometer ratio set by the user
        const discount = 0
        const emissionDate = +new Date()
        const fees = 0
        const invoice = { amount, fees, emissionDate, discount, siret, currency, vat }

        const customerKey = this.customerKey$$.value
        const animalKey = this.animalKey$$.value
        const consultationKey = this.consultationKey$$.value

        return this.uid$.switchMap(uid => Observable
          .fromPromise(this._odb.object(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations/${consultationKey}/invoice`)
            .update({ ...invoice, status: invoiceStatus.invoiceGenerated })['offline']))
      })
      .first()
      .toPromise()
  }

  updateInvoice(invoice: Invoice | any, incrementInvoiceCounter = false) {
    const customerKey = this.customerKey$$.value
    const animalKey = this.animalKey$$.value
    const consultationKey = this.consultationKey$$.value
    return this.uid$.switchMap(uid => Observable
      .fromPromise(this._odb.object(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations/${consultationKey}/invoice`).update({ ...invoice })['offline'])
      .switchMap(() => this._odb.object(`users/${uid}/settings`)
        .switchMap(({ invoiceNumber }) => {
          if (incrementInvoiceCounter) {
            return this._odb.object(`users/${uid}/settings`).update({ invoiceNumber: ++invoiceNumber })['offline']
          } else { return Observable.of(true) }
        })))
      .first()
      .toPromise()
  }

  /* As French law change on the first of January 2018, removing a validated invoice isn't legally allowed anymore */
  removeInvoice() {
    const customerKey = this.customerKey$$.value
    const animalKey = this.animalKey$$.value
    const consultationKey = this.consultationKey$$.value
    return this.uid$.switchMap(uid => Observable
      .fromPromise(this._odb.object(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations/${consultationKey}/invoice`).remove()['offline']))
      .first()
      .toPromise()
  }

  updateInvoiceTemplate(template: InvoiceTemplate, logo: string) {
    return this.uid$.switchMap(uid => {
      const templatePromise = this._odb.object(`users/${uid}/settings/invoiceTemplate`).set(template)['offline']
      const logoPromise = this._odb.object(`users/${uid}/settings/invoiceLogo`).set(logo)['offline']
      return Observable.zip(templatePromise, logoPromise)
    })
      .first()
      .toPromise()
  }

  transferCustomerToSharedSpace(customerKey: string, userKey: string) {

    return this.uid$
      .switchMap(uid => {
        // remove invoice as we don't want them in the annual comptability of the transfer's target
        const setCustomer$ = this._db.object(`users/${uid}/customers/${customerKey}`)
          .map(customer => {
            delete customer.$key
            for (const a in customer.animals) {
              if (customer.animals.hasOwnProperty(a)) {
                for (const c in customer.animals[a].consultations) {
                  if (customer.animals[a].consultations.hasOwnProperty(c)) {
                    delete customer.animals[a].consultations[c].invoice
                    customer.animals[a].consultations[c].status = consultationStatus.consultationTransferred
                  }
                }
              }
            }
            return customer
          })
          .switchMap(customer => this._db.object(`share/${uid}/${userKey}/customers/${customerKey}`).set(customer))

        // set breeds not the breask relationships
        const setBreeds$ = this._db.list(`users/${uid}/customers/${customerKey}/animals`)
          .switchMap(x => x)
          .map(({ breedKey }) => breedKey)
          .mergeMap(key => this._db.object(`users/${uid}/breeds/${key}`)
            .switchMap((breed: Breed) => {
              const { $key, name, price } = breed

              return this._db.object(`share/${uid}/${userKey}/breeds/${$key}`).set({ name: `${name}-${key}`, price })
            }))
          .debounceTime(50)
          .scan((acc: any[], curr) => [...acc, curr], [])

        // set pictures
        const setPictures$ = this._db.object(`data/${uid}/pictures/${customerKey}`)
          .switchMap(pictures => {
            const { $key } = pictures
            delete pictures.$key
            return this._db.object(`share/${uid}/${userKey}/pictures/${customerKey}`).set(pictures)
          })

        const setAccess$ = this._db.object(`share-access/${userKey}/${uid}`).set(true)

        return Observable
          .zip(setCustomer$, setBreeds$, setAccess$, setPictures$)

      })
      .first()
      .toPromise()
  }

  transferCustomerFromSharedSpace(customerKey: string) {
    return this.uid$.switchMap(uid => this._db.list(`share-access/${uid}`)
      .switchMap((keys: any[]) => keys)
      .switchMap(({ $key: access }) => {
        const setCustomer$ = this._db.object(`share/${access}/${uid}/customers/${customerKey}`)
          .switchMap(customer => {
            delete customer.$key
            return this._db.object(`users/${uid}/customers/${customerKey}`).set(customer)
          })
        const setBreeds$ = this._db.list(`share/${access}/${uid}/breeds`)
          .switchMap(breeds => breeds)
          .mergeMap((breed: Breed) => {
            const { $key } = breed
            delete breed.$key
            return this._db.object(`users/${uid}/breeds/${$key}`).set(breed)
          })
        const setPictures$ = this._db.object(`share/${access}/${uid}/pictures/${customerKey}`)
          .switchMap(pictures => this._db.object(`data/${uid}/pictures/${customerKey}`).set(pictures))

        return Observable
          .zip(setCustomer$, setBreeds$, setPictures$)
          .switchMap(() => this._db.object(`share-access/${uid}/${access}`).remove())
      }))

      .first()
      .toPromise()
  }

  transferAnimal(customerKey: string, srcKey: string) {
    return this._auth.authState
      .switchMap(({ uid }) => this.animal$
        // take only the first value otherwise the deleted record will override the latest write and set undefined values everywhere as the record won't exist anymore.
        .first()
        .switchMap(animal => this._db.object(`users/${uid}/customers/${customerKey}/animals/${animal.$key}`).set({ ...animal }).then(() => animal))
        .switchMap(animal => this._db.object(`users/${uid}/customers/${srcKey}/animals/${animal.$key}`).remove()))
  }

  updateAccess() {
    return this.uid$
      .switchMap(uid => this._odb.object(`users/${uid}/access/valid`).set(true))
      .first()
      .toPromise()
  }
}
