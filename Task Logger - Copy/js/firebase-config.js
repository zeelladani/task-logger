// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXzdFr_Es8lc-NUhm2VVcYcob3eDLElEU",
    authDomain: "common-e8760.firebaseapp.com",
    databaseURL: "https://common-e8760-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "common-e8760",
    storageBucket: "common-e8760.firebasestorage.app",
    messagingSenderId: "583880384916",
    appId: "1:583880384916:web:da59f45649c4c07a44ef81",
    measurementId: "G-VB7JS7QVSH"
};

// Check if Firebase is already initialized
let app;
let auth;
let db;

try {
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    } else {
        app = firebase.app();
        console.log('Using existing Firebase app');
    }
    
    // Initialize services
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Configure Firestore settings
    db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
    
    // Enable offline persistence
    db.enablePersistence()
      .then(() => {
          console.log('Firestore persistence enabled');
      })
      .catch((err) => {
          console.log('Firestore persistence error:', err);
      });
      
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, auth, db };
}