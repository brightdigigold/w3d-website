'use client'
import { AesDecrypt } from '@/components/helperFunctions'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const page = ({ params }: any) => {
    const id = params.id
    const [message, setMessage] = useState<String>('')

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
        <>
            <div className='mt-20 text-white justify-center mb-6'>
                <h1 className='text-white text-2xl text-center m-8'>{message}</h1>
                <div className='justify-center items-center text-center'>
                    <Link className='rounded border-2 border-yellow-400 px-3 py-4 text-white text-center bold' href={'/'}>Go to Home Page</Link>
                </div>
            </div>
        </>
    )
}

export default page