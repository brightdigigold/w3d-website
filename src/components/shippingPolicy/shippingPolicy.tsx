'use client'
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import OtpModal from '../modals/otpModal';
import Link from 'next/link';
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

            <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-8 pt-32">
                <div className="container">
                    <div className="row pt-5 pb-5">
                        <div className=" sm:flex justify-between items-center text-center sm:text-left">
                            <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white">
                                Shipping Policy
                            </h1>
                            <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Shipping+Policy.gif" className="" />
                        </div>
                        <div className='text-gray-100 text-justify'>
                            {shipping && (
                                //   <BlogDetailsById portableTextContent={shipping.body} />
                                <PortableText content={shipping.body} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShippingPolicy