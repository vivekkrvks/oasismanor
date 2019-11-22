import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDPo515PjSOENeIp1wfQrOgOeBw07APDiw",
  authDomain: "oasis-manors.firebaseapp.com",
  databaseURL: "https://oasis-manors.firebaseio.com",
  projectId: "oasis-manors",
  storageBucket: "",
  messagingSenderId: "357021294693",
  appId: "1:357021294693:web:a3be1049f9bab34b"
};
// Initialize Firebase
const Fire = firebase.initializeApp(firebaseConfig);

export default Fire;
