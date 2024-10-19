// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAElG2o1zD4d2jFUWgioZOoqyGIDNuwuHQ",
  authDomain: "ftt-a8376.firebaseapp.com",
  databaseURL:
    "https://ftt-a8376-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ftt-a8376",
  storageBucket: "ftt-a8376.appspot.com",
  messagingSenderId: "527263678253",
  appId: "1:527263678253:web:a66261c3c80c6a9ddb5da4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database, app };
