import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const cors = require('cors')
import * as fs from 'fs'
import * as path from 'path'

import * as _storage from '@google-cloud/storage'
const storage = _storage()
const appBucketRef = functions.config().firebase.storageBucket
const appBucketUrl = `gs://${appBucketRef}/`
const appBucket = storage.bucket(appBucketRef)

// Raw database backup in storage
export const backup = functions.https.onRequest((req, res) => {
  cors({ origin: true })(req, res, () => {
    if (req.method !== 'POST') { res.status(405).send('Method not allowed') }
    const idToken = (req.headers.authorization as string).split('Bearer ')[1]
    admin.auth().verifyIdToken(idToken).then(decodedToken => {
      const { uid } = decodedToken
      return admin.database().ref(`users/${uid}/access/admin`).once('value').then(snapshot => snapshot.val())
        .then(isAdmin => {
          if (isAdmin) {
            return admin.database().ref('/').once('value').then(snapshot => snapshot.val())
              .then(db => {
                const p = path.join('/', 'tmp', 'backup.json')
                fs.writeFileSync(p, JSON.stringify(db))
                const destination = `backup/${(+new Date())}/raw-database.json`
                return appBucket.upload(p, { destination })
                  .then(() => res.status(200).send({ url: `${appBucketUrl}/${destination}` }))
              })
          } else {
            return Promise.reject(res.status(401).send({ error: new Error('BACKUP FAILED') }))
          }
        })
    })
      .catch(error => { res.send(error) })
  })
})
