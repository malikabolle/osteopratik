import * as casual from 'casual'
// import * as base64 from 'base64-img'
// import { pictures } from './pictures'
import * as randomCoordinates from 'random-coordinates'

import { Customer } from '../models/customer'
import { Animal } from '../models/animal'
import { Consultation } from '../models/consultation'
import { Invoice } from '../models/invoice'
import { Address } from '../models/address'
import { LatLng } from '../models/latlng'

let _invoiceNumber = 100
const invoiceNumber = () => {
  return _invoiceNumber = ++_invoiceNumber
}

export const breeds = [
  { name: 'Chat', price: 200 },
  { name: 'Chien', price: 250 },
  { name: 'Cheval', price: 500 },
  { name: 'Poney', price: 300 },
  { name: 'Vache', price: 400 },
  { name: 'Petit oiseau', price: 200 },
  { name: 'Grand oiseau', price: 500 },
  { name: 'Animal dangereux', price: 1000 },
]

casual.define('sex', () => {
  const items = [
    'male',
    'female',
    'undefined'
  ]
  return items[Math.floor(Math.random() * items.length)]
})
casual.define('timestamp', () => {
  return +new Date(2017, casual.month_number, casual.day_of_month)
})
casual.define('breed', () => {
  const items = breeds
  return items[Math.floor(Math.random() * items.length)]
})
casual.define('breedKey', () => {
  const items = ['0', '1', '2', '3', '4', '5', '6', '7']
  return items[Math.floor(Math.random() * items.length)]
})

casual.define('consultationStatus', () => {
  const items = [
    // 'programmed',
    'done',
    'canceled'
  ]
  return items[Math.floor(Math.random() * items.length)]
})
casual.define('invoiceStatus', () => {
  const items = [
    // 'generated',
    'done',
    'emitted',
    'paid',
  ]
  return items[Math.floor(Math.random() * items.length)]
})

casual.define('currency', () => {
  const items = [
    'CHF',
    // 'EUR',
  ]
  return items[Math.floor(Math.random() * items.length)]
})
casual.define('vat', () => {
  const items = [0, 8, 20, 19.6]
  return items[Math.floor(Math.random() * items.length)]
})

const address = new Address(
  casual.street,
  casual.zip({ 0: 4, 1: 5 }),
  casual.city,
  casual.state,
  casual.country
)
const [lat, lng] = randomCoordinates().split(',').map(x => +x)
const latlng = new LatLng(lat, lng)


const consultations = Array
  .from(Array(10).keys())
  .map(x => {
    const consultation = new Consultation(
      casual.timestamp,
      casual.time('HH:mm'),
      casual.short_description,
      casual.consultationStatus,
      casual.text,
      casual.short_description,
      [],
      {
        ...new Invoice(
          invoiceNumber(),
          casual.invoiceStatus,
          casual.double(50, 500),
          casual.double(0, 50),
          casual.timestamp,
          casual.double(0, 50),
          Array.from(Array(50).keys()).map(x => casual.letter).reduce((acc, curr) => acc += curr, ''),
          casual.currency,
          casual.vat
        )
      }
    )
    return { ...consultation }
  })

const animals = Array
  .from(Array(20).keys())
  .map(x => {
    const animal = new Animal(
      casual.first_name,
      casual.timestamp,
      casual.sex,
      casual.text,
      casual.breedKey,
      consultations
    )
    return { ...animal }
  })

const customers = Array
  .from(Array(1).keys())
  .map(x => {
    const customer = new Customer(
      casual.first_name,
      casual.last_name,
      casual.phone,
      casual.email,
      address,
      latlng,
      animals
    )
    return { ...customer }
  })

export const mock = customers
