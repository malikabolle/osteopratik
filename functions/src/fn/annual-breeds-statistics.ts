import { toArray, normalizeSnapshots, defaultDatasetFactory, fromThisYear, isHashed } from '../utilities/utilities'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const cors = require('cors')
import { Invoice, invoiceStatus } from '../models/invoice'
import { Breed } from '../models/breed'


export const annualBreedsStatistics = functions.https.onRequest((req, res) => {
  cors({ origin: true })(req, res, () => {
    if (req.method !== 'POST') { res.status(405).send('Method not allowed') }
    const idToken = (req.headers.authorization as string).split('Bearer ')[1]
    return admin.auth().verifyIdToken(idToken)
      .then(decodedToken => {
        const { uid } = decodedToken
        // const uid = '09vRh09UMIak74FIkPsdIX9Sd0v1'
        return admin.database().ref(`users/${uid}/breeds`)
          .once('value')
          .then(snapshot => normalizeSnapshots(snapshot))
          .then(breeds => breeds.filter(({ name }) => !isHashed(name)))
          .then(breeds => admin
            .database()
            .ref(`users/${uid}/customers`)
            .once('value')
            .then(snapshot => normalizeSnapshots(snapshot))
            .then(customers => customers
              .map(customer => {
                const { animals } = customer
                return toArray(animals)
                  .reduce((acc, animal) => {
                    const { consultations, breedKey } = animal
                    // count invoices
                    const count = toArray(consultations)
                      .filter(({ invoice }) => !!invoice)
                      .map(({ invoice }) => invoice)
                      .filter(({ status }) => status === invoiceStatus.invoicePaid)
                      .filter(({ emissionDate }) => fromThisYear(emissionDate))
                      .length
                    const breed = breeds.find(({ $key }) => $key === breedKey) as Breed
                    if (breed) {
                      const { name, price } = breed
                      const sum = +price * count
                      return [...acc, { name, sum, count }]
                    } else {
                      return [...acc]
                    }
                  }, [])
              })
              .reduce((acc, curr) => [...acc, ...curr], [])
              .reduce((acc, { name, count, sum }) => {
                if (acc === null) { acc = defaultDatasetFactory([`Nombre de consultation par espèce à l'année`, `Chiffre d'affaire par espèce à l'année`], 2) }
                const index = acc.labels.indexOf(name)
                if (index !== -1) {
                  acc.datasets[0].data[index] += count
                  // acc.datasets[1].data[index] += sum
                } else {
                  acc.datasets[0].data.push(count)
                  acc.datasets[1].data.push(sum)
                  acc.labels.push(name)
                }
                return acc
              }, null)
            ))
          .then(datasets => res.status(200).send(datasets))
          .catch(error => { res.send(error) })
      })
  })
})
