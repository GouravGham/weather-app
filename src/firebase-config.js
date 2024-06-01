import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCLEO5wZwAMRqfTizgHw08Lifn4dWD_OTw",
  authDomain: "gg-weather-app.firebaseapp.com",
  projectId: "gg-weather-app",
  storageBucket: "gg-weather-app.appspot.com",
  messagingSenderId: "993582155622",
  appId: "1:993582155622:web:8b91bb43b176573ea12aa7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
