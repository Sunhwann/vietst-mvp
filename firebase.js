// /vietst-mvp/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// 👉 Firebase Console에서 복사한 설정 정보 여기에 추가!
const firebaseConfig = {
    apiKey: "AIzaSyAxUBP2Q2Sp053zHWATqEZfcmz2SC9h7ec",
    authDomain: "vietflue.firebaseapp.com",
    projectId: "vietflue",
    storageBucket: "vietflue.firebasestorage.app",
    messagingSenderId: "952034654039",
    appId: "1:952034654039:web:1b03ab91e51c1c13503012",
    measurementId: "G-78KKPVXB2B"
  };

// 🔥 Firebase 초기화
const app = initializeApp(firebaseConfig);

// 🔥 Firebase 서비스 초기화
const db = getFirestore(app);               // Firestore (DB)
const auth = getAuth(app);                  // Authentication (로그인)
const storage = getStorage(app);             // Storage (파일 저장)
const provider = new GoogleAuthProvider();   // Google 로그인 제공자

export { db, auth, storage, provider };
