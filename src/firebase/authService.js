import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from './config';
import { getErrorMessage, getSuccessMessage } from '../utils/errorHandler';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    // Send email verification
    await sendEmailVerification(user);
    
    return { 
      success: true, 
      user,
      message: getSuccessMessage('signup')
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { 
      success: true, 
      user: userCredential.user,
      message: getSuccessMessage('signin')
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    console.log("🔍 Attempting Google sign-in...");
    console.log("🔧 Auth object:", auth);
    console.log("🔧 Google provider:", googleProvider);
    
    // Add additional scopes if needed
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log("✅ Google sign-in successful:", result);
    
    return { 
      success: true, 
      user: result.user,
      message: getSuccessMessage('signin')
    };
  } catch (error) {
    console.error("❌ Google sign-in error:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    
    // Handle specific error cases
    let errorMessage = getErrorMessage(error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in was cancelled. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by browser. Please allow popups for this site and try again.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized. Please contact support.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Google sign-in is not enabled. Please contact support.';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      code: error.code
    };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { 
      success: true,
      message: getSuccessMessage('signout')
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { 
      success: true,
      message: getSuccessMessage('password-reset')
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Update user password
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user is currently signed in' };
    }

    // Re-authenticate user before updating password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    
    return { 
      success: true,
      message: getSuccessMessage('password-changed')
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};

// Update user profile
export const updateUserProfile = async (displayName, photoURL) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user is currently signed in' };
    }

    await updateProfile(user, {
      displayName: displayName,
      photoURL: photoURL
    });
    
    return { 
      success: true,
      message: getSuccessMessage('profile-updated')
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};

// Send email verification
export const sendEmailVerificationToUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user is currently signed in' };
    }

    await sendEmailVerification(user);
    
    return { 
      success: true,
      message: 'Verification email sent! Please check your inbox.'
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};
