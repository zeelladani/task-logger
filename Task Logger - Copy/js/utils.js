// Utility functions with enhanced image handling

// Convert image to base64 with better error handling and compression
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        // Validate file
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('Invalid file type. Please select an image.'));
            return;
        }

        // Validate file size (max 2MB for better performance)
        if (file.size > 2 * 1024 * 1024) {
            reject(new Error('Image size must be less than 2MB for optimal performance.'));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (event) => {
            const result = event.target.result;
            
            // Validate the result
            if (result && typeof result === 'string') {
                console.log('✅ Image converted to base64, length:', result.length);
                
                // Optional: Compress image if needed
                compressImage(result, 800, 600) // Max width: 800px, Max height: 600px
                    .then(compressedImage => {
                        console.log('✅ Image compressed, length:', compressedImage.length);
                        resolve(compressedImage);
                    })
                    .catch(error => {
                        console.warn('⚠️ Image compression failed, using original:', error);
                        resolve(result); // Use original if compression fails
                    });
            } else {
                reject(new Error('Failed to process image.'));
            }
        };
        
        reader.onerror = (error) => {
            console.error('❌ FileReader error:', error);
            reject(new Error('Error reading image file. Please try again.'));
        };
        
        reader.onabort = () => {
            reject(new Error('Image reading was aborted.'));
        };
        
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            reject(new Error('Error processing image file.'));
        }
    });
}

// Compress image to reduce size
function compressImage(base64String, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64String;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get compressed base64 (quality: 0.7 for good balance)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressedBase64);
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image for compression'));
        };
    });
}

// Format date to IST
function formatToIST(date) {
    return date.toLocaleString("en-IN", { 
        timeZone: "Asia/Kolkata",
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Show message with auto-hide
function showMessage(element, message, type = 'success', duration = 3000) {
    if (!element) return;
    
    element.textContent = message;
    element.className = type === 'success' ? 'success-message' : 'error-message';
    element.style.display = 'block';
    
    if (duration > 0) {
        setTimeout(() => {
            element.textContent = '';
            element.style.display = 'none';
        }, duration);
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasLowerCase || !hasUpperCase || !hasNumbers) {
        return { 
            isValid: false, 
            message: 'Password should include uppercase, lowercase letters and numbers' 
        };
    }
    
    return { isValid: true, message: 'Password is strong' };
}

// Debounce function for input validation
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertToBase64,
        formatToIST,
        showMessage,
        isValidEmail,
        validatePassword,
        debounce,
        compressImage
    };
}