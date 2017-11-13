import * as casual from 'casual'

casual.define('sex', () => {
  const items = [
    'male',
    'female',
    'undefined'
  ]
  return items[Math.floor(Math.random() * items.length)]
})
casual.define('breed', () => {
  const items = [
    'Chat',
    'Chien',
    'Cheval',
    'Vache',
  ]
  return items[Math.floor(Math.random() * items.length)]
})
casual.define('breedKey', () => {
  const items = [0, 1, 2, 3, 4]
  return items[Math.floor(Math.random() * items.length)]
})

casual.define('consultationStatus', () => {
  const items = [
    'programmed',
    'done',
    'canceled'
  ]
  return items[Math.floor(Math.random() * items.length)]
})

casual.define('currency', () => {
  const items = [
    'CHF',
    'EUR',
  ]
  return items[Math.floor(Math.random() * items.length)]
})
casual.define('VAT', () => {
  const items = [0, 8, 20, 19.6]
  return items[Math.floor(Math.random() * items.length)]
})
