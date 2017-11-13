import { mock, breeds } from '../mock/mock'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const mockDb = functions.https.onRequest((req, res) => {
  // admin.database().ref('users').child('jjdmFwN0rYNXVC1QHa9dw7gYz252').child('customers').remove()
  // admin.database().ref('users').child('jjdmFwN0rYNXVC1QHa9dw7gYz252').child('breeds').remove()

  return Promise
    .all([
      admin.database().ref('users').child('jjdmFwN0rYNXVC1QHa9dw7gYz252').child('breeds').set(breeds),
      ...mock.map(customer => admin.database().ref('users').child('jjdmFwN0rYNXVC1QHa9dw7gYz252').child('customers').push(customer))
    ])
})
