// Import the functions you need from the SDKs you need
import { getDatabase } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF_KzPNoYl8Os9xjtUW42GFtudzEq-miE",
  authDomain: "ftttest-52dfe.firebaseapp.com",
  databaseURL:
    "https://ftttest-52dfe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ftttest-52dfe",
  storageBucket: "ftttest-52dfe.appspot.com",
  messagingSenderId: "650974641790",
  appId: "1:650974641790:web:fde57b04c0a56eac37a22f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database, app };
