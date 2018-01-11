// Filter hashed breeds ? If user hasnt change breed and create new consult what happens ??
import { toArray, normalizeSnapshots } from '../utilities/utilities'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const cors = require('cors')
import { Invoice, invoiceStatus } from '../models/invoice'


export const accounting = functions.https.onRequest((req, res) => {
  cors({ origin: true })(req, res, () => {
    if (req.method !== 'POST') { res.status(405).send('Method not allowed') }
    const idToken = (req.headers.authorization as string).split('Bearer ')[1]
    return admin.auth().verifyIdToken(idToken)
      .then(decodedToken => {
        const { uid } = decodedToken
        const selectedYear = +req.body.year

        return admin.database().ref(`users/${uid}/customers`).once('value')
          .then(snapshot => normalizeSnapshots(snapshot))
          .then(customers => {
            const invoices = customers
              .map(customer => {
                const { firstName, lastName } = customer
                const name = `${firstName} ${lastName}`
                const { animals } = customer

                return toArray(animals)
                  .reduce((_acc, animal) => {
                    const { consultations } = animal
                    const _paidInvoices = toArray(consultations)
                      .filter(({ invoice }) => !!invoice)
                      .map(({ invoice }) => invoice)
                      .filter(({ emissionDate }) => {
                        const date = new Date(emissionDate)
                        const year = date.getFullYear()
                        return year === selectedYear
                      })
                      .filter(({ status }) => status === invoiceStatus.invoicePaid)
                      .reduce((__acc, invoice) => {
                        const { invoiceNumber, amount, fees, discount, vat, emissionDate } = invoice as Invoice
                        const subtotal = amount + fees - discount
                        const total = subtotal * (100 + vat) / 100
                        const paidInvoice = { emissionDate, invoiceNumber, name, total }
                        return [...__acc, paidInvoice]
                      }, [])

                    return [..._acc, ..._paidInvoices]
                  }, [])
              })
              .reduce((acc, curr) => [...acc, ...curr], [])

            const sum = invoices.reduce((acc, curr) => (acc + curr.total), 0)
            return { invoices, sum }
          })
          .then(paidInvoices => res.status(200).send(paidInvoices))
          .catch(error => { res.send(error) })
      })
  })
})
