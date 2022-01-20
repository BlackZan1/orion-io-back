import * as admin from 'firebase-admin'
import 'firebase-admin/storage'
import 'firebase/storage'

const credentialsJSON = require('../services.json')

// config
const firebaseConfig = {
    'projectId': 'fir-monki-scoring',
    'appId': '1:975313041113:web:05edc11bd67240d4b5f0c8',
    'storageBucket': 'fir-monki-scoring.appspot.com',
    'locationId': 'asia-northeast2',
    'apiKey': 'AIzaSyDHjCAa-Vuea2SXdGM2YyX8tgEAkqJKack',
    'authDomain': 'fir-monki-scoring.firebaseapp.com',
    'messagingSenderId': '975313041113'
}

//init app
const app = admin.initializeApp({
    ...firebaseConfig,
    credential: admin.credential.cert(credentialsJSON)
})

// init images bucket
export const imgBucket = app.storage().bucket('gs://fir-monki-scoring.appspot.com')