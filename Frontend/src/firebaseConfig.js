import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANgKfrarQpsKmslrp78fNiMBOZOQqm6Bc",
  authDomain: "nhwallpaper-73aee.firebaseapp.com",
  projectId: "nhwallpaper-73aee",
  storageBucket: "nhwallpaper-73aee.firebasestorage.app",
  messagingSenderId: "192665519303",
  appId: "1:192665519303:web:d14661148eeed827c92ae2",
  measurementId: "G-YKM4CF5799"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);