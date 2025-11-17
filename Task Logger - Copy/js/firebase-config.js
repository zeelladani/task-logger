// Firebase configuration
const firebaseConfig = {
    apiKey: "add here your firebase configuration",
    authDomain: "add here your firebase configuration",
    databaseURL: "add here your firebase configuration",
    projectId: "add here your firebase configuration",
    storageBucket: "add here your firebase configuration",
    messagingSenderId: "add here your firebase configuration6",
    appId: "add here your firebase configuration",
    measurementId: "add here your firebase configuration"
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
