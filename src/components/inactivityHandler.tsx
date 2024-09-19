import { useRouter } from 'next/navigation';
import React, { useEffect, useCallback } from 'react';
// import router from "next/navigation"
// import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation

const INACTIVITY_LIMIT = 30 * 1000
// 30 * 60 * 1000; // 30 minutes in milliseconds

const InactivityHandler = () => {
    const router = useRouter()
    // const navigate = useNavigate(); // Hook to navigate to login page
    let inactivityTimer;

    // Function to reset the inactivity timer
    const resetInactivityTimer = useCallback(() => {
        clearTimeout(inactivityTimer); // Clear any existing timer
        inactivityTimer = setTimeout(logoutUser, INACTIVITY_LIMIT); // Set a new timer
    }, []);

    // Function to log out the user
    const logoutUser = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        alert('You have been logged out due to inactivity.');
        router.push('/'); // Redirect to the login page
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
