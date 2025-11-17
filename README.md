[click](https://task.zeelladani.space/) Here to View live demo


Task Logger 📝
A modern, responsive task logging web application with PDF export capabilities, built with Firebase and PWA features.

🌟 Features
🔐 Secure Authentication - Email/Password and Google Sign-in
📝 Task Management - Log tasks with descriptions and images
🖼️ Image Support - Attach images to tasks (up to 20MB)
📊 PDF Export - Generate professional PDF reports with custom titles
🌙 Dark/Light Theme - Toggle between themes
📱 PWA Support - Install as a mobile app
💾 Offline Support - Works offline with service workers
🔒 Data Security - Users can only access their own data
📤 JSON Import/Export - Backup and restore your tasks
🚀 Live Demo
View Live Application



🛠️ Technology Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)
Backend: Firebase (Authentication, Firestore)
Storage: Firebase Storage for images
PDF Generation: jsPDF
PWA: Service Workers, Web App Manifest

Icons: Emoji-based icons

📦 Installation
Prerequisites
A Firebase project (see setup instructions below)
Modern web browser with JavaScript enabled
GitHub account for deployment


Firebase Setup
Create Firebase Project
Go to Firebase Console
Create a new project named "task-logger"
Enable Google Analytics (optional)
Enable Authentication
Go to Authentication → Sign-in method
Enable Email/Password and Google providers
Setup Firestore Database
Go to Firestore Database → Create database
Start in test mode for development
Set up security rules (provided below)
Get Configuration
Go to Project Settings → General
Add a web app and copy the configuration
Replace the config in js/firebase-config.js


Local Development
Clone the repository


**bash
git clone https://github.com/zeelladani/task-logger.git
cd task-logger
Configure Firebase**

Update js/firebase-config.js with your Firebase project details
Run locally
Open index.html in a web browser
Or use a local server:


bash
# Using Python
python -m http.server 8000


# Using Node.js
npx http-server



**🔧 Firebase Configuration
Security Rules
Add these rules to your Firestore database:
**

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



Authorized Domains
In Firebase Authentication → Settings → Authorized domains, add:
localhost (development)
zeelladani.github.io (GitHub Pages)



📱 PWA Features
Installable: Add to home screen on mobile devices

Offline Support: Works without internet connection

Fast Loading: Cached resources for quick access

App-like Experience: Fullscreen mode on mobile


🎯 Usage
Getting Started
Sign Up/Login
Create an account with email/password or use Google Sign-in
Complete your profile with name and username
Log Tasks
Enter task description in the dashboard
Optionally attach an image (JPEG, PNG, GIF)
Click "Log Task" to save
Manage Tasks
View all logged tasks in chronological order
Delete individual tasks as needed
Clear all tasks with security confirmation
Export Data
PDF Export: Generate professional reports with custom titles
JSON Export: Backup your tasks for safekeeping
JSON Import: Restore tasks from backup files
PDF Features
Custom document titles


Professional header with date, author, and time

Task numbering and timestamps

Image compression and proper sizing

Multi-page support with continuous numbering

Automatic filename: Title - DD || MM || YYYY.pdf

📁 Project Structure
text
task-logger/
├── index.html              # Login/Signup page
├── dashboard.html          # Main application
├── styles/
│   ├── auth.css           # Authentication styles
│   └── main.css           # Dashboard styles
├── js/
│   ├── firebase-config.js # Firebase configuration
│   ├── auth.js            # Authentication logic
│   ├── dashboard.js       # Dashboard functionality
│   ├── utils.js           # Utility functions
│   └── manifestation.js   # PWA features
├── manifest.json          # PWA manifest
├── sw.js                  # Service Worker
└── icons/                 # App icons (various sizes)
🔒 Security Features
User Isolation: Users can only access their own data

Input Validation: Client and server-side validation

Secure Authentication: Firebase Auth with email verification

Image Compression: Automatic compression for large images

Security Codes: Required for destructive operations

🌐 Browser Support
Chrome 60+

Firefox 55+

Safari 12+

Edge 79+

Mobile browsers (iOS Safari, Chrome Mobile)

🚀 Deployment
GitHub Pages
Push to GitHub

bash
git add .
git commit -m "Initial commit"
git push origin main
Enable GitHub Pages

Go to repository Settings → Pages

Source: Select your branch (main/master)

Folder: / (root)

Click Save

Update Firebase Config

Add your GitHub Pages domain to Firebase authorized domains

Ensure production Firebase config is used

🐛 Troubleshooting
Common Issues
Authentication Errors

Check Firebase Auth providers are enabled

Verify authorized domains include your deployment URL

Firestore Permission Denied

Check security rules match the provided example

Ensure user is properly authenticated

PDF Generation Issues

Ensure jsPDF is properly loaded

Check browser console for errors

PWA Not Installing

Verify manifest.json is accessible

Check service worker registration

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Firebase for backend services

jsPDF for PDF generation

Unsplash for placeholder images

Modern CSS for responsive design

📞 Support
If you encounter any issues or have questions:

Check the Troubleshooting section

Create an Issue

Contact the maintainers

Made with ❤️ for productive task management

Live Demo: [task.zeelladani.space](task.zeelladani.space)

