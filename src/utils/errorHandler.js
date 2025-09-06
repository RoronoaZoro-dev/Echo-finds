// Error handling utility for better user messaging
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  
  // Firebase Auth errors
  const firebaseErrors = {
    'auth/user-not-found': 'No account found with this email address',
    'auth/wrong-password': 'Incorrect password. Please try again',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password should be at least 6 characters long',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled. Please contact support',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method',
    'auth/requires-recent-login': 'Please sign in again to complete this action',
    'auth/email-already-exists': 'This email is already registered',
    'auth/operation-not-allowed': 'This operation is not allowed',
    'auth/credential-already-in-use': 'This credential is already associated with a different account',
    'auth/invalid-verification-code': 'Invalid verification code',
    'auth/invalid-verification-id': 'Invalid verification ID',
    'auth/missing-verification-code': 'Please enter the verification code',
    'auth/missing-verification-id': 'Verification ID is missing',
    'auth/quota-exceeded': 'Quota exceeded. Please try again later',
    'auth/captcha-check-failed': 'Captcha verification failed',
    'auth/invalid-phone-number': 'Invalid phone number format',
    'auth/missing-phone-number': 'Phone number is required',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later',
    'auth/cancelled-popup-request': 'Sign-in popup was cancelled',
    'auth/popup-blocked': 'Sign-in popup was blocked by browser',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completion',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations',
    'auth/expired-action-code': 'This action code has expired',
    'auth/invalid-action-code': 'Invalid action code',
    'auth/missing-email': 'Email address is required',
    'auth/missing-password': 'Password is required',
    'auth/email-not-found': 'No account found with this email address'
  };

  // Check if it's a Firebase error
  if (error.code && firebaseErrors[error.code]) {
    return firebaseErrors[error.code];
  }

  // Check if it's a Firebase error message
  if (error.message) {
    for (const [code, message] of Object.entries(firebaseErrors)) {
      if (error.message.includes(code)) {
        return message;
      }
    }
  }

  // Generic error messages
  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

export const getSuccessMessage = (action) => {
  const successMessages = {
    'signup': 'Account created successfully! Please check your email to verify your account.',
    'signin': 'Welcome back! You have been signed in successfully.',
    'signout': 'You have been signed out successfully.',
    'password-reset': 'Password reset email sent! Please check your inbox.',
    'profile-updated': 'Profile updated successfully!',
    'email-verified': 'Email verified successfully!',
    'password-changed': 'Password changed successfully!',
    'account-deleted': 'Account deleted successfully!',
    'product-created': 'Product created successfully!',
    'product-updated': 'Product updated successfully!',
    'product-deleted': 'Product deleted successfully!',
    'verification-submitted': 'Verification documents submitted successfully!',
    'admin-created': 'Admin account created successfully!',
    'seller-approved': 'Seller account approved successfully!',
    'seller-rejected': 'Seller account rejected.',
    'settings-saved': 'Settings saved successfully!'
  };

  return successMessages[action] || 'Operation completed successfully!';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password should contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password should contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password should contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const formatErrorMessage = (error, context = '') => {
  const message = getErrorMessage(error);
  return context ? `${context}: ${message}` : message;
};
