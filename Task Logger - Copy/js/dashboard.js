// DOM Elements
const userDisplayName = document.getElementById('user-display-name');
const userEmail = document.getElementById('user-email');
const currentTime = document.getElementById('current-time');
const logoutBtn = document.getElementById('logout-btn');
const deleteAccountBtn = document.getElementById('delete-account');
const editProfileBtn = document.getElementById('edit-profile');
const themeToggleBtn = document.getElementById('theme-toggle');
const taskForm = document.getElementById('task-form');
const taskDescription = document.getElementById('task-description');
const taskImage = document.getElementById('task-image');
const imagePreview = document.getElementById('image-preview');
const tasksContainer = document.getElementById('tasks-container');
const generatePdfBtn = document.getElementById('generate-pdf');
const exportJsonBtn = document.getElementById('export-json');
const importJsonBtn = document.getElementById('import-json');
const clearTasksBtn = document.getElementById('clear-tasks');
const taskMessage = document.getElementById('task-message');

// Profile Modal Elements
const editProfileModal = document.getElementById('edit-profile-modal');
const editProfileForm = document.getElementById('edit-profile-form');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const cancelEditProfileBtn = document.getElementById('cancel-edit-profile');
const editProfileMessage = document.getElementById('edit-profile-message');

// Media Picker Elements
const chooseFileBtn = document.getElementById('choose-file');
const removeMediaBtn = document.getElementById('remove-media');
const selectedMediaPreview = document.getElementById('selected-media-preview');

// Modal Elements
const pdfTitleModal = document.getElementById('pdf-title-modal');
const pdfTitleInput = document.getElementById('pdf-title-input');
const confirmPdfTitleBtn = document.getElementById('confirm-pdf-title');
const cancelPdfTitleBtn = document.getElementById('cancel-pdf-title');
const pdfConfirmModal = document.getElementById('pdf-confirm-modal');
const clearTasksModal = document.getElementById('clear-tasks-modal');
const deleteAccountModal = document.getElementById('delete-account-modal');
const confirmPdfBtn = document.getElementById('confirm-pdf');
const cancelPdfBtn = document.getElementById('cancel-pdf');
const confirmClearBtn = document.getElementById('confirm-clear');
const cancelClearBtn = document.getElementById('cancel-clear');
const confirmDeleteAccountBtn = document.getElementById('confirm-delete-account');
const cancelDeleteAccountBtn = document.getElementById('cancel-delete-account');
const securityCodeInput = document.getElementById('security-code');
const deleteSecurityCodeInput = document.getElementById('delete-security-code');
const clearError = document.getElementById('clear-error');
const deleteAccountError = document.getElementById('delete-account-error');

// Global variables
let tasks = [];
let unsubscribeTasks = null;
let currentUserEmail = '';
let currentUserProfile = null;
let pdfTitle = 'Daily Tasks log Report';

// Convert image to base64 function
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('Invalid file type. Please select an image.'));
            return;
        }

        // Updated to 20MB limit
        if (file.size > 20 * 1024 * 1024) {
            reject(new Error('Image size must be less than 20MB.'));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (event) => {
            const result = event.target.result;
            if (result && typeof result === 'string') {
                console.log('✅ Image converted to base64, length:', result.length);
                resolve(result);
            } else {
                reject(new Error('Failed to process image.'));
            }
        };
        
        reader.onerror = (error) => {
            console.error('❌ FileReader error:', error);
            reject(new Error('Error reading image file. Please try again.'));
        };
        
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            reject(new Error('Error processing image file.'));
        }
    });
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    document.body.style.opacity = '0.8';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 300);
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Debug Firebase connection
function debugFirebaseConnection() {
    console.log('=== FIREBASE DEBUG INFO ===');
    console.log('Current User:', auth.currentUser);
    console.log('User UID:', auth.currentUser?.uid);
    console.log('User Email:', auth.currentUser?.email);
    console.log('Firestore:', db);
    console.log('Firebase App:', firebase.app().name);
    console.log('==========================');
}

// Update current time in IST
function updateCurrentTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    currentTime.textContent = now.toLocaleString('en-IN', options);
}

