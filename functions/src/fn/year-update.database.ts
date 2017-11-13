import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const onYearRead = functions.database
  .ref('users/{uid}/customers/{customerKey}/animals/{animalKey}/consultations/{consultationKey}/invoice')
  .onUpdate(event => {
    const { data } = event
    const { params } = event
    const { uid, customerKey, animalKey, consultationKey } = params
    const invoice = data.val()
    const { invoiceNumber } = invoice
    const year = +(invoiceNumber as string).split('-')[0]
    const currentYear = (new Date()).getFullYear()
    // const currentYear = 2018
    if (year !== currentYear) {
      console.log(year, currentYear)
      return admin.database()
        .ref(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations/${consultationKey}/invoice`)
        .update({ invoiceNumber: `${currentYear}-1` })
        .then(() => admin.database().ref(`users/${uid}/settings/invoiceNumber`).set(2))
        .then(() => admin.database().ref('public/year').set(currentYear))
    } else {
      Promise.resolve(true)
    }
  })

