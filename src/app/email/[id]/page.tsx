"use client"

import React, { useEffect, useState } from 'react';
// import style from './verify.module.css';
// import { AesDecrypt } from '@/components/middleware';
import Swal from 'sweetalert2';
import { useRouter, } from "next/router";
import Link from 'next/link';
import { AesDecrypt } from '@/components/helperFunctions';
// import { log } from '@/components/logger';

// export const getServerSideProps = async ({ query, req, res }) => {
// 	log('query', query)
// 	return {
// 		props: {
// 			id : query.id
// 		},
// 	}
// };

const PageEmailVerify = ({ id }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail()
  }, [])

  const verifyEmail = () => {
    fetch(`${process.env.baseUrl}/public/verify/${id}`)
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await AesDecrypt(data.payload);
        const parsedEmailData = JSON.parse(decryptedData);
        if (parsedEmailData.status) {
          setMessage(`${parsedEmailData.message}`);
          // Swal.fire(
          //     'Success',
          //     `${parsedEmailData.data} ${parsedEmailData.message}`,
          //     'success'
          //   )
          //   router.push("")
        } else {
          setMessage(`${parsedEmailData.message}`);
        }
      })
      .catch(async (error) => {
        const decryptedData = await AesDecrypt(error.response.data.payload);
        const parsedEmailData = JSON.parse(decryptedData);
        setMessage(`${parsedEmailData.message}`);
      })
  }
  return (
    <div className="">
      <div className='row'>
        <div className='col-md-12'>
          <h1>{message}</h1>
          <div className=""><Link href="/">HOME</Link></div>
        </div>
      </div>
    </div>
  )
}

export default PageEmailVerify