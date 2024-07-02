'use client'
import Loading from '@/app/loading';
import { AesEncrypt, funcForDecrypt } from '@/components/helperFunctions';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import UTRcheckModal from '@/components/modals/utrCheckModal';

const TempleUtrCheck = () => {
    const [loading, setLoading] = useState(false);
    const [utrDetailsTransactions, setUtrDetailsTransactions] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    const validationSchema = Yup.object({
        utr: Yup.string()
            .required('UTR is required')
            .length(12, 'UTR should be of 12 digits')
    });

    const formik = useFormik({
        initialValues: {
            utr: "453525325220",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const configHeaders = {
                    headers: {
                        authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                };
                const data = { utr: values.utr };
                const resAfterEncrypt = await AesEncrypt(data);

                const response = await axios.post(
                    `${process.env.baseUrl}/user/order/detailsByUTR`,
                    { payload: resAfterEncrypt },
                    configHeaders
                );

                const decryptedData = await funcForDecrypt(response.data.payload);
                const dataOfParticularTransactionUTR = JSON.parse(decryptedData);

                if (dataOfParticularTransactionUTR.statusCode === 200) {
                    setUtrDetailsTransactions(dataOfParticularTransactionUTR.data);
                    setIsModalOpen(true); // Open the modal on success
                } else {
                    setUtrDetailsTransactions(null);
                }
            } catch (error) {
                console.error("Error fetching UTR details:", error);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className='mt-6'>
            <form onSubmit={formik.handleSubmit} >
                <div className="w-full max-w-lg">
                    <label htmlFor="utr" className="text-white mb-2">UPI/UTR Ref/Txn No.</label>
                    <input
                        type="text"
                        name="utr"
                        id="utr"
                        placeholder="Enter 12 Digit Ref/Txn No."
                        className={`block w-full placeholder:text-gray-500 text-white rounded-3xl bg-theme px-4 py-2 focus:outline-none focus:bg-theme border-1 mt-2 focus:ring-0 ${formik.touched.utr && formik.errors.utr ? 'border-red-500' : 'border-b'}`}
                        autoComplete='off'
                        value={formik.values.utr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <div className="h-5">
                        {formik.touched.utr && formik.errors.utr && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.utr}</div>
                        )}
                    </div>
                </div>
                <div className=''>
                    <button type="submit" className='bg-themeBlue rounded-3xl py-2 px-4 extrabold'>Submit</button>
                </div>
            </form>
            {loading && <Loading />}
            <UTRcheckModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
                {utrDetailsTransactions && (
                    <div className='w-full border h-auto mt-8 rounded-md p-4 text-white'>
                        <div className=' flex justify-between p-2 border-b-2 border-yellow-400 rounded '>
                            <p className='text-base bold leading-7'>Devotee Name</p>
                            <p>{utrDetailsTransactions.payoutData?.devoteeName}</p>
                        </div>
                        <div className='flex justify-between p-2'>
                            <p className='text-base bold leading-7'>UPI/UTR Ref/Txn No</p>
                            <p>{utrDetailsTransactions.payoutData?.bank_reference}</p>
                        </div>
                        <div className='flex justify-between p-2'>
                            <p className='text-base bold leading-7'>Amount</p>
                            <p>₹ {utrDetailsTransactions.amount}</p>
                        </div>
                        <div className='flex justify-between p-2'>
                            <p className='text-base bold leading-7'>Grams</p>
                            <p>{utrDetailsTransactions.gram} gms</p>
                        </div>
                        <div className='flex justify-between p-2'>
                            <p className='text-base bold leading-7'>Status</p>
                            <p>{utrDetailsTransactions.status}</p>
                        </div>
                        <div className='flex justify-between p-2'>
                            <p className='text-base bold leading-7'>Date</p>
                            <p>{formatDate(utrDetailsTransactions.orderAt)}</p>
                        </div>
                    </div>
                )}
            </UTRcheckModal>
        </div>
    );
}

export default TempleUtrCheck;
