import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Create a public space for reading users data
export const onProfileUpdate = functions.database.ref('users/{uid}/profile').onWrite(event => {
  const { params } = event
  const { uid } = params
  const { data } = event
  const value = data.val()
  return admin.database().ref(`public/users/profiles/${uid}`).set(value)
})
