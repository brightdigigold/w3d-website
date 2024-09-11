'use client'
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const RequireAuth = ({ children }) => {
    const router = useRouter();
    const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);
    const purpose = useSelector((state: RootState) => state.auth.purpose);
    const path = window.location.pathname


    useEffect(() => {

        if (isloggedIn) {
            router.replace(window.location.pathname);
            return;
        }

        if (isLoggedInForTempleReceipt && purpose === 'receipt' && path == '/donation-receipt') {
            router.replace('/donation-receipt');
            return;
        }

        if (isLoggedInForTempleReceipt && purpose === 'receipt') {
            router.replace('/donation-receipt');
            return;
        }

        if (!isloggedIn && !isLoggedInForTempleReceipt) {
            router.replace('/');
            return;
        }

        if (!isloggedIn) {
            router.replace('/');
            return;
        }
    }, [isloggedIn, isLoggedInForTempleReceipt, purpose, path, router]);

    return children;
};

export default RequireAuth;
