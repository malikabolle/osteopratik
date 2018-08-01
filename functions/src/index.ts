import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase)
// export { accounting, annualBreedsStatistics, annualRevenueStatistics, backup, onCustomerTransfer, onProfileUpdate, onUserCreate, onYearRead } from './fn/index'
export { accounting, annualBreedsStatistics, annualRevenueStatistics, backup, onCustomerTransfer, onUserCreate, onYearRead } from './fn/index'
