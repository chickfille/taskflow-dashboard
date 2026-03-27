import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB3k_mElPbAU4gBJIRVvkpzGr9FBR1KWQo',
  authDomain: 'taskflow-dashboard-777.firebaseapp.com',
  projectId: 'taskflow-dashboard-777',
  storageBucket: 'taskflow-dashboard-777.firebasestorage.app',
  messagingSenderId: '994640224294',
  appId: '1:994640224294:web:d3eaf9991ad8c7b1cd46e7',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)