'use client'
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const RequireAuth = ({ children }) => {
    const router = useRouter();
    const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);
    const purpose = useSelector((state: RootState) => state.auth.purpoes);
    const path = window.location.pathname

    console.log("pathname", window.location.pathname)

    useEffect(() => {

        if (!isloggedIn && !isLoggedInForTempleReceipt) {
            router.replace('/');
        } else if (isLoggedInForTempleReceipt && purpose === 'receipt' && path == '/downloadReceipt') {
            router.replace('/downloadReceipt');
        } else if (!isloggedIn) {
            router.replace('/')
        } else {
            router.replace(window.location.pathname);
        }
    }, []);

    return children;
};

export default RequireAuth;
