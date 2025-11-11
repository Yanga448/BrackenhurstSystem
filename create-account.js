// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// ✅ Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ07UzzIx_dIiY0WxllufSgXCj7ltXA08",
  authDomain: "brackenhurstsystem.firebaseapp.com",
  projectId: "brackenhurstsystem",
  storageBucket: "brackenhurstsystem.appspot.com",
  messagingSenderId: "98472895167",
  appId: "1:98472895167:web:5e9d1710d6b8fb5de09c0a"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Handle form submit
const submit = document.getElementById("submit");

submit.addEventListener('click', async function (event) {
  event.preventDefault();

  // Collect form values
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const role = document.getElementById("role").value;

  // Validation
  if (!username || !email || !password || !confirmPassword || !role) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    // ✅ Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Save extra user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: username,
      email: email,
      role: role,
      status: "pending", // ⬅️ NEW: Requires admin approval
      createdAt: new Date().toISOString()
    });

    alert("Account created successfully! Waiting for admin approval.");
    window.location.href = "login.html"; // redirect after register

  } catch (error) {
    console.error("❌ Firebase Error:", error);
    alert(error.message);
  }
});
