// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU7CYP8ycigRztsVISKdbQPYopurM2mLk",
  authDomain: "meekor-7f10c.firebaseapp.com",
  projectId: "meekor-7f10c",
  storageBucket: "meekor-7f10c.appspot.com",
  messagingSenderId: "439981870169",
  appId: "1:439981870169:web:f0bd31e1a245d765ae3548",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// // Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export default storage;
