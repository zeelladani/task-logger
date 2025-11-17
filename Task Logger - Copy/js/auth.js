// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const googleLoginBtn = document.getElementById('google-login');
const googleSignupBtn = document.getElementById('google-signup');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const signupSuccess = document.getElementById('signup-success');
const forgotPasswordError = document.getElementById('forgot-password-error');
const forgotPasswordSuccess = document.getElementById('forgot-password-success');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const showLoginFromForgot = document.getElementById('show-login-from-forgot');
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const forgotPasswordSection = document.getElementById('forgot-password-section');

// Password toggle elements
const toggleLoginPassword = document.getElementById('toggle-login-password');
const toggleSignupPassword = document.getElementById('toggle-signup-password');
const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
const loginPassword = document.getElementById('login-password');
const signupPassword = document.getElementById('signup-password');
const confirmPassword = document.getElementById('confirm-password');
const forgotPasswordEmail = document.getElementById('forgot-password-email');

// Tab elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Tab functionality for new design
function setupTabSystem() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked tab
            btn.classList.add('active');
            document.getElementById(`${targetTab}-section`).classList.add('active');
            
            clearMessages();
        });
    });
}

// Toggle password visibility
function togglePasswordVisibility(input, button) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    button.innerHTML = type === 'password' ? '<span class="eye-icon">👁️</span>' : '<span class="eye-icon">🔒</span>';
}

// Switch between login and signup forms using tabs
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('[data-tab="signup"]').click();
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('[data-tab="login"]').click();
});

// Forgot password functionality
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Hide all tab contents
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    // Hide forgot password section if it was shown
    forgotPasswordSection.classList.add('hidden');
    
    // Show forgot password section
    forgotPasswordSection.classList.remove('hidden');
    clearMessages();
});

showLoginFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    // Hide forgot password
    forgotPasswordSection.classList.add('hidden');
    // Show login tab
    document.querySelector('[data-tab="login"]').click();
});

// Clear all messages
function clearMessages() {
    loginError.textContent = '';
    signupError.textContent = '';
    signupSuccess.textContent = '';
    forgotPasswordError.textContent = '';
    forgotPasswordSuccess.textContent = '';
}

// Validate password strength
function checkPasswordStrength(password) {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
}

// Update password strength indicator
if (signupPassword) {
    signupPassword.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        // You can add visual feedback for password strength here
    });
}

// Validate passwords match
function validatePasswords() {
    const password = signupPassword.value;
    const confirm = confirmPassword.value;
    
    if (password !== confirm) {
        signupError.textContent = 'Passwords do not match';
        return false;
    }
    
    if (password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters long';
        return false;
    }
    
    return true;
}

// Event Listeners for Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Signing in...';
        submitButton.disabled = true;
        
        await auth.signInWithEmailAndPassword(email, password);
        // Redirect to dashboard on successful login
        window.location.href = 'dashboard.html';
    } catch (error) {
        loginError.textContent = getAuthErrorMessage(error);
        
        // Reset button
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Log in';
        submitButton.disabled = false;
    }
});

// Event Listeners for Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Validate passwords
    if (!validatePasswords()) {
        return;
    }
    
    try {
        // Show loading state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Creating account...';
        submitButton.disabled = true;
        
        // Create new user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create initial user profile in Firestore
        await db.collection('users').doc(user.uid).set({
            firstName: '',
            lastName: '',
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Show success message
        signupSuccess.textContent = 'Account created successfully! Redirecting...';
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        signupError.textContent = getAuthErrorMessage(error);
        
        // Reset button
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Sign up';
        submitButton.disabled = false;
    }
});

// Forgot Password Form Submission
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    
    const email = forgotPasswordEmail.value;
    
    if (!email) {
        forgotPasswordError.textContent = 'Please enter your email address';
        return;
    }
    
    try {
        // Show loading state
        const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        await auth.sendPasswordResetEmail(email);
        
        // Show success message
        forgotPasswordSuccess.textContent = 'Password reset email sent! Check your inbox for further instructions.';
        forgotPasswordEmail.value = '';
        
        // Reset button after delay
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 3000);
        
    } catch (error) {
        forgotPasswordError.textContent = getAuthErrorMessage(error);
        
        // Reset button on error
        const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Send Reset Link';
        submitButton.disabled = false;
    }
});

