'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput, { AesEncrypt, funcForDecrypt } from '@/components/helperFunctions';
import SetProfileForNewUser from '@/components/setProfile';
import { setShowProfileForm } from '@/redux/authSlice';
import { RootState } from '@/redux/store';

const Page = () => {
    const showProfileForm = useSelector((state: RootState) => state.auth.showProfileForm);
    const dispatch = useDispatch();

    const onClose = () => {
        dispatch(setShowProfileForm(false));
    };

    const validationSchema = Yup.object().shape({
        utr: Yup.string()
            .required('UTR is required'),
        // name: Yup.string()
        //     .required('Name is required'),
        // mobileNumber: Yup.string()
        //     .required('Mobile number is required')
        //     .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    });

    const formik = useFormik({
        initialValues: {
            utr: "",
            // name: "",
            // mobileNumber: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // Handle form submission
            console.log(values);

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
                console.log("dataOfParticularTransactionUTR", dataOfParticularTransactionUTR);
            } catch (error) {
                console.error("errordata", error);
            }
        },
    });

    return (
        <div className='mt-20 w-full p-4'>
            {showProfileForm && (
                <SetProfileForNewUser isOpen={showProfileForm} onClose={onClose} />
            )}
            <form onSubmit={formik.handleSubmit}>
                <FormInput
                    type="text"
                    label="UPI/UTR Ref/Txn No."
                    name="utr"
                    placeholder="Enter UTR Number"
                    formik={formik}
                    autoComplete="off"
                />

                <FormInput
                    type="text"
                    label="Name"
                    name="name"
                    formik={formik}
                    autoComplete="off"
                />

                <FormInput
                    type="number"
                    label="Mobile Number"
                    name="mobileNumber"
                    formik={formik}
                    autoComplete="off"
                />

                <div className='my-4 items-center'>
                    <button type="submit" className='bg-themeBlue rounded-3xl py-2 px-6 extrabold'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Page;
