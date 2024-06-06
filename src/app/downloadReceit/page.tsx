'use client'
import FormInput from '@/components/helperFunctions'
import { useFormik } from 'formik';
import React from 'react'
import * as Yup from 'yup';

const Page = () => {
    const validationSchema = Yup.object().shape({
        utr: Yup.string()
            .required('UTR is required'),
        name: Yup.string()
            .required('Name is required'),
        mobileNumber: Yup.string()
            .required('Mobile number is required')
            .matches(/^[0-9]{10}$/, 'Invalid mobile number') // Validate mobile number format
    });

    const formik = useFormik({
        initialValues: {
            utr: "",
            name: "",
            mobileNumber: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // Handle form submission
            console.log(values);
        },
    });

    return (
        <div className='mt-20 w-full p-4'>
            <form onSubmit={formik.handleSubmit}>
                <FormInput
                    type="text"
                    label="UTR"
                    name="utr"
                    placeholder="Enter UTR Number"
                    formik={formik}
                    autoComplete="off"
                    // required
                />
                
                <FormInput
                    type="text"
                    label="Name"
                    name="name"
                    formik={formik}
                    autoComplete="off"
                    // required
                />
                
                <FormInput
                    type="number"
                    label="Mobile Number"
                    name="mobileNumber"
                    formik={formik}
                    autoComplete="off"
                />
                
                <div className='my-4'>
                    <button type="submit" className='bg-themeBlue rounded-lg py-2 px-6 extrabold'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Page;
