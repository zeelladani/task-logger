Task Logger
A modern, feature-rich task logging application with Firebase authentication, cloud storage, and PDF export capabilities. Built as a Progressive Web App (PWA) for seamless cross-platform experience.
Show Image Show Image Show Image
📋 Table of Contents
•	Features
•	Demo
•	Screenshots
•	Installation
•	Configuration
•	Usage
•	Project Structure
•	Technologies Used
•	Firebase Setup
•	PWA Features
•	API Reference
•	Contributing
•	License
✨ Features
Authentication
•	🔐 Email/Password authentication
•	🔑 Google OAuth integration
•	🔄 Password reset functionality
•	👤 User profile management
•	🔒 Secure session handling
Task Management
•	✅ Create, read, and delete tasks
•	📸 Attach images to tasks (up to 20MB)
•	📝 Rich text descriptions
•	⏰ Automatic timestamp in IST
•	🔄 Real-time synchronization
Data Export
•	📄 Generate PDF reports with custom titles
•	📊 Export tasks as JSON
•	📥 Import tasks from JSON
•	🖼️ Include images in PDF exports
•	📅 Automatic date-stamped filenames
User Experience
•	🌓 Dark/Light theme toggle
•	📱 Fully responsive design
•	⚡ Progressive Web App (PWA)
•	💾 Offline support
•	🎨 Modern glassmorphism UI
•	✨ Smooth animations
Security
•	🔐 Email-based security codes for sensitive actions
•	🗑️ Secure account deletion
•	🔒 Firestore security rules
•	🛡️ Protected routes
🚀 Demo
Visit the live demo: https://task.zeelladani.space/
📸 Screenshots
Login Page
Modern authentication interface with tab-based navigation
Dashboard
Clean task management interface with real-time updates
Task Creation
Easy-to-use form with image upload support
PDF Export
Professional PDF reports with custom branding
🔧 Installation
Prerequisites
•	Node.js (v14 or higher)
•	npm or yarn
•	Firebase account
•	Web server (for local development)
Local Development
1.	Clone the repository
bash
git clone https://github.com/yourusername/task-logger.git
cd task-logger
2.	Configure Firebase 
o	Create a new Firebase project at Firebase Console
o	Enable Authentication (Email/Password and Google)
o	Create a Firestore database
o	Copy your Firebase configuration
3.	Update Firebase Configuration
Edit js/firebase-config.js:
javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
4.	Set up Firestore Security Rules
Apply the rules from firebase-rules.txt in your Firebase Console:
javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
5.	Start a local server
Using Python:
bash
python -m http.server 5501
Using Node.js:
bash
npx http-server -p 5501
```

Using VS Code Live Server:
- Install Live Server extension
- Right-click on `index.html`
- Select "Open with Live Server"

6. **Access the application**
```
http://localhost:5501
⚙️ Configuration
Theme Configuration
The application supports light and dark themes. Theme preference is saved in localStorage.
CSS Variables (styles/main.css and styles/auth.css):
css
:root {
    --primary: #4361ee;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #e63946;
    --warning: #fca311;
}

[data-theme="dark"] {
    --bg-color: #0f1419;
    --card-bg: #1e293b;
    --text-color: #f1f5f9;
}
PWA Configuration
Edit manifest.json to customize your PWA:
json
{
    "name": "Task Logger",
    "short_name": "TaskLogger",
    "description": "A modern task logging application",
    "theme_color": "#4361ee",
    "background_color": "#4361ee"
}
Service Worker Cache
Update sw.js to modify cached resources:
javascript
const CACHE_NAME = 'task-logger-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/dashboard.html',
    // Add more resources
];
```

## 📖 Usage

### Creating an Account

1. Navigate to the application
2. Click on "Sign up" tab
3. Enter your email and password
4. Or use "Continue with Google"
5. Complete profile setup with first name and last name

### Logging Tasks

1. Log in to your account
2. Enter task description in the text area
3. Optionally add an image (up to 20MB)
4. Click "Log Task"
5. Task appears in the list with timestamp

### Exporting Data

**Generate PDF:**
1. Click "Generate PDF"
2. Enter custom PDF title
3. Confirm the action
4. PDF downloads with all tasks and images
5. Tasks are automatically cleared after PDF generation

**Export JSON:**
1. Click "Export JSON"
2. JSON file downloads with all task data

**Import JSON:**
1. Click "Import JSON"
2. Select a previously exported JSON file
3. Tasks are imported into your account

### Managing Profile

1. Click "Edit Profile" in the header
2. Update first name, last name, and username
3. Username appears in PDFs as author name
4. Save changes

### Deleting Account

1. Click "Delete Account" button
2. Enter your email address as security code
3. Confirm deletion
4. All data and account are permanently removed

## 📁 Project Structure
```
task-logger/
│
├── index.html                 # Authentication page
├── dashboard.html             # Main application dashboard
├── manifest.json             # PWA manifest
├── sw.js                     # Service worker
│
├── js/
│   ├── auth.js              # Authentication logic
│   ├── dashboard.js         # Dashboard functionality
│   ├── firebase-config.js   # Firebase configuration
│   ├── manifestation.js     # PWA installation handler
│   └── utils.js             # Utility functions
│
├── styles/
│   ├── auth.css             # Authentication page styles
│   └── main.css             # Dashboard styles
│
├── icons/                    # PWA icons (72px to 512px)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
│
└── firebase-rules.txt        # Firestore security rules
🛠️ Technologies Used
Frontend
•	HTML5 - Semantic markup
•	CSS3 - Modern styling with CSS Grid and Flexbox
•	Vanilla JavaScript - No framework dependencies
•	Glassmorphism UI - Modern design aesthetic
Backend & Services
•	Firebase Authentication - User management
•	Cloud Firestore - NoSQL database
•	Firebase Hosting - (Optional) Cloud hosting
Libraries
•	jsPDF (2.5.1) - PDF generation
•	Firebase SDK (9.22.2) - Firebase integration
PWA Features
•	Service Worker - Offline functionality
•	Web App Manifest - Install capability
•	Cache API - Resource caching
🔥 Firebase Setup
1. Create Firebase Project
1.	Go to Firebase Console
2.	Click "Add project"
3.	Enter project name
4.	Enable Google Analytics (optional)
5.	Create project
2. Enable Authentication
1.	Navigate to Authentication
2.	Click "Get started"
3.	Enable Email/Password provider
4.	Enable Google provider
5.	Add authorized domains
3. Create Firestore Database
1.	Navigate to Firestore Database
2.	Click "Create database"
3.	Choose production mode
4.	Select location
5.	Apply security rules from firebase-rules.txt
4. Configure Web App
1.	Project Settings → General
2.	Scroll to "Your apps"
3.	Click web icon (</>)
4.	Register app
5.	Copy configuration object
6.	Update js/firebase-config.js
5. Create Indexes (Optional)
For better query performance:
tasks collection:
•	Composite index: userId (Ascending) + createdAt (Descending)
📱 PWA Features
Installation
Desktop:
1.	Visit the application
2.	Look for install prompt in address bar
3.	Click "Install"
Mobile:
1.	Open in Chrome/Safari
2.	Tap "Add to Home Screen"
3.	Confirm installation
Offline Support
The application caches essential resources:
•	HTML pages
•	CSS stylesheets
•	JavaScript files
•	Firebase SDK
•	Static assets
Limitations:
•	Cannot create new tasks offline
•	Firebase operations require connection
•	Real-time sync disabled offline
Update Mechanism
1.	Service worker checks for updates
2.	New version cached in background
3.	User notified on next visit
4.	Refresh to apply updates
📚 API Reference
Authentication API
javascript
// Sign up with email/password
await auth.createUserWithEmailAndPassword(email, password);