// Modal functions
function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function resetModals() {
    hideModal(editProfileModal);
    hideModal(pdfTitleModal);
    hideModal(pdfConfirmModal);
    hideModal(clearTasksModal);
    hideModal(deleteAccountModal);
    clearError.textContent = '';
    deleteAccountError.textContent = '';
    securityCodeInput.value = '';
    deleteSecurityCodeInput.value = '';
}

// User Profile Management
async function loadUserProfile() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            currentUserProfile = userDoc.data();
            updateUserDisplay();
        } else {
            // Create user profile with email as default name
            const userData = {
                firstName: '',
                lastName: '',
                userName: user.email.split('@')[0], // Default username from email
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('users').doc(user.uid).set(userData);
            currentUserProfile = userData;
            updateUserDisplay();
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

async function saveUserProfile(firstName, lastName, userName) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        // Validate input
        if (!firstName.trim() || !lastName.trim() || !userName.trim()) {
            throw new Error('First name, last name, and username are required');
        }

        const userData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            userName: userName.trim(),
            email: user.email,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('users').doc(user.uid).set(userData, { merge: true });
        currentUserProfile = userData;
        updateUserDisplay();
        
        return true;
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw new Error('Failed to save profile: ' + error.message);
    }
}

function updateUserDisplay() {
    if (currentUserProfile) {
        // Use username if available, otherwise use first + last name
        const displayName = currentUserProfile.userName || 
                           `${currentUserProfile.firstName} ${currentUserProfile.lastName}`.trim() || 
                           'User';
        userDisplayName.textContent = displayName;
        userEmail.textContent = currentUserProfile.email;
    } else {
        userDisplayName.textContent = 'User';
        userEmail.textContent = currentUserEmail;
    }
}

function showEditProfileModal() {
    if (currentUserProfile) {
        firstNameInput.value = currentUserProfile.firstName || '';
        lastNameInput.value = currentUserProfile.lastName || '';
    } else {
        firstNameInput.value = '';
        lastNameInput.value = '';
    }
    editProfileMessage.textContent = '';
    showModal(editProfileModal);
}

