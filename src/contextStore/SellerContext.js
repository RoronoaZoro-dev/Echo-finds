import React, { useState, createContext, useEffect } from 'react';
import { onSellerAuthStateChange, getSellerProfile } from '../firebase/sellerAuthService';

export const SellerContext = createContext(null);

function SellerContextProvider({ children }) {
    const [seller, setSeller] = useState(null);
    const [sellerProfile, setSellerProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSellerAuthStateChange(async (user) => {
            if (user) {
                setSeller(user);
                // Fetch seller profile data
                const profileResult = await getSellerProfile(user.uid);
                if (profileResult.success) {
                    setSellerProfile(profileResult.data);
                }
            } else {
                setSeller(null);
                setSellerProfile(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        seller,
        setSeller,
        sellerProfile,
        setSellerProfile,
        loading
    };

    return (
        <SellerContext.Provider value={value}>
            {children}
        </SellerContext.Provider>
    );
}

export default SellerContextProvider;
