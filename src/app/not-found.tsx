import CustomButton from '@/components/customButton';
import Link from 'next/link';
import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-theme">
            <div className="text-center">
                <h1 className="text-5xl sm:text-8xl font-bold text-red-500">404</h1>
                <p className="text-2xl font-semibold text-gray-100 mt-4">Oops! Page not found</p>
                <p className="text-gray-200 mt-2 tracking-wide">The page you are looking for might have been removed or is temporarily unavailable.</p>
                <Link href="/" >
                    <CustomButton
                        containerStyles="mt-6 inline-block px-6 py-3 bg-themeBlue sm:bg-[#b5c4c9] text-black font-semibold rounded-lg hover:bg-[#c8d9df]"
                        title='Go Back Home'
                    >
                    </CustomButton>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
