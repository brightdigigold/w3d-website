'use client'
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const RequireAuth = ({ children }) => {
    const router = useRouter();
    const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    useEffect(() => {
        if (!isloggedIn) {
            router.replace('/'); 
        }
    }, []);

    return children;
};

export default RequireAuth;
