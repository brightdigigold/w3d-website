'use client'
import FormInput from '@/components/helperFunctions'
import { useFormik } from 'formik';
import React from 'react'
import * as Yup from 'yup';

const TempleUtrCheck = () => {

    const validationSchema = Yup.object().shape({
        utr: Yup.string()
            .required('UTR is required'),
        name: Yup.string()
            .required('Name is required'),
        mobileNumber: Yup.string()
            .required('Mobile number is required')
            .matches(/^[0-9]{10}$/, 'Invalid mobile number')
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
        <div className='mt-4'>
            <form onSubmit={formik.handleSubmit} className=''>
                {/* <FormInput
                    type="text"
                    label="UTR"
                    name="utr"
                    placeholder="Enter UTR Number"
                    formik={formik}
                    autoComplete="off"
                // required
                /> */}

                <div className="w-full mt-4 flex flex-row items-center">
                    <div>
                        <label className="text-white mb-2">UPI/UTR Ref No.</label>
                        <input
                            type="text"
                            name="utr"
                            placeholder="Enter 12 Digit Ref No."
                            className="block placeholder:text-gray-500 text-white rounded-3xl bg-theme  px-6 py-2 focus:outline-none focus:bg-theme  border-1 mt-2  focus:ring-0 focus:border-b"
                        />
                    </div>
                    <div>
                        <div className='mt-6 ml-2'>
                            <button type="submit" className='bg-themeBlue rounded-3xl py-2 px-6 extrabold'>Submit</button>
                        </div>
                    </div>
                </div>

                {/* <FormInput
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
                /> */}
            </form>
        </div>
    )
}

export default TempleUtrCheck;
