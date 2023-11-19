
import { initializeApp } from "firebase/app";
import {getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB_np7pOAhsX0VGgneEtq4bCDmqmDASdAc",
  authDomain: "capstone-74be8.firebaseapp.com",
  projectId: "capstone-74be8",
  storageBucket: "capstone-74be8.appspot.com",
  messagingSenderId: "575373605196",
  appId: "1:575373605196:web:9a8ce81801af0ec7f0b7e9",
  measurementId: "G-76NS7Y260R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);