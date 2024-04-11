'use client'
import React, { useEffect, useState } from 'react'
import OtpModal from '../modals/otpModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import BlogDetailsById from '../sanity/showBlogsDetails';
import { gettermsPosts } from '../sanity/getPost';
interface terms {
    body: any; 
  }

const TermsAndCondition = () => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);
    const [terms, setterms] = useState<terms>();

    useEffect(() => {
        gettermsPosts().then(setterms);
    }, []);
    return (
        <div className="text-gray-200">
            {otpModal && <OtpModal />}
            <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-8 pt-32">
                <div className="container">
                    <div className="row pt-5 pb-5">
                        <div className="sm:flex justify-between items-center text-center sm:text-left">
                            <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white text-center">
                                Privacy Policy
                            </h1>
                            <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Privacy+Policy.gif" className="" />
                        </div>
                        <div className='text-gray-100'>
                        {terms && (
                          <BlogDetailsById portableTextContent={terms.body} />
                        ) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermsAndCondition