// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
const {initializeApp} = require("firebase/app")
const {getStorage} = require('firebase/storage')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk391zaAaUqix33ekDc0BoW444LAHBkqo",
  authDomain: "social-media-22324.firebaseapp.com",
  projectId: "social-media-22324",
  storageBucket: "social-media-22324.firebasestorage.app",
  messagingSenderId: "429378017256",
  appId: "1:429378017256:web:bd3524918babb5de8fb65d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage