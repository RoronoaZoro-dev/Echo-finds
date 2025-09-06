import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { getErrorMessage, getSuccessMessage } from '../utils/errorHandler';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Seller sign up with email and password
export const signUpSeller = async (email, password, sellerData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, {
      displayName: sellerData.businessName || sellerData.fullName
    });
    
    // Create seller profile in Firestore
    await setDoc(doc(db, "sellers", user.uid), {
      id: user.uid,
      email: email,
      businessName: sellerData.businessName,
      fullName: sellerData.fullName,
      phone: sellerData.phone,
      address: sellerData.address,
      businessType: sellerData.businessType,
      ecoCertification: sellerData.ecoCertification,
      verificationStatus: 'pending', // pending, approved, rejected
      verificationDocuments: [],
      createdAt: new Date().toISOString(),
      isSeller: true,
      totalProducts: 0,
      totalSales: 0,
      rating: 0
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

// Seller sign in with email and password
export const signInSeller = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user is a registered seller
    const sellerDoc = await getDoc(doc(db, "sellers", user.uid));
    if (!sellerDoc.exists()) {
      await signOut(auth);
      return { success: false, error: "This account is not registered as a seller" };
    }
    
    return { 
      success: true, 
      user, 
      sellerData: sellerDoc.data(),
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

// Seller sign in with Google
export const signInSellerWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user is a registered seller
    const sellerDoc = await getDoc(doc(db, "sellers", user.uid));
    if (!sellerDoc.exists()) {
      await signOut(auth);
      return { success: false, error: "This account is not registered as a seller" };
    }
    
    return { 
      success: true, 
      user, 
      sellerData: sellerDoc.data(),
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

// Upload verification documents
export const uploadVerificationDocuments = async (userId, documents) => {
  try {
    await updateDoc(doc(db, "sellers", userId), {
      verificationDocuments: documents,
      verificationStatus: 'pending',
      verificationSubmittedAt: new Date().toISOString()
    });
    
    return { 
      success: true,
      message: getSuccessMessage('verification-submitted')
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};

// Get seller profile
export const getSellerProfile = async (userId) => {
  try {
    const sellerDoc = await getDoc(doc(db, "sellers", userId));
    if (sellerDoc.exists()) {
      return { success: true, data: sellerDoc.data() };
    } else {
      return { success: false, error: "Seller profile not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update seller profile
export const updateSellerProfile = async (userId, updateData) => {
  try {
    await updateDoc(doc(db, "sellers", userId), {
      ...updateData,
      updatedAt: new Date().toISOString()
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

// Sign out
export const signOutSeller = async () => {
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

// Listen to auth state changes
export const onSellerAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current seller
export const getCurrentSeller = () => {
  return auth.currentUser;
};
