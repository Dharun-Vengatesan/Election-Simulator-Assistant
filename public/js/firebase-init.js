// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJbHGm9wb-gJrXLbOjiNimRGQYbn9SoTs",
  authDomain: "election-simulator-assistant.firebaseapp.com",
  projectId: "election-simulator-assistant",
  storageBucket: "election-simulator-assistant.firebasestorage.app",
  messagingSenderId: "419973239000",
  appId: "1:419973239000:web:14443a30a9c03612db07ad",
  measurementId: "G-JDJSGKNN15"
};

let app, analytics, db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully.");
} catch (error) {
  console.error("Firebase initialization error (Check config):", error);
}

/**
 * Saves a completed game score to Firestore and logs it to Analytics.
 * @param {string} roleName 
 * @param {number} finalScore 
 * @param {string} endingStatus 
 */
export async function saveGameScore(roleName, finalScore, endingStatus) {
  if (!db) {
    console.warn("Firestore not initialized. Cannot save score.");
    return;
  }

  try {
    // Log to Google Analytics
    if (analytics) {
      logEvent(analytics, 'game_completed', {
        role: roleName,
        score: finalScore,
        status: endingStatus
      });
    }

    // Save to Firestore Database
    const docRef = await addDoc(collection(db, "global_scores"), {
      role: roleName,
      score: finalScore,
      ending: endingStatus,
      timestamp: serverTimestamp()
    });
    
    console.log("Score saved globally with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Attach to window so non-module scripts (like app.js) can access it
window.FirebaseHelper = {
  saveGameScore
};
