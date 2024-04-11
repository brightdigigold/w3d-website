'use client'
import React, { useEffect, useState } from 'react'
import OtpModal from '../modals/otpModal'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { getrefundsPosts } from '../sanity/getPost';
import BlogDetailsById from '../sanity/showBlogsDetails';
interface refunds {
  body: any;
}
const RefundAndCancellation = () => {
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);
  const [refunds, setRefunds] = useState<refunds>();
  useEffect(() => {
    getrefundsPosts().then(setRefunds);
  }, []);


  return (
    <div>
      <div className="text-gray-100">
        {otpModal && <OtpModal />}
        <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-8 pt-32">
          <div className="container">
            <div className="row pt-5 pb-5">
            <div className=" sm:flex justify-between items-center text-center sm:text-left">
              <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white">
                Refund & <br />
                Cancellations
              </h1>
              <img src="/lottie/Refund Policy.gif" className="" />
            </div>
              <div className='text-gray-100'>
                {refunds && (
                  <BlogDetailsById portableTextContent={refunds.body} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefundAndCancellation