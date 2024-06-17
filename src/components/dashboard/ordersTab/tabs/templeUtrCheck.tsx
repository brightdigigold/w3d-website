'use client'
import Loading from '@/app/loading';
import { AesEncrypt, funcForDecrypt } from '@/components/helperFunctions';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';
import {  format } from "date-fns";

const TempleUtrCheck = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(false);
    const [utrDetailsTransactions, setUtrDetailsTransactions] = useState<any>({});

    

    console.log("utrDetailsTransactions", utrDetailsTransactions, utrDetailsTransactions?.data?.orderAt)

    const validationSchema = Yup.object().shape({
        utr: Yup.string()
            .required('UTR is required')
            .length(12, 'UTR must be exactly 12 digits')
    });

    const formik = useFormik({
        initialValues: {
            utr: "453525325220",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // Handle form submission
            console.log(values);
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const configHeaders = {
                    headers: {
                        authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                };
                const data = {
                    utr: values.utr,
                };
                const resAfterEncrypt = await AesEncrypt(data);

                const body = {
                    payload: resAfterEncrypt,
                };

                const response = await axios.post(
                    `${process.env.baseUrl}/user/order/detailsByUTR`,
                    body,
                    configHeaders
                );

                const decryptedData = await funcForDecrypt(response.data.payload);
                let dataOfParticularTransactionUTR = JSON.parse(decryptedData);
                // setdataOfTransaction(dataOfParticularTransaction);
                console.log("dataOfParticularTransactionUTR from temple utr", dataOfParticularTransactionUTR);
                setUtrDetailsTransactions(dataOfParticularTransactionUTR)
            } catch (error) {
                setLoading(false);
                console.error("errordata", error);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className='mt-6'>
            <form onSubmit={formik.handleSubmit} className=''>
                <div className="flex items-center gap-4">
                    <div className="w-full max-w-lg">
                        <label htmlFor="utr" className="text-white mb-2">UPI/UTR Ref/Txn No.</label>
                        <input
                            type="text"
                            name="utr"
                            id="utr"
                            placeholder="Enter 12 Digit Ref/Txn No."
                            className={`block w-full max-w-lg placeholder:text-gray-500 text-white rounded-3xl bg-theme px-4 py-2 focus:outline-none focus:bg-theme border-1 mt-2 focus:ring-0 ${formik.touched.utr && formik.errors.utr ? 'border-red-500' : 'border-b'}`}
                            autoComplete='off'
                            value={formik.values.utr}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.utr && formik.errors.utr && (
                            <div className="text-red-500 ">{formik.errors.utr}</div>
                        )}
                    </div>
                    <div className=''>
                        <button type="submit" className='bg-themeBlue rounded-3xl py-2 px-4 extrabold'>Submit</button>
                    </div>
                </div>
            </form>
            {loading && <Loading />}
            <div className='w-full border border-1 h-auto mt-8 rounded-md'>
                <div className='text-white flex justify-around p-2'>
                    <p className='text-base bold leading-7'>Devotee Name</p>
                    <p>{utrDetailsTransactions?.data?.payoutData?.devoteeName}</p>
                </div>
                <div className='text-white flex justify-around p-2'>
                    <p className='text-base bold leading-7'>UPI/UTR Ref/Txn No</p>
                    <p>{utrDetailsTransactions?.data?.payoutData?.bank_reference}</p>
                </div>
                <div className='text-white flex justify-around p-2'>
                    <p className='text-base bold leading-7'>Amount</p>
                    <p>₹ {utrDetailsTransactions?.data?.amount}</p>
                </div>
                <div className='text-white flex justify-around p-2'>
                    <p className='text-base bold leading-7'>Grams</p>
                    <p>{utrDetailsTransactions?.data?.gram} gms</p>
                </div>

                <div className='text-white flex justify-around p-2'>
                    <p className='text-base bold leading-7'>Status</p>
                    <p>{utrDetailsTransactions?.data?.status}</p>
                </div>

                <div className='text-white flex justify-around p-2'>
                    <p className='text-base bold leading-7'>Date</p>
                    <p>{Date.parse(utrDetailsTransactions?.data?.orderAt).toLocaleString()}</p>
                    {/* <p>{(utrDetailsTransactions?.data?.orderAt).toLocaleString()}</p> */}
                </div>
            </div>
        </div>
    )
}

export default TempleUtrCheck;
