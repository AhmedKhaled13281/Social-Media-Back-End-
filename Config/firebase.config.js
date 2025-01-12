// // Import the functions you need from the SDKs you need
// //import { initializeApp } from "firebase/app";
// const {initializeApp} = require("firebase/app")
// const {getStorage} = require('firebase/storage')
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCk391zaAaUqix33ekDc0BoW444LAHBkqo",
//   authDomain: "social-media-22324.firebaseapp.com",
//   projectId: "social-media-22324",
//   storageBucket: "social-media-22324.firebasestorage.app",
//   messagingSenderId: "429378017256",
//   appId: "1:429378017256:web:bd3524918babb5de8fb65d"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
//////////////////////////////////////////////////////////////////////
// Import the functions you need from the SDKs you need
const {initializeApp} = require("firebase/app")
const {getStorage} = require('firebase/storage')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3A3qlMwOVT-k-czpSbOezxu7zVFDnKSU",
  authDomain: "upload-image-e51dc.firebaseapp.com",
  projectId: "upload-image-e51dc",
  storageBucket: "upload-image-e51dc.appspot.com",
  messagingSenderId: "436114753116",
  appId: "1:436114753116:web:7793cc22a9f3abf0670899"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage