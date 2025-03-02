import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp, db } from "./firebaseConfig"; // ✅ `firebaseApp`으로 가져옴

// ✅ Firebase Auth & Google Provider 설정
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider, db };
