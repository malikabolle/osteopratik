// import { https } from 'firebase-functions'
// import { database } from 'firebase-admin'
// import * as fs from 'fs'

// const customers = JSON.parse(fs.readFileSync('xxx', 'utf-8'))

// export const importCustomers = https.onRequest((req, res) => {
//   const uid = 'xxx'
//   return Promise
//     .all(customers
//       .map(customer => database()
//         .ref(`users/${uid}/customers`)
//         .push(customer)))
//     .then(r => res.send(r))
//     .catch(e => res.send(e))
// })
