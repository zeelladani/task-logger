
TASK LOGGER - COMPLETE DOCUMENTATION
=====================================

Version: 2.0
Date: 11/17/2025
Website: [https://task.zeelladani.space](https://task.zeelladani.space/)

TABLE OF CONTENTS
=================
1. Introduction
2. Features
3. Installation
4. Configuration
5. Usage Guide
6. Technical Architecture
7. API Reference
8. Security
9. Troubleshooting

1. INTRODUCTION
===============
Task Logger is a modern, feature-rich task logging application built with Firebase and Progressive Web App (PWA) technology. It provides seamless task management with cloud synchronization, image attachments, and professional PDF export capabilities.

Key Highlights:
- Cloud-based task storage
- Real-time synchronization
- Offline support via PWA
- Professional PDF reports
- Image attachments (up to 20MB)
- Dark/Light theme support

2. FEATURES
===========

2.1 Authentication
------------------
✓ Email/Password authentication
✓ Google OAuth integration
✓ Password reset functionality
✓ User profile management
✓ Secure session handling

2.2 Task Management
-------------------
✓ Create, read, and delete tasks
✓ Attach images to tasks (up to 20MB)
✓ Rich text descriptions
✓ Automatic timestamp in IST
✓ Real-time synchronization across devices

2.3 Data Export
---------------
✓ Generate PDF reports with custom titles
✓ Export tasks as JSON
✓ Import tasks from JSON
✓ Include images in PDF exports
✓ Automatic date-stamped filenames

2.4 User Experience
-------------------
✓ Dark/Light theme toggle
✓ Fully responsive design
✓ Progressive Web App (PWA)
✓ Offline support
✓ Modern glassmorphism UI
✓ Smooth animations

3. INSTALLATION
===============

3.1 Prerequisites
-----------------
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Web server for local development

3.2 Quick Start
---------------
1. Clone the repository:
   git clone https://github.com/zeelladani/task-logger.git
   cd task-logger

2. Configure Firebase (see Section 4)

3. Start local server:
   python -m http.server 5501
   OR
   npx http-server -p 5501

4. Access: http://localhost:5501

4. CONFIGURATION
================

4.1 Firebase Setup
------------------
1. Create Firebase project at console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Create Firestore database
4. Update js/firebase-config.js with your credentials:

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

4.2 Security Rules
------------------
Apply Firestore rules from firebase-rules.txt to ensure:
- Users can only access their own tasks
- Authenticated access only
- Secure data operations

4.3 Theme Configuration
-----------------------
Customize colors in styles/main.css:
:root {
    --primary: #4361ee;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #e63946;
}

5. USAGE GUIDE
==============

5.1 Creating an Account
-----------------------
1. Navigate to the application
2. Click "Sign up" tab
3. Enter email and password (min 6 characters)
4. Or use "Continue with Google"
5. Complete profile with first/last name

5.2 Logging Tasks
-----------------
1. Log in to your account
2. Enter task description
3. Optionally add image (max 20MB)
4. Click "Log Task"
5. Task appears with timestamp

5.3 Managing Tasks
------------------
- View all tasks in chronological order
- Delete individual tasks with × button
- Tasks sync in real-time across devices
- Images are compressed for optimal storage

5.4 Exporting Data
------------------
PDF Export:
- Click "Generate PDF"
- Enter custom PDF title
- Confirm action
- PDF downloads with all tasks and images
- Tasks cleared after generation

JSON Export/Import:
- Export: Downloads JSON with all task data
- Import: Select JSON file to restore tasks

5.5 Profile Management
----------------------
- Click "Edit Profile"
- Update name and username
- Username appears as author in PDFs
- Changes saved to cloud

6. TECHNICAL ARCHITECTURE
==========================

6.1 Frontend
------------
- HTML5 semantic markup
- CSS3 with Grid and Flexbox
- Vanilla JavaScript (ES6+)
- No framework dependencies
- Glassmorphism UI design

6.2 Backend & Services
----------------------
- Firebase Authentication
- Cloud Firestore database
- Real-time data synchronization
- Secure API endpoints

6.3 Libraries
-------------
- jsPDF 2.5.1 (PDF generation)
- Firebase SDK 9.22.2
- Service Worker API
- Cache API

6.4 Project Structure
---------------------
task-logger/
├── index.html              # Auth page
├── dashboard.html          # Main app
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker
├── js/
│   ├── auth.js           # Authentication
│   ├── dashboard.js      # App logic
│   ├── firebase-config.js
│   ├── manifestation.js  # PWA handler
│   └── utils.js
├── styles/
│   ├── auth.css
│   └── main.css
└── icons/                 # PWA icons

7. API REFERENCE
================

7.1 Authentication
------------------
// Sign up
await auth.createUserWithEmailAndPassword(email, password);

// Sign in
await auth.signInWithEmailAndPassword(email, password);

// Google sign in
const provider = new firebase.auth.GoogleAuthProvider();
await auth.signInWithPopup(provider);

// Sign out
await auth.signOut();

// Password reset
await auth.sendPasswordResetEmail(email);

7.2 Firestore Operations
-------------------------
// Create task
await db.collection('tasks').doc().set({
    description: string,
    image: base64String | null,
    timestamp: string,
    userId: string,
    createdAt: serverTimestamp()
});

// Read tasks
db.collection('tasks')
  .where('userId', '==', userId)
  .orderBy('createdAt', 'desc')
  .onSnapshot(callback);

// Delete task
await db.collection('tasks').doc(taskId).delete();

7.3 Utility Functions
---------------------
- convertToBase64(file): Convert image to base64
- compressImage(base64, maxW, maxH): Compress image
- formatToIST(date): Format date to Indian time
- showMessage(el, msg, type): Display notifications

8. SECURITY
===========

8.1 Authentication Security
----------------------------
- Passwords hashed by Firebase
- HTTPS enforced on all connections
- Secure session tokens
- OAuth 2.0 for Google sign-in

8.2 Data Security
-----------------
- Firestore security rules
- User data isolation
- No cross-user access
- Encrypted data transmission

8.3 Best Practices
------------------
- Regular security audits
- Input sanitization
- XSS protection
- CSRF token validation
- Email verification for sensitive operations

8.4 Reporting Security Issues
------------------------------
Email: security@tasklogger.com
Response time: Within 48 hours

9. TROUBLESHOOTING
==================

9.1 Common Issues
-----------------

Problem: Can't log in
Solution:
- Check email/password spelling
- Verify internet connection
- Clear browser cache
- Try password reset

Problem: Tasks not syncing
Solution:
- Check Firebase connection
- Verify internet connectivity
- Check browser console for errors
- Refresh the page

Problem: Image upload fails
Solution:
- Ensure image is under 20MB
- Check file format (JPEG, PNG, GIF)
- Verify stable internet connection
- Try compressing image first

Problem: PDF generation fails
Solution:
- Ensure you have tasks logged
- Check browser console
- Try with fewer tasks
- Update browser to latest version

9.2 Browser Compatibility
--------------------------
Supported browsers:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

9.3 PWA Installation Issues
----------------------------
- Clear browser cache
- Ensure HTTPS connection
- Check manifest.json validity
- Verify service worker registration

10.2 Contributing
-----------------
We welcome contributions!
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

APPENDIX A: KEYBOARD SHORTCUTS
===============================
Ctrl/Cmd + K: Toggle theme
Ctrl/Cmd + N: New task
Ctrl/Cmd + P: Generate PDF
Ctrl/Cmd + E: Export JSON
Ctrl/Cmd + I: Import JSON
Escape: Close modal

APPENDIX B: CHANGELOG
=====================
Version 2.0 (Current)
- Added dark theme
- Improved PDF generation
- Enhanced image compression
- Better mobile responsiveness
- PWA optimization

Version 1.0
- Initial release
- Basic task logging
- Firebase integration
- PDF export

APPENDIX C: ROADMAP
===================
Upcoming Features:
- Task categories and tags
- Task search and filtering
- Task editing capability
- Collaborative task lists
- Email notifications
- Calendar integration
- Mobile native apps
- Task templates

APPENDIX D: LICENSE
===================
MIT License

Copyright (c) 2024 Task Logger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

---END OF DOCUMENTATION---
