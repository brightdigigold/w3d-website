'use client'
import React, { useEffect, useState } from 'react'
import OtpModal from '../modals/otpModal'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getrefundsPosts } from '../sanity/getPost';
import BlogDetailsById from '../sanity/showBlogsDetails';
import PortableText from '../sanity/showBlogsDetails';
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
        <div className="container">
          <div className='text-gray-100 text-justify prose-strong:text-white prose-strong:text-xl prose-lg prose-w-full prose-headings:text-yellow-400 prose-headings:text-2xl prose-headings:text-left prose-a:text-blue-400'>
            {refunds && (
              // <BlogDetailsById portableTextContent={refunds.body} />
              <PortableText content={refunds.body} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefundAndCancellation