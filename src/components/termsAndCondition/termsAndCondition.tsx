'use client'
import React, { useEffect, useState } from 'react'
import OtpModal from '../modals/otpModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import BlogDetailsById from '../sanity/showBlogsDetails';
import { gettermsPosts } from '../sanity/getPost';
import PortableText from '../sanity/showBlogsDetails';
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

           
            <div className='container'>
                <div className='text-gray-100 text-justify prose-strong:text-white prose-strong:text-xl prose-lg prose-w-full prose-headings:text-yellow-400 prose-headings:text-2xl prose-headings:text-left prose-a:text-blue-400'>
                    {terms && (
                        //   <BlogDetailsById portableTextContent={terms.body} />
                        <PortableText content={terms.body} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TermsAndCondition