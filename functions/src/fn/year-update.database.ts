import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
// import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';

export const onYearRead = functions.database
  .ref('users/{uid}/customers/{customerKey}/animals/{animalKey}/consultations/{consultationKey}/invoice')
  .onUpdate((event: any) => {
    //   const { data } = event
    //   const { previous, current } = data

    //   const oldData = previous.val()
    //   const newData = current.val()
    //   if (newData.invoiceNumber === oldData.invoiceNumber) {
    //     return Promise.resolve('write unecessary')
    //   }

    //   const { params } = event
    //   const { uid, customerKey, animalKey, consultationKey } = params
    //   const invoice = data.val()
    //   const { invoiceNumber } = invoice
    //   const year = +(invoiceNumber as string).split('-')[0]
    //   const currentYear = (new Date()).getFullYear()


    //   if (year !== currentYear) {
    //     console.log(year, currentYear)
    //     return admin.database()
    //       .ref(`users/${uid}/customers/${customerKey}/animals/${animalKey}/consultations/${consultationKey}/invoice`)
    //       .update({ invoiceNumber: `${currentYear}-1` })
    //       .then(() => admin.database().ref(`users/${uid}/settings/invoiceNumber`).set(2))
    //       .then(() => admin.database().ref('public/year').set(currentYear))
    //       .catch(() => Promise.reject('Write failed'))
    //   } else {
    //     return Promise.resolve('Write unecessary')
    // }
    console.log('updated')
  })

// add statement to avoid recursive onUpdate calls because of write at same location
