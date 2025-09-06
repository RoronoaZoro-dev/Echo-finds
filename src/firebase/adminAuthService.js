import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './config';
import { getErrorMessage, getSuccessMessage } from '../utils/errorHandler';

// Admin sign up (only for super admins)
export const signUpAdmin = async (email, password, adminData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, {
      displayName: adminData.fullName
    });
    
    // Create admin profile in Firestore
    await setDoc(doc(db, "admins", user.uid), {
      id: user.uid,
      email: email,
      fullName: adminData.fullName,
      role: adminData.role || 'admin', // admin, super_admin
      permissions: adminData.permissions || ['view_dashboard', 'manage_sellers', 'manage_products'],
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isAdmin: true
    });
    
    // Send email verification
    await sendEmailVerification(user);
    
    return { 
      success: true, 
      user,
      message: getSuccessMessage('admin-created')
    };
  } catch (error) {
    return { 
      success: false, 
      error: getErrorMessage(error),
      code: error.code
    };
  }
};

// Admin sign in
export const signInAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user is an admin
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    if (!adminDoc.exists()) {
      await signOut(auth);
      return { success: false, error: "This account is not authorized as an admin" };
    }
    
    const adminData = adminDoc.data();
    if (!adminData.isActive) {
      await signOut(auth);
      return { success: false, error: "Admin account is deactivated" };
    }
    
    // Update last login
    await updateDoc(doc(db, "admins", user.uid), {
      lastLogin: new Date().toISOString()
    });
    
    return { 
      success: true, 
      user, 
      adminData,
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

// Get admin profile
export const getAdminProfile = async (userId) => {
  try {
    const adminDoc = await getDoc(doc(db, "admins", userId));
    if (adminDoc.exists()) {
      return { success: true, data: adminDoc.data() };
    } else {
      return { success: false, error: "Admin profile not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update admin profile
export const updateAdminProfile = async (userId, updateData) => {
  try {
    await updateDoc(doc(db, "admins", userId), {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all admins (for super admin)
export const getAllAdmins = async () => {
  try {
    const q = query(collection(db, "admins"));
    const querySnapshot = await getDocs(q);
    const admins = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: admins };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Deactivate/Activate admin
export const toggleAdminStatus = async (adminId, isActive) => {
  try {
    await updateDoc(doc(db, "admins", adminId), {
      isActive: isActive,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const onAdminAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current admin
export const getCurrentAdmin = () => {
  return auth.currentUser;
};
