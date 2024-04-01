'use client'
// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'
// import OtpModal from '../modals/otpModal';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { getPrivacyPosts } from '../sanity/getPost';
// import BlogDetailsById from '../sanity/showBlogsDetails';

// interface Post {
   
//     body: any; 
//   }

// const PrivacyPolicy = () => {
//     const otpModal = useSelector((state: RootState) => state.auth.otpModal);
//     const [privacy, setPrivacy] = useState<Post|null>();


//     useEffect(() => {
//         getPrivacyPosts().then(setPrivacy);
//     }, []);


//     console.log("privacy+++++", privacy)
//     return (
//         <div>
//             {otpModal && <OtpModal />}
//             <div className="mx-auto px-4 sm:px-6 lg:px-16  py-16 pb-28 xl:pb-8 pt-32">
//                 <div className="container">
//                     <div className="row pt-5 pb-5">
//                         <div className=" sm:flex justify-between items-center text-center sm:text-left">
//                             <h1 className="text-2xl sm:text-7xl mb-4   extrabold text-white text-center">
//                                 Privacy Policy
//                             </h1>
//                             <img src="/lottie/Privacy Policy.gif" className="" />
//                         </div>
//                         {/* // paste here */}
//                         <BlogDetailsById portableTextContent={privacy?.body} />

//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default PrivacyPolicy

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import OtpModal from '../modals/otpModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getPrivacyPosts } from '../sanity/getPost';
import BlogDetailsById from '../sanity/showBlogsDetails';

interface Privacy {
  body: any; 
}

const PrivacyPolicy = () => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);
    const [privacy, setPrivacy] = useState<Privacy>();

    useEffect(() => {
        getPrivacyPosts().then(setPrivacy);
    }, []);

    console.log("privacy+++++", privacy);

    return (
        <div>
            {otpModal && <OtpModal />}
            <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-8 pt-32">
                <div className="container">
                    <div className="row pt-5 pb-5">
                        <div className="sm:flex justify-between items-center text-center sm:text-left">
                            <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white text-center">
                                Privacy Policy
                            </h1>
                            <img src="/lottie/Privacy Policy.gif" className="" alt="Privacy Policy Animation" />
                        </div>
                        <div className='text-gray-100'>
                        {privacy && (
                          <BlogDetailsById portableTextContent={privacy.body} />
                        ) }
                        </div>
                       
                       

                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