// Enhanced save task to Firestore with detailed logging
async function saveTask(description, imageBase64 = null) {
    try {
        console.log('=== STARTING TASK SAVE ===');
        
        // Validate user authentication
        if (!auth.currentUser) {
            console.error('❌ User not authenticated');
            throw new Error('User not authenticated. Please log in again.');
        }
        
        console.log('✅ User authenticated:', auth.currentUser.email);
        console.log('✅ User UID:', auth.currentUser.uid);
        
        const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        const taskRef = db.collection('tasks').doc();
        
        console.log('✅ Task reference created:', taskRef.id);
        
        // Get author name for task
        const authorName = currentUserProfile ? 
            (currentUserProfile.userName || `${currentUserProfile.firstName} ${currentUserProfile.lastName}`.trim() || 'User') : 
            'User';
        
        // Prepare task data
        const taskData = {
            description: description,
            timestamp: timestamp,
            userId: auth.currentUser.uid,
            email: auth.currentUser.email,
            authorName: authorName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Handle image data
        if (imageBase64 && imageBase64.length > 0) {
            console.log('📷 Image provided, length:', imageBase64.length);
            
            // Check if image is too large for Firestore (1MB limit)
            if (imageBase64.length > 1000000) {
                console.warn('⚠️ Image too large for Firestore, compressing...');
                // Try to compress the image further
                try {
                    const compressedImage = await compressImage(imageBase64, 400, 300);
                    if (compressedImage.length < 1000000) {
                        taskData.image = compressedImage;
                        console.log('✅ Image compressed successfully, new length:', compressedImage.length);
                    } else {
                        console.warn('⚠️ Image still too large after compression, storing without image');
                        taskData.image = null;
                    }
                } catch (compressError) {
                    console.warn('⚠️ Compression failed, storing without image:', compressError);
                    taskData.image = null;
                }
            } else {
                // Image is within size limit, store it
                taskData.image = imageBase64;
                console.log('✅ Image stored successfully');
            }
        } else {
            console.log('📷 No image provided');
            taskData.image = null;
        }
        
        console.log('📦 Final task data to save:', {
            description: taskData.description.substring(0, 50) + (taskData.description.length > 50 ? '...' : ''),
            timestamp: taskData.timestamp,
            hasImage: !!taskData.image,
            imageSize: taskData.image ? taskData.image.length : 0,
            userId: taskData.userId,
            email: taskData.email,
            authorName: taskData.authorName
        });
        
        console.log('🚀 Attempting to save to Firestore...');
        await taskRef.set(taskData);
        
        console.log('✅ Task saved successfully with ID:', taskRef.id);
        console.log('=== TASK SAVE COMPLETE ===');
        
        return true;
        
    } catch (error) {
        console.error('❌ Error saving task:', error);
        console.error('🔍 Error details:', {
            code: error.code,
            message: error.message,
            name: error.name
        });
        
        // Provide user-friendly error messages
        let userMessage = 'Failed to save task. Please try again.';
        
        switch (error.code) {
            case 'permission-denied':
                userMessage = 'Permission denied. Please check if you are logged in.';
                break;
            case 'unauthenticated':
                userMessage = 'Please log in again to save tasks.';
                break;
            case 'invalid-argument':
                userMessage = 'Invalid data. Please check your task content.';
                break;
            case 'resource-exhausted':
                userMessage = 'Storage limit exceeded. Please try a smaller image or contact support.';
                break;
            case 'failed-precondition':
                userMessage = 'Database error. Please refresh the page and try again.';
                break;
        }
        
        throw new Error(userMessage);
    }
}

// Load tasks from Firestore
function loadTasks() {
    if (unsubscribeTasks) {
        unsubscribeTasks();
    }
    
    console.log('Loading tasks for user:', auth.currentUser.uid);
    
    unsubscribeTasks = db.collection('tasks')
        .where('userId', '==', auth.currentUser.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            console.log('Tasks snapshot received:', snapshot.size, 'tasks');
            tasks = [];
            tasksContainer.innerHTML = '';
            
            if (snapshot.empty) {
                console.log('No tasks found');
                tasksContainer.innerHTML = '<div class="no-tasks">No tasks logged yet. Start by adding a task above.</div>';
                updateTaskCounter();
                return;
            }
            
            snapshot.forEach(doc => {
                const task = { id: doc.id, ...doc.data() };
                tasks.push(task);
                renderTask(task);
            });
            
            updateTaskCounter();
            console.log('Tasks loaded successfully:', tasks.length);
            
        }, error => {
            console.error("Error loading tasks: ", error);
            
            // Try without ordering if ordering fails
            if (error.code === 'failed-precondition') {
                console.log('Trying without ordering...');
                loadTasksWithoutOrdering();
            } else {
                tasksContainer.innerHTML = '<div class="no-tasks error">Error loading tasks. Please refresh the page.</div>';
            }
        });
}

// Load tasks without ordering (fallback)
function loadTasksWithoutOrdering() {
    if (unsubscribeTasks) {
        unsubscribeTasks();
    }
    
    unsubscribeTasks = db.collection('tasks')
        .where('userId', '==', auth.currentUser.uid)
        .onSnapshot(snapshot => {
            tasks = [];
            tasksContainer.innerHTML = '';
            
            if (snapshot.empty) {
                tasksContainer.innerHTML = '<div class="no-tasks">No tasks logged yet. Start by adding a task above.</div>';
                updateTaskCounter();
                return;
            }
            
            const tasksArray = [];
            snapshot.forEach(doc => {
                const task = { id: doc.id, ...doc.data() };
                tasksArray.push(task);
            });
            
            // Sort manually by timestamp
            tasksArray.sort((a, b) => {
                const timeA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
                const timeB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
                return timeB - timeA;
            });
            
            tasks = tasksArray;
            
            tasks.forEach(task => {
                renderTask(task);
            });
            
            updateTaskCounter();
            console.log('Tasks loaded successfully (without ordering):', tasks.length);
            
        }, error => {
            console.error("Error in fallback task loading: ", error);
            tasksContainer.innerHTML = '<div class="no-tasks error">Error loading tasks. Please refresh the page.</div>';
        });
}

