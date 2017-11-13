import { toArray, normalizeSnapshots, defaultDatasetFactory, fromThisYear } from '../utilities/utilities'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const cors = require('cors')
import { Invoice, invoiceStatus } from '../models/invoice'

const monthLabels = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Aout',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

export const annualRevenueStatistics = functions.https.onRequest((req, res) => {
  cors({ origin: true })(req, res, () => {
    if (req.method !== 'POST') { res.status(405).send('Method not allowed') }
    const idToken = (req.headers.authorization as string).split('Bearer ')[1]
    return admin.auth().verifyIdToken(idToken)
      .then(decodedToken => {
        const { uid } = decodedToken

        // const uid = 'A9OLw37ApSY5vE368Wvf2CAlGhc2'
        return admin
          .database()
          .ref(`users/${uid}/customers`)
          .once('value')
          .then(snapshot => normalizeSnapshots(snapshot))
          .then(customers => customers
            .map(customer => {
              const { animals } = customer
              return toArray(animals)
                .reduce((acc, animal) => {
                  const { consultations } = animal
                  // consultations that have invoices which have been paid this year
                  const invoices = toArray(consultations)
                    .filter(({ invoice }) => !!invoice)
                    .map(({ invoice }) => invoice)
                    .filter(({ status }) => status === invoiceStatus.invoicePaid)
                    .filter(({ emissionDate }) => fromThisYear(emissionDate))
                    // flatten consultation -> invoice
                    .reduce((_acc, invoice) => {
                      const { invoiceNumber, amount, fees, discount, vat, emissionDate } = invoice as Invoice
                      const emission = new Date(emissionDate)
                      const month = emission.getMonth()
                      const subtotal = amount + fees - discount
                      const total = amount * (100 + vat) / 100
                      return [..._acc, { month, total }]
                    }, [])
                  // flatten animal -> consultation (which has been already flatten to invoice) so animal -> invoice
                  return [...acc, ...invoices]
                }, [])
            })
            // flatten customer -> animal (... see above for details)
            .reduce((acc, curr) => [...acc, ...curr], [])
            // build a bidimensionnal array where each child array is a month ( [ [January revenues], [February revenues], [...]])
            .reduce((acc, curr) => {
              if (acc === null) { acc = monthLabels.map(label => []) }
              if (!acc[curr['month']]) { acc[curr['month']] = [] }
              const { total } = curr
              acc[curr['month']].push(total)
              return acc
            }, null)
            .reduce((acc, curr, index) => {
              // intiialize the chartjs dataset object
              if (acc === null) { acc = defaultDatasetFactory([`Chiffre d'affaire par mois à l'année`], 1) }
              // reduce each month's revenue to it's sum
              const monthRevenue = curr.reduce((a, c) => (a + c), 0)
              // add sum and labels
              acc.datasets[0].data.push(monthRevenue)
              acc.labels.push(monthLabels[index])
              return acc
            }, null)
          )
          .then(datasets => res.status(200).send(datasets))
          .catch(error => { res.send(error) })
      })
  })
})