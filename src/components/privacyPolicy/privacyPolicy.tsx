'use client'
import React, { useEffect, useState } from 'react';
import OtpModal from '../modals/otpModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getPrivacyPosts } from '../sanity/getPost';
import BlogDetailsById from '../sanity/showBlogsDetails';
import PortableText from '../sanity/showBlogsDetails';
interface Privacy {
    body: any;
}

const PrivacyPolicy = () => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);
    const [privacy, setPrivacy] = useState<Privacy>();

    useEffect(() => {
        getPrivacyPosts().then(setPrivacy);
    }, []);

    return (
        <div>
            {otpModal && <OtpModal />}
                <div className='container'>
                    <div className='text-gray-100 text-justify prose-strong:text-white prose-strong:text-xl prose-lg prose-w-full prose-headings:text-yellow-400 prose-headings:text-2xl prose-headings:text-left prose-a:text-blue-400'>
                        {privacy && (
                            //   <BlogDetailsById portableTextContent={privacy.body} />
                            <PortableText content={privacy.body} />
                        )}
                    </div>
                </div>
            </div>
        // </div>
    );
}

export default PrivacyPolicy;
