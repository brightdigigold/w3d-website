'use client'
import { useFormik } from 'formik';
import React from 'react'
import * as Yup from 'yup';

const TempleUtrCheck = () => {

    const validationSchema = Yup.object().shape({
        utr: Yup.string()
            .required('UTR is required')
            .length(12, 'UTR must be exactly 12 digits')
    });

    const formik = useFormik({
        initialValues: {
            utr: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // Handle form submission
            console.log(values);
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
                            <div className="text-red-500 mt-1">{formik.errors.utr}</div>
                        )}
                    </div>

                    <div className=''>
                        <button type="submit" className='bg-themeBlue rounded-3xl py-2 px-4 extrabold'>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TempleUtrCheck;
