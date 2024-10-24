'use client'
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import OtpModal from '../modals/otpModal';
import { getShippingPosts } from '../sanity/getPost';
import BlogDetailsById from '../sanity/showBlogsDetails';
import PortableText from '../sanity/showBlogsDetails';
interface Shipping {
    body: any;
}

const ShippingPolicy = () => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);
    const [shipping, setShipping] = useState<Shipping>();
    useEffect(() => {
        getShippingPosts().then(setShipping);
    }, []);


    return (
        <div className="text-gray-100">
            {otpModal && <OtpModal />}
            <div className='container'>
                <div className='text-gray-100 text-justify prose-strong:text-white prose-strong:text-xl prose-lg prose-w-full prose-headings:text-yellow-400 prose-headings:text-2xl prose-headings:text-left prose-a:text-blue-400'>
                    {shipping && (
                        //   <BlogDetailsById portableTextContent={shipping.body} />
                        <PortableText content={shipping.body} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ShippingPolicy