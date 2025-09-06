import React, { useState, createContext, useEffect } from 'react';
import { onAdminAuthStateChange, getAdminProfile } from '../firebase/adminAuthService';

export const AdminContext = createContext(null);

function AdminContextProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [adminProfile, setAdminProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAdminAuthStateChange(async (user) => {
            if (user) {
                setAdmin(user);
                // Fetch admin profile data
                const profileResult = await getAdminProfile(user.uid);
                if (profileResult.success) {
                    setAdminProfile(profileResult.data);
                }
            } else {
                setAdmin(null);
                setAdminProfile(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        admin,
        setAdmin,
        adminProfile,
        setAdminProfile,
        loading
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export default AdminContextProvider;
