import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const onUserCreate = functions.auth.user().onCreate(event => {
  const { data } = event
  const { uid } = data
  return admin.database().ref(`users/${uid}/access`).set({ active: false, admin: false })
})