// Update task counter
function updateTaskCounter() {
    const taskCounter = document.querySelector('.task-counter');
    if (taskCounter) {
        taskCounter.textContent = tasks.length;
    } else {
        // Create task counter if it doesn't exist
        const header = document.querySelector('.tasks-list h2');
        if (header) {
            const counter = document.createElement('span');
            counter.className = 'task-counter';
            counter.textContent = tasks.length;
            header.appendChild(counter);
        }
    }
}

// Render a single task with proper image display
function renderTask(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item animate-slide-up';
    taskElement.id = `task-${task.id}`;
    
    let imageHtml = '';
    if (task.image && task.image.length > 100) { // Basic validation for image data
        console.log('🖼️ Rendering image for task:', task.id);
        imageHtml = `
            <div class="task-image-container">
                <div class="task-image-label">📷 Attached Image:</div>
                <img src="${task.image}" class="task-image" alt="Task Image" 
                     onerror="console.error('❌ Image failed to load for task: ${task.id}'); this.style.display='none'"
                     onload="console.log('✅ Image loaded successfully for task: ${task.id}')">
            </div>
        `;
    } else if (task.image) {
        console.warn('⚠️ Task has image property but data seems invalid:', task.id, 'Image length:', task.image?.length);
    }
    
    taskElement.innerHTML = `
        <button class="delete-task" data-task-id="${task.id}" title="Delete Task">×</button>
        <div class="task-timestamp">${task.timestamp}</div>
        <div class="task-description">${task.description}</div>
        ${imageHtml}
    `;
    
    tasksContainer.appendChild(taskElement);
    
    // Add event listener to delete button
    const deleteBtn = taskElement.querySelector('.delete-task');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    // Log rendering completion
    console.log('✅ Task rendered:', task.id, 'Has image:', !!task.image);
}

// Delete single task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const taskElement = document.getElementById(`task-${taskId}`);
        if (taskElement) {
            // Add deletion animation
            taskElement.style.transform = 'scale(0.8)';
            taskElement.style.opacity = '0';
            
            setTimeout(async () => {
                await db.collection('tasks').doc(taskId).delete();
                console.log('Task deleted successfully');
            }, 300);
        }
    } catch (error) {
        console.error("Error deleting task: ", error);
        alert('Error deleting task. Please try again.');
    }
}

// Show PDF title modal
function showPdfTitleModal() {
    if (tasks.length === 0) {
        alert('No tasks to generate PDF');
        return;
    }
    
    // Set default PDF title
    pdfTitleInput.value = pdfTitle;
    showModal(pdfTitleModal);
}

