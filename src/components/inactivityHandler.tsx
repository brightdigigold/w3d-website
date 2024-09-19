import { setAuthenticationMode, setCorporateBusinessDetails, setIsLoggedIn, setIsLoggedInForTempleReceipt, setShowOTPmodal, SetUserType } from '@/redux/authSlice';
import { clearCoupon } from '@/redux/couponSlice';
import { RootState } from '@/redux/store';
import { resetUserDetails } from '@/redux/userDetailsSlice';
import { resetVault } from '@/redux/vaultSlice';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/navigation';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in milliseconds

const InactivityHandler = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);


    const logoutProfile = () => {
        localStorage.removeItem("mobile_number");
        localStorage.removeItem("token");
        localStorage.removeItem("isLogIn");
        mixpanel.reset();
        dispatch(setIsLoggedIn(false));
        dispatch(resetUserDetails());
        dispatch(setShowOTPmodal(false));
        dispatch(setIsLoggedInForTempleReceipt(false));
        dispatch(SetUserType(''));
        dispatch(setCorporateBusinessDetails(null));
        dispatch(setAuthenticationMode(null));
        dispatch(resetVault());
        dispatch(clearCoupon());
        router.push("/");
    };

    let inactivityTimer: any;

    // Function to reset the inactivity timer
    const resetInactivityTimer = useCallback(() => {
        clearTimeout(inactivityTimer); // Clear any existing timer
        inactivityTimer = setTimeout(logoutUser, INACTIVITY_LIMIT); // Set a new timer
    }, []);

    // Function to log out the user
    const logoutUser = () => {
        if (isloggedIn) {
            logoutProfile();
        } 
    };

    // Setup event listeners for user activity
    useEffect(() => {
        // Attach event listeners
        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keypress', resetInactivityTimer);
        window.addEventListener('click', resetInactivityTimer);
        window.addEventListener('touchstart', resetInactivityTimer);

        // Start the timer when the component mounts
        resetInactivityTimer();

        // Cleanup event listeners when the component unmounts
        return () => {
            window.removeEventListener('mousemove', resetInactivityTimer);
            window.removeEventListener('keypress', resetInactivityTimer);
            window.removeEventListener('click', resetInactivityTimer);
            window.removeEventListener('touchstart', resetInactivityTimer);
            clearTimeout(inactivityTimer); // Clear timeout on unmount
        };
    }, [resetInactivityTimer]);

    return null; // This component doesn't render anything, just manages logout
};

export default InactivityHandler;
