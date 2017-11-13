import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase)
console.log(functions.config().firebase)
export { accounting, annualBreedsStatistics, annualRevenueStatistics, backup, onCustomerTransfer, onProfileUpdate, onUserCreate, onYearRead } from './fn/index'