// Generate PDF with exact header format matching your image
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    const footerHeight = 15;
    
    let yPosition = 20;
    let currentPage = 1;
    
    // Get author name for PDF header
    const authorName = currentUserProfile ? 
        (currentUserProfile.userName || `${currentUserProfile.firstName} ${currentUserProfile.lastName}`.trim() || 'User') : 
        'User';
    
    // Function to add footer to current page
    const addFooter = (pageNum) => {
        const footerText = `TASK LOGGER || ${authorName} || https://ztasks.netlify.app/ || ${new Date().toLocaleString("en-IN", { 
            timeZone: "Asia/Kolkata",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })} || Page ${pageNum}`;
        
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(footerText, margin, pageHeight - 10);
        
        // Reset text color for content
        doc.setTextColor(0, 0, 0);
    };

    // Function to check if there's enough space for a task
    const checkSpaceForTask = (task, currentY) => {
        let spaceNeeded = 30; // Minimum space for task header and description
        
        // Calculate space needed for description
        doc.setFontSize(12);
        const descriptionLines = doc.splitTextToSize(task.description, pageWidth - (2 * margin));
        spaceNeeded += (descriptionLines.length * lineHeight);
        
        // Calculate space needed for image if exists
        if (task.image) {
            try {
                const img = new Image();
                img.src = task.image;
                
                const maxWidth = pageWidth - (2 * margin);
                const maxHeight = 100;
                let imgWidth = img.width;
                let imgHeight = img.height;
                
                if (imgWidth > maxWidth) {
                    const ratio = maxWidth / imgWidth;
                    imgWidth = maxWidth;
                    imgHeight = imgHeight * ratio;
                }
                
                if (imgHeight > maxHeight) {
                    const ratio = maxHeight / imgHeight;
                    imgHeight = maxHeight;
                    imgWidth = imgWidth * ratio;
                }
                
                spaceNeeded += imgHeight + 15; // Image height + label space
            } catch (error) {
                console.error("Error calculating image space: ", error);
            }
        }
        
        return (currentY + spaceNeeded) <= (pageHeight - margin - footerHeight);
    };

    // ===== PAGE 1 HEADER =====
    
    // First line: Document Title (left) and Author (right)
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    
    // Document Title on left
    doc.text(pdfTitle, margin, yPosition);
    
    // Author on right
    const authorText = `Author: ${authorName}`;
    const authorWidth = doc.getTextWidth(authorText);
    doc.text(authorText, pageWidth - margin - authorWidth, yPosition);
    
    yPosition += 10;
    
    // Second line: Date (left) and Time (right)
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    // Date on left
    const currentDate = new Date().toLocaleString("en-IN", { 
        timeZone: "Asia/Kolkata",
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Date: ${currentDate}`, margin, yPosition);
    
    // Time on right
    const currentTime = new Date().toLocaleString("en-IN", { 
        timeZone: "Asia/Kolkata",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const timeText = `Time: ${currentTime}`;
    const timeWidth = doc.getTextWidth(timeText);
    doc.text(timeText, pageWidth - margin - timeWidth, yPosition);
    
    yPosition += 20;
    
    // ===== TASKS CONTENT =====
    doc.setFontSize(12);
    
    tasks.forEach((task, index) => {
        // Check if we need a new page for this task
        if (!checkSpaceForTask(task, yPosition)) {
            // Add footer to current page before adding new page
            addFooter(currentPage);
            
            doc.addPage();
            currentPage++;
            yPosition = margin;
            
            // Add simple header for subsequent pages
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`Page ${currentPage} - ${pdfTitle}`, margin, yPosition);
            yPosition += 15;
        }
        
        // Task header with number and timestamp
        doc.setFont(undefined, 'bold');
        doc.text(`Task ${index + 1}: ${task.timestamp}`, margin, yPosition);
        yPosition += lineHeight + 2;
        
        // Task description
        doc.setFont(undefined, 'normal');
        const descriptionLines = doc.splitTextToSize(task.description, pageWidth - (2 * margin));
        doc.text(descriptionLines, margin, yPosition);
        yPosition += (descriptionLines.length * lineHeight) + 8;
        
        // Add image if exists
        if (task.image) {
            try {
                const img = new Image();
                img.src = task.image;
                
                // Calculate image dimensions to fit available space
                const maxWidth = pageWidth - (2 * margin);
                const availableHeight = pageHeight - yPosition - margin - footerHeight - 10;
                const maxHeight = Math.min(availableHeight, 150); // Limit max height but respect available space
                
                let imgWidth = img.width;
                let imgHeight = img.height;
                
                // Scale image if too large
                if (imgWidth > maxWidth) {
                    const ratio = maxWidth / imgWidth;
                    imgWidth = maxWidth;
                    imgHeight = imgHeight * ratio;
                }
                
                if (imgHeight > maxHeight) {
                    const ratio = maxHeight / imgHeight;
                    imgHeight = maxHeight;
                    imgWidth = imgWidth * ratio;
                }
                
                // Add image to PDF
                doc.addImage(task.image, 'JPEG', margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 12;
                
            } catch (error) {
                console.error("Error adding image to PDF: ", error);
            }
        }
        
        // Add space between tasks
        yPosition += 10;
    });
    
    // Add footer to the last page
    addFooter(currentPage);
    
    // Generate filename with date in DD || MM || YYYY format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();
    const dateSuffix = `${day}_${month}_${year}`;
    
    // Create filename: PDF Title - DD || MM || YYYY
    const fileName = `${pdfTitle.replace(/[^a-zA-Z0-9\s]/g, '_')} - ${dateSuffix}.pdf`;
    
    // Save the PDF with custom filename
    doc.save(fileName);
    
    // Clear tasks after PDF generation
    clearAllTasks();
    
    // Close modals
    hideModal(pdfTitleModal);
    hideModal(pdfConfirmModal);
}
// Export tasks as JSON
function exportTasksAsJSON() {
    if (tasks.length === 0) {
        alert('No tasks to export');
        return;
    }
    
    // Create tasks data
    const tasksData = tasks.map(task => ({
        description: task.description,
        timestamp: task.timestamp,
        image: task.image || null
    }));
    
    const dataStr = JSON.stringify(tasksData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Import tasks from JSON
function importTasksFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const tasksData = JSON.parse(text);
            
            if (!Array.isArray(tasksData)) {
                throw new Error('Invalid JSON format');
            }
            
            let importedCount = 0;
            let errors = 0;
            
            // Import tasks one by one
            for (const taskData of tasksData) {
                try {
                    if (taskData.description && taskData.timestamp) {
                        const success = await saveTask(taskData.description, taskData.image || null);
                        if (success) {
                            importedCount++;
                        } else {
                            errors++;
                        }
                    }
                } catch (error) {
                    console.error('Error importing task:', error);
                    errors++;
                }
            }
            
            if (errors > 0) {
                alert(`Successfully imported ${importedCount} tasks. ${errors} tasks failed to import.`);
            } else {
                alert(`Successfully imported ${importedCount} tasks`);
            }
            
        } catch (error) {
            console.error('Error importing tasks:', error);
            alert('Error importing tasks. Please check the file format.');
        }
    };
    
    input.click();
}

// Clear all tasks
function showClearTasksModal() {
    if (tasks.length === 0) {
        alert('No tasks to clear');
        return;
    }
    
    clearError.textContent = '';
    securityCodeInput.value = '';
    showModal(clearTasksModal);
}

async function clearAllTasks() {
    try {
        // Use batch operation for better performance
        const batch = db.batch();
        
        tasks.forEach(task => {
            const taskRef = db.collection('tasks').doc(task.id);
            batch.delete(taskRef);
        });
        
        await batch.commit();
        
        // Clear local state
        tasks = [];
        tasksContainer.innerHTML = '<div class="no-tasks">No tasks logged yet. Start by adding a task above.</div>';
        updateTaskCounter();
        
        console.log('All tasks cleared successfully');
        
    } catch (error) {
        console.error("Error clearing tasks: ", error);
        alert('Error clearing tasks. Please try again.');
    }
}

// Delete user account
function showDeleteAccountModal() {
    showModal(deleteAccountModal);
}

async function deleteUserAccount() {
    const user = auth.currentUser;
    const enteredCode = deleteSecurityCodeInput.value.trim();
    
    if (enteredCode !== currentUserEmail) {
        deleteAccountError.textContent = 'Invalid security code. Please enter your login email.';
        return;
    }
    
    try {
        // First, delete all user tasks
        if (tasks.length > 0) {
            await clearAllTasks();
        }
        
        // Delete user profile
        await db.collection('users').doc(user.uid).delete();
        
        // Then delete the user account
        await user.delete();
        
        alert('Account deleted successfully. You will be redirected to the login page.');
        
        // Redirect to login page
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error("Error deleting account: ", error);
        
        if (error.code === 'auth/requires-recent-login') {
            deleteAccountError.textContent = 'For security reasons, please log out and log in again before deleting your account.';
        } else {
            deleteAccountError.textContent = 'Error deleting account. Please try again.';
        }
    }
}

// ==================== MEDIA PICKER FUNCTIONS ====================

// Choose file from device
chooseFileBtn.addEventListener('click', () => {
    taskImage.click();
});

// Handle file selection
taskImage.addEventListener('change', handleFileSelect);

// Remove selected media
removeMediaBtn.addEventListener('click', clearSelectedMedia);

// Handle file selection with validation
function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (JPEG, PNG, etc.)');
            e.target.value = '';
            return;
        }
        
        // Updated file size validation to 20MB
        if (file.size > 20 * 1024 * 1024) {
            alert('Image size must be less than 20MB');
            e.target.value = '';
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            showSelectedMedia();
        };
        
        reader.onerror = () => {
            alert('Error reading image file. Please try again.');
            e.target.value = '';
        };
        
        reader.readAsDataURL(file);
    }
}

// Show selected media preview
function showSelectedMedia() {
    selectedMediaPreview.classList.remove('hidden');
}

// Clear selected media
function clearSelectedMedia() {
    taskImage.value = '';
    imagePreview.src = '';
    selectedMediaPreview.classList.add('hidden');
}

// Image compression function
function compressImage(base64String, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64String;
        
        img.onload = () => {
            // Create canvas for compression
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions while maintaining aspect ratio
            let { width, height } = calculateAspectRatio(img.width, img.height, maxWidth, maxHeight);
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get compressed base64 with quality 0.7
            try {
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                console.log('🔄 Image compressed:', {
                    original: base64String.length,
                    compressed: compressedBase64.length,
                    reduction: Math.round((1 - compressedBase64.length / base64String.length) * 100) + '%'
                });
                resolve(compressedBase64);
            } catch (error) {
                reject(new Error('Compression failed: ' + error.message));
            }
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image for compression'));
        };
        
        // Set timeout for image loading
        setTimeout(() => {
            if (!img.complete) {
                reject(new Error('Image loading timeout'));
            }
        }, 5000);
    });
}

// Helper function to calculate aspect ratio
function calculateAspectRatio(originalWidth, originalHeight, maxWidth, maxHeight) {
    let width = originalWidth;
    let height = originalHeight;
    
    if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }
    
    if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
}

// ==================== TASK FORM SUBMISSION ====================

// Enhanced task form submission with proper image handling
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    taskMessage.textContent = '';
    
    const description = taskDescription.value.trim();
    if (!description) {
        showMessage(taskMessage, 'Please enter a task description', 'error');
        return;
    }
    
    const submitButton = taskForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging Task...';
    submitButton.disabled = true;
    
    try {
        console.log('=== STARTING TASK SUBMISSION ===');
        
        let imageBase64 = null;
        
        // Process image if provided
        if (taskImage.files.length > 0) {
            console.log('📷 Processing image file...');
            const file = taskImage.files[0];
            
            // Updated file size validation to 20MB
            if (file.size > 20 * 1024 * 1024) {
                throw new Error('Image size must be less than 20MB');
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Please select a valid image file (JPEG, PNG, GIF, etc.)');
            }
            
            console.log('🔄 Converting image to base64...');
            imageBase64 = await convertToBase64(file);
            console.log('✅ Image conversion completed');
        } else {
            console.log('📷 No image file selected');
        }
        
        console.log('🔄 Saving task to Firestore...');
        await saveTask(description, imageBase64);
        
        // Success - clear form and show message
        taskDescription.value = '';
        clearSelectedMedia();
        
        showMessage(taskMessage, 'Task logged successfully!', 'success');
        console.log('✅ Task submission completed successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            if (taskMessage) {
                taskMessage.textContent = '';
                taskMessage.className = '';
            }
        }, 3000);
        
    } catch (error) {
        console.error('❌ Task submission failed:', error);
        showMessage(taskMessage, error.message || 'Error logging task. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        console.log('=== TASK SUBMISSION PROCESS COMPLETED ===');
    }
});

// ==================== EVENT LISTENERS ====================

// Event Listeners
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

deleteAccountBtn.addEventListener('click', showDeleteAccountModal);
themeToggleBtn.addEventListener('click', toggleTheme);
editProfileBtn.addEventListener('click', showEditProfileModal);

// Profile form submission
editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    
    if (!firstName || !lastName) {
        showMessage(editProfileMessage, 'Please enter both first and last name', 'error');
        return;
    }
    
    const submitButton = editProfileForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Saving...';
    submitButton.disabled = true;
    
    try {
        // Generate username from first name and last name
        const userName = `${firstName} ${lastName}`.trim();
        await saveUserProfile(firstName, lastName, userName);
        showMessage(editProfileMessage, 'Profile updated successfully!', 'success');
        
        setTimeout(() => {
            hideModal(editProfileModal);
        }, 1500);
        
    } catch (error) {
        showMessage(editProfileMessage, 'Error updating profile. Please try again.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

cancelEditProfileBtn.addEventListener('click', () => {
    hideModal(editProfileModal);
});

// Button event listeners
generatePdfBtn.addEventListener('click', showPdfTitleModal);
exportJsonBtn.addEventListener('click', exportTasksAsJSON);
importJsonBtn.addEventListener('click', importTasksFromJSON);
clearTasksBtn.addEventListener('click', showClearTasksModal);

// Modal event listeners
confirmPdfTitleBtn.addEventListener('click', () => {
    const title = pdfTitleInput.value.trim();
    if (title) {
        pdfTitle = title;
        hideModal(pdfTitleModal);
        showModal(pdfConfirmModal);
    } else {
        alert('Please enter a PDF title');
    }
});

cancelPdfTitleBtn.addEventListener('click', () => {
    hideModal(pdfTitleModal);
});

confirmPdfBtn.addEventListener('click', generatePDF);
cancelPdfBtn.addEventListener('click', () => {
    hideModal(pdfConfirmModal);
});

confirmClearBtn.addEventListener('click', () => {
    const enteredCode = securityCodeInput.value.trim();
    
    if (enteredCode === currentUserEmail) {
        clearAllTasks();
        hideModal(clearTasksModal);
    } else {
        clearError.textContent = 'Invalid security code. Please enter your login email.';
    }
});

cancelClearBtn.addEventListener('click', () => {
    hideModal(clearTasksModal);
});

confirmDeleteAccountBtn.addEventListener('click', deleteUserAccount);
cancelDeleteAccountBtn.addEventListener('click', () => {
    hideModal(deleteAccountModal);
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        resetModals();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        resetModals();
    }
});

// Auth state observer
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
    
    if (user) {
        // User is signed in
        currentUserEmail = user.email;
        
        console.log('Current user:', user.email);
        debugFirebaseConnection();
        
        // Start updating time
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
        
        // Load user profile and tasks
        loadUserProfile();
        loadTasks();
    } else {
        // User is signed out, redirect to login
        console.log('Redirecting to login page...');
        window.location.href = 'index.html';
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize theme
    initTheme();
    
    // Check if user is authenticated
    if (auth.currentUser) {
        console.log('User already authenticated:', auth.currentUser.email);
        currentUserEmail = auth.currentUser.email;
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
        loadUserProfile();
        loadTasks();
    }
});

// Helper function to show messages
function showMessage(element, message, type = 'success') {
    if (!element) return;
    
    element.textContent = message;
    element.className = type === 'success' ? 'success-message' : 'error-message';
    element.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            element.textContent = '';
            element.style.display = 'none';
        }, 3000);
    }
}

// Debug function to check task data
function debugTaskData() {
    console.log('=== CURRENT TASKS DEBUG ===');
    tasks.forEach((task, index) => {
        console.log(`Task ${index + 1}:`, {
            id: task.id,
            description: task.description,
            hasImage: !!task.image,
            imageLength: task.image ? task.image.length : 0,
            imagePreview: task.image ? task.image.substring(0, 100) + '...' : 'No image'
        });
    });
    console.log('==========================');
}

// Add this to dashboard.js for testing
function testPWAInstallation() {
    console.log('Testing PWA Installation...');
    console.log('Deferred Prompt:', manifestation.deferredPrompt);
    console.log('Can Install:', manifestation.canInstall());
    
    // Force show install button for testing
    manifestation.showInstallButton();
}

// Call this function from browser console to test
window.testPWAInstallation = testPWAInstallation;