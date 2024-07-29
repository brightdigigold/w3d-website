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

        if (isloggedIn) {
            // console.log('You are from 20');
            router.replace(window.location.pathname);
            return;
        }

        if (isLoggedInForTempleReceipt && purpose === 'receipt' && path == '/downloadReceipt') {
            // console.log('You are from 26');
            router.replace('/downloadReceipt');
            return;
        }

        if (isLoggedInForTempleReceipt && purpose === 'receipt') {
            // console.log('You are from 31');
            router.replace('/downloadReceipt');
            return;
        }

        if (!isloggedIn && !isLoggedInForTempleReceipt) {
            // console.log('You are from 38');
            router.replace('/');
            return;
        }

        if (!isloggedIn) {
            // console.log('You are from 44');
            router.replace('/');
            return;
        }
    }, [isloggedIn, isLoggedInForTempleReceipt, purpose, path, router]);

    return children;
};

export default RequireAuth;
