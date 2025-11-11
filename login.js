// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCJ07UzzIx_dIiY0WxllufSgXCj7ltXA08",
  authDomain: "brackenhurstsystem.firebaseapp.com",
  projectId: "brackenhurstsystem",
  storageBucket: "brackenhurstsystem.appspot.com",
  messagingSenderId: "98472895167",
  appId: "1:98472895167:web:5e9d1710d6b8fb5de09c0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login event
document.getElementById("loginBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔍 Fetch Firestore user document
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      alert("No user record found. Please contact admin.");
      return;
    }

    const userData = userDoc.data();

    // 🚫 Prevent access if user not approved
    if (userData.status !== "approved") {
      alert(`Your account is currently '${userData.status}'. Please wait for admin approval, this should take atleast 5 business days.`);
      // Sign out immediately
      await auth.signOut();
      return;
    }

    // ✅ Redirect based on role
    if (userData.role === "Admin") window.location.href = "admin-dashboard.html";
    else if (userData.role === "Librarian") window.location.href = "librarian-dashboard.html";
    else window.location.href = "user-dashboard.html";

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
