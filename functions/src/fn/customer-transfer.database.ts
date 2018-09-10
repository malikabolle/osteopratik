import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
export const onCustomerTransfer = functions.database.ref('share-access/{uid}/{srcUid}').onDelete((event: any) => {
  const { params } = event
  const { uid, srcUid } = params
  return admin.database().ref(`share/${srcUid}/${uid}`).remove()
})