// Google Authentication for Login
googleLoginBtn.addEventListener('click', async () => {
    await signInWithGoogle();
});

// Google Authentication for Signup
googleSignupBtn.addEventListener('click', async () => {
    await signInWithGoogle();
});

// Common Google Sign-in function
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Check if user profile exists, if not create one
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            // Extract first and last name from Google profile
            const displayName = user.displayName || '';
            const nameParts = displayName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            await db.collection('users').doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Redirect to dashboard on successful login
        window.location.href = 'dashboard.html';
    } catch (error) {
        const errorElement = loginSection.classList.contains('hidden') ? 
                           (signupSection.classList.contains('hidden') ? forgotPasswordError : signupError) : 
                           loginError;
        errorElement.textContent = getAuthErrorMessage(error);
    }
}

// Password toggle event listeners
toggleLoginPassword.addEventListener('click', () => {
    togglePasswordVisibility(loginPassword, toggleLoginPassword);
});

toggleSignupPassword.addEventListener('click', () => {
    togglePasswordVisibility(signupPassword, toggleSignupPassword);
});

toggleConfirmPassword.addEventListener('click', () => {
    togglePasswordVisibility(confirmPassword, toggleConfirmPassword);
});

// Helper function to get user-friendly error messages
function getAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please use a different email or try logging in.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Password is too weak. Please choose a stronger password.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please check your email or sign up.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-login-credentials':
            return 'Invalid credentials. Please check your email and password.';
        case 'auth/too-many-requests':
            return 'Too many unsuccessful login attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please check your email and password.';
        case 'auth/popup-closed-by-user':
            return 'Google sign-in was cancelled. Please try again.';
        case 'auth/popup-blocked':
            return 'Popup was blocked by your browser. Please allow popups for this site.';
        case 'auth/unauthorized-domain':
            return 'This domain is not authorized for authentication. Please contact support.';
        default:
            return error.message || 'An unexpected error occurred. Please try again.';
    }
}

// Real-time password confirmation validation
if (confirmPassword) {
    confirmPassword.addEventListener('input', function() {
        const password = signupPassword.value;
        const confirm = this.value;
        
        if (confirm.length > 0 && password !== confirm) {
            this.style.borderColor = 'var(--danger)';
        } else {
            this.style.borderColor = '';
        }
    });
}

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        // Redirect to dashboard if user is already logged in
        window.location.href = 'dashboard.html';
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupTabSystem();
    initTheme();
    
    // Set login as default active tab
    document.querySelector('[data-tab="login"]').classList.add('active');
    document.getElementById('login-section').classList.add('active');
    
    // Initialize other functionality
    setupInputValidation();
    setupFormLoadingStates();
    setupEnterKeySubmission();
    autoFocusFirstInput();
});

// Enhanced input validation
function setupInputValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = '';
            }
        });
    });

    // Password validation for signup
    if (signupPassword) {
        signupPassword.addEventListener('blur', function() {
            if (this.value && this.value.length < 6) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = '';
            }
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced form submission with loading states
function setupFormLoadingStates() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Please wait...';
                submitButton.disabled = true;
                
                // Revert after 10 seconds if something goes wrong
                setTimeout(() => {
                    if (submitButton.disabled) {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    }
                }, 10000);
            }
        });
    });
}

// Auto-focus first input in visible form
function autoFocusFirstInput() {
    const visibleForm = document.querySelector('.auth-form:not(.hidden)');
    if (visibleForm) {
        const firstInput = visibleForm.querySelector('input:not([type="hidden"])');
        if (firstInput) {
            firstInput.focus();
        }
    }
}

// Enter key to submit forms
function setupEnterKeySubmission() {
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activeForm = document.querySelector('.auth-form:not(.hidden)');
            if (activeForm) {
                const submitButton = activeForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.click();
                }
            }
        }
    });
}