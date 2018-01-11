// import { toArray, normalizeSnapshots } from '../utilities/utilities'
// import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'
// const cors = require('cors')

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! NEVER UPLOAD THIS IN PRODUCTION !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// export const changeInvoiceNumber = functions.https.onRequest((req, res) => {
//   cors({ origin: true })(req, res, () => {
//     const uid = 'jggcVeGFLAaH2nTai9iWc9aVfbH2'
//     return admin
//       .database()
//       .ref(`users/${uid}/customers`)
//       .once('value')
//       .then(snapshots => normalizeSnapshots(snapshots))
//       .then(customers => customers
//         .map(customer => {
//           const customerKey = customer.$key
//           const { animals } = customer
//           return toArray(animals)
//             .reduce((acc, animal) => {
//               const animalKey = animal.$key
//               const { consultations } = animal
//               const invoices = toArray(consultations)
//                 .filter(consultation => !!consultation.invoice && !!consultation.invoice.invoiceNumber)
//                 .map((consultation) => {
//                   return {
//                     customerKey,
//                     animalKey,
//                     consultationKey: consultation.$key,
//                     invoiceNumber: consultation.invoice.invoiceNumber,
//                     emissionDate: consultation.invoice.emissionDate,
//                   }
//                 })
//               return [...acc, ...invoices]
//             }, [])
//         })
//         .reduce((acc, curr) => [...acc, ...curr], [])
//         .sort((a, b) => +a.invoiceNumber.split('-')[1] > +b.invoiceNumber.split('-')[1] ? 1 : -1)
//         .filter(x => +x.invoiceNumber.split('-')[0] === 2018)
//       )
//       .then(x => res.send(x))
//       .catch(x => res.send(x))
//   })
// })

