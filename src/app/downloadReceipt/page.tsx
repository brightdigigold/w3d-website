'use client'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput, { AesEncrypt, funcForDecrypt } from '@/components/helperFunctions';
import SetProfileForNewUser from '@/components/setProfile';
import { setShowProfileForm } from '@/redux/authSlice';
import { RootState } from '@/redux/store';
import fileDownload from 'js-file-download';
import mixpanel from 'mixpanel-browser';
import OtpModal from '@/components/modals/otpModal';
import RequireAuth from '@/components/requireAuth';

const useTransactionForm = () => {
    const [loading, setLoading] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleResponse = async (response: any) => {
        const decryptedData = await funcForDecrypt(response.data.payload);
        const dataOfParticularTransactionUTR = JSON.parse(decryptedData);

        if (dataOfParticularTransactionUTR.statusCode === 200) {
            // Convert Buffer to Blob
            const buffer = Buffer.from(dataOfParticularTransactionUTR.data.data);
            const blob = new Blob([buffer], { type: 'application/pdf' });
            setPdfBlob(blob);
        }
    };

    const handleError = async (error: any) => {
        if (error.response && error.response.data && error.response.data.payload) {
            try {
                let decryptedError = await funcForDecrypt(error.response.data.payload);
                setErrorMessage(JSON.parse(decryptedError).message);
            } catch (decryptionError) {
                setErrorMessage("An error occurred while processing your request.");
            }
        } else {
            setErrorMessage("An unknown error occurred.");
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        setErrorMessage(null);
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
                `${process.env.baseUrl}/user/receipt`,
                { payload: resAfterEncrypt },
                configHeaders
            );
            await handleResponse(response);
        } catch (error: any) {
            await handleError(error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, pdfBlob, errorMessage, handleSubmit };
};

const Page = () => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);
    const showProfileForm = useSelector((state: RootState) => state.auth.showProfileForm);
    const dispatch = useDispatch();
    const { loading, pdfBlob, errorMessage, handleSubmit } = useTransactionForm();

    const onClose = () => {
        dispatch(setShowProfileForm(false));
    };

    const validationSchema = Yup.object().shape({
        utr: Yup.string()
            .required('UTR is required')
            .length(12, 'UTR should be of 12 digits'),
    });

    const formik = useFormik({
        initialValues: {
            utr: "453525325220",
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    const handleDownload = () => {
        mixpanel.track('Receipt downloaded');
        if (pdfBlob) {
            fileDownload(pdfBlob, 'DonationReceipt.pdf');
        }
    };

    return (
        <RequireAuth>
            <div className='mt-20 w-full p-4'>
                {otpModal && <OtpModal />}
                {showProfileForm && (
                    <SetProfileForNewUser isOpen={showProfileForm} onClose={onClose} />
                )}
                <div className="flex items-center justify-center h-[650px]">
                    <div className="p-4 border border-yellow-200 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] rounded-md h-1/3 sm:h-1/3 w-screen sm:w-1/3">
                        <form onSubmit={formik.handleSubmit}>
                            <FormInput
                                type="text"
                                label="UPI/UTR Ref/Txn No."
                                name="utr"
                                placeholder="Enter UTR Number"
                                formik={formik}
                                autoComplete="off"
                            />
                            <div className='my-4 items-center'>
                                <button type="submit" className='bg-themeBlue rounded-3xl py-2 px-6 extrabold hover:shadow-black hover:shadow-md'>Submit</button>
                            </div>
                        </form>
                        {loading && <p className='text-white'>Loading...</p>}
                        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                        {pdfBlob && (
                            <div className='mt-4'>
                                <button
                                    onClick={handleDownload}
                                    className='bg-themeBlue rounded-3xl py-2 px-6 extrabold'
                                >
                                    Download Receipt
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RequireAuth>
    );
};

export default Page;