// Sign in with email/password
await auth.signInWithEmailAndPassword(email, password);

// Sign in with Google
const provider = new firebase.auth.GoogleAuthProvider();
await auth.signInWithPopup(provider);

// Sign out
await auth.signOut();

// Password reset
await auth.sendPasswordResetEmail(email);

// Delete account
await auth.currentUser.delete();
Firestore API
javascript
// Create task
await db.collection('tasks').doc().set({
    description: string,
    image: base64String | null,
    timestamp: string,
    userId: string,
    email: string,
    authorName: string,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

// Read tasks
db.collection('tasks')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(callback);

// Delete task
await db.collection('tasks').doc(taskId).delete();

// Update user profile
await db.collection('users').doc(userId).set({
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
}, { merge: true });
Utility Functions
javascript
// Convert image to base64
const base64 = await convertToBase64(file);

// Compress image
const compressed = await compressImage(base64String, maxWidth, maxHeight);

// Format date to IST
const formatted = formatToIST(new Date());

// Show message
showMessage(element, message, 'success' | 'error', duration);

// Validate email
const isValid = isValidEmail(email);
🤝 Contributing
Contributions are welcome! Please follow these steps:
1.	Fork the repository
bash
git fork https://github.com/yourusername/task-logger.git
2.	Create a feature branch
bash
git checkout -b feature/amazing-feature
3.	Commit your changes
bash
git commit -m 'Add some amazing feature'
4.	Push to the branch
bash
git push origin feature/amazing-feature
```

5. **Open a Pull Request**

### Code Style Guidelines

- Use consistent indentation (2 spaces)
- Follow ES6+ JavaScript standards
- Comment complex logic
- Use meaningful variable names
- Test on multiple browsers/devices

### Reporting Bugs

Open an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

## 📄 License

This project is licensed under the MIT License - see below for details:
```
MIT License

Copyright (c) 2024 Task Logger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
👥 Authors
•	Your Name - Initial work - YourGitHub
🙏 Acknowledgments
•	Firebase team for excellent documentation
•	jsPDF library contributors
•	Open source community
•	Beta testers and early users
📞 Support
For support and questions:
•	📧 Email: support@tasklogger.com
•	🐛 Issues: GitHub Issues
•	💬 Discussions: GitHub Discussions
🗺️ Roadmap
•	Task categories and tags
•	Task search and filtering
•	Task editing capability
•	Collaborative task lists
•	Email notifications
•	Calendar integration
•	Mobile native apps
•	Task templates
•	Analytics dashboard
•	Bulk operations
📊 Browser Support
Browser	Version
Chrome	Last 2 versions
Firefox	Last 2 versions
Safari	Last 2 versions
Edge	Last 2 versions
Opera	Last 2 versions
🔐 Security
Reporting Security Issues
Please report security vulnerabilities to security@tasklogger.com
Security Best Practices
•	Passwords hashed by Firebase Authentication
•	HTTPS enforced on all connections
•	Firestore security rules prevent unauthorized access
•	XSS protection through input sanitization
•	CSRF tokens for sensitive operations
________________________________________
Built with ❤️ by the Task Logger Team
⭐ Star this repository if you find it helpful!

