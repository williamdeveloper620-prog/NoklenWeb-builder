export const defaultFirebaseTemplate = `// ========================================================
// NoklenWeb Builder - Firebase Configuration & SDK Integration
// ========================================================
// استبدل بيانات الاعتماد أدناه بالقيم الخاصة بمشروعك من Firebase Console:
// https://console.firebase.google.com/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// إعدادات مشروع Firebase الخاصة بك
export const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// تهيئة تطبيق Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("🔥 تم ربط Firebase بنجاح في موقعك عبر NoklenWeb Builder!");

// دالة مساعدة لحفظ البيانات في Firestore
export async function saveContactMessage(data) {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...data,
      createdAt: serverTimestamp()
    });
    console.log("تم حفظ الرسالة بالمعرف:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("خطأ في حفظ البيانات:", error);
    return { success: false, error: error.message };
  }
}

// دالة مساعدة لتسجيل دخول المستخدم
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
`;
