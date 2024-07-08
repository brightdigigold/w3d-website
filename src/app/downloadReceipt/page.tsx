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

const Page = () => {
    const otpModal = useSelector((state: RootState) => state.auth.otpModal);
    const showProfileForm = useSelector((state: RootState) => state.auth.showProfileForm);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onClose = () => {
        dispatch(setShowProfileForm(false));
    };

    const validationSchema = Yup.object().shape({
        utr: Yup.string()
            .required('UTR is required').length(12, 'UTR should be of 12 digits'),
    });

    const formik = useFormik({
        initialValues: {
            utr: "453525325220",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setErrorMessage(null); // Reset error message on new submit
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

                const decryptedData = await funcForDecrypt(response.data.payload);
                const dataOfParticularTransactionUTR = JSON.parse(decryptedData);

                if (dataOfParticularTransactionUTR.statusCode === 200) {
                    // Convert Buffer to Blob
                    const buffer = Buffer.from(dataOfParticularTransactionUTR.data.data);
                    const blob = new Blob([buffer], { type: 'application/pdf' });
                    setPdfBlob(blob);
                } else if (dataOfParticularTransactionUTR.statusCode === 406) {
                    setErrorMessage(dataOfParticularTransactionUTR.message);
                }
            } catch (error: any) {
                console.error("Error response:", error.response);
                if (error.response && error.response.data && error.response.data.payload) {
                    try {
                        let error1 = await funcForDecrypt(error.response.data.payload);
                        console.error("Decrypted error message:", error1);
                        setErrorMessage(JSON.parse(error1).message);
                    } catch (decryptionError) {
                        console.error("Error decrypting error message:", decryptionError);
                        setErrorMessage("An error occurred while processing your request.");
                    }
                } else {
                    console.error("Unknown error:", error);
                    setErrorMessage("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        },
    });

    const handleDownload = () => {
        mixpanel.track('Receipt downloaded');
        if (pdfBlob) {
            fileDownload(pdfBlob, 'DonationReceipt.pdf');
        }
    };

    return (
        <div className='mt-20 w-full p-4'>
            {otpModal && <OtpModal />}

            {showProfileForm && (
                <SetProfileForNewUser isOpen={showProfileForm} onClose={onClose} />
            )}
            <div className="flex  items-center justify-center h-[650px]">
                <div className="p-4 border border-yellow-200 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] rounded-md h-1/3 sm:h-1/3 w-screen sm:w-1/3 ">
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
    )
}

export default Page;
