import { environment } from './../../../environments/environment'

export const FIREBASE_CONFIG = {
  production: environment.production,
  apiKey: 'AIzaSyC4Q3uDcPU773OFWpNBCJ-s8I8mCBOlOeE',
  authDomain: 'osteo-pratik.firebaseapp.com',
  databaseURL: 'https://osteo-pratik.firebaseio.com',
  projectId: 'osteo-pratik',
  storageBucket: 'osteo-pratik.appspot.com',
  messagingSenderId: '174852614294'
}
export const FIREBASE_FUNCTIONS_ROOT = environment.production ? 'https://us-central1-osteo-pratik.cloudfunctions.net' : 'http://localhost:5000/osteo-pratik/us-central1'
