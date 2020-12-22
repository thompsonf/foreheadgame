import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBYKOVBqrGg2mVk4RC2_myO_Lc83wJPXqU",
  authDomain: "foreheadgame.firebaseapp.com",
  databaseURL: "https://foreheadgame-default-rtdb.firebaseio.com",
  projectId: "foreheadgame",
  storageBucket: "foreheadgame.appspot.com",
  messagingSenderId: "193886983515",
  appId: "1:193886983515:web:86a00132ea4229e785767e",
};
firebase.initializeApp(config);
export const db = firebase.database();
