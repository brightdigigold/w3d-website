import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import React, { useState } from 'react'
import style from './contact.module.css'
import Image from 'next/image'
import axios from "axios";
import Link from 'next/link'
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { AesEncrypt, AesDecrypt } from '../../components/middleware';
import Swal from "sweetalert2";
import { log } from '@/components/logger';
import CustomHead from '@/components/CustomHead'

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];

    const initialValues = {
        name: '',
        email: '',
        city: '',
        mobile: '',
        message: "",
        document:null,
    };

    const validateFile = (file) => {
        if (!allowedFileTypes.includes(file.type)) {
          return 'Only PNG, JPEG, and PDF files are allowed.';
        }
        return null;
      };
      
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .transform((value, originalValue) => {
                // Remove non-character values using regex
                if (originalValue) {
                    return originalValue.replace(/[^A-Za-z]/g, '');
                }
                return value;
            }).min(3, 'Name should be min. 3 Character').max(50, 'Name should be max. 50 Character')
            .required('Name is required'),
        email: Yup.string().trim().email("Invalid email address").matches(/\./, 'Invalid email address').required("Email is required"),
        city: Yup.string().trim().required('City is required'),
        mobile: Yup.string()
            .required("Mobile Number required")
            .matches(/^[6789][0-9]{9}$/, "Mobile No. is not valid")
            .min(10, "Please enter 10 digit mobile number")
            .max(10, "too long"),
        message: Yup.string().trim().required('Required').max(500, 'Message should be max. 500 Charcter'),
    });
    const onSubmit = async (values, { resetForm }) => {

        setIsSubmitting(true);
        try {
            log('values',values);

            const formData = new FormData();
            // Object.entries(values).forEach(([key, value]) => {
            //   formData.append(key, value);
            // });
           
            const resAfterEncrypt = await AesEncrypt(values);
            formData.append('document', values.document)
            formData.append('payload', resAfterEncrypt)
            const body = {
                "payload": resAfterEncrypt
            }
            const token = localStorage.getItem('token')
            const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            const response = await axios.post(`${process.env.baseUrl}/data/contactus`, formData, configHeaders);
            // 
            const decryptedData = await AesDecrypt(response.data.payload)
            // 
            const finalResult = JSON.parse(decryptedData)
            if (finalResult.status) {
                Swal.fire({
                    position: 'centre',
                    icon: 'success',
                    title: finalResult.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            resetForm()
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div>
            <CustomHead title="Contact us - Bright DiGi Gold"  description="Reach Us at 501, 5th Floor World Trade Centre, Babar Road, New Delhi-110001 Bright Digital Gold Pvt Ltd."/>
            <div className={style.contact_bg}>
                <div className={style.contact}>
                    <div className='container'>
                        <h1 className={style.contactUs}>Contact us</h1>
                        <div className={style.contact_desc}>
                            <div>
                                At Bright DiGi Gold, we value the opinion of our customers. Our Customer support service is here to
                                support you if you need any assistance with your account or just want to provide your valuable
                                feedback.

                            </div>
                        </div>
                        <div className='row mt-5'>
                            <div className='col-md-6  col-lg-4 col-12 text-center mb-4'>
                                <div className={style.call_us}></div>
                                <div className={style.call_us_box}>
                                    <div className='text-center'>
                                        <div className='d-flex align-items-center justify-content-center'><Image src={"/images/telephone-call.png"} height={25} width={25} alt='telephone' /></div>
                                        <div className={style.call_us_text}>Call US</div>
                                        <div className={style.call_us_telephone}><a href="tel:9289480033">+91 92894 80033</a></div>
                                    </div>
                                </div>

                            </div>
                            <div className='col-md-6 col-lg-4 col-12 text-center  mb-4'>
                                <div className={style.mail_us}></div>
                                <div className={style.call_us_box}>
                                    <div className='text-center '>
                                        <div className='d-flex align-items-center justify-content-center'><Image src={"/images/email.png"} height={25} width={25} alt='telephone' /></div>
                                        <div className={style.call_us_text}>Mail Us</div>
                                        <div className={style.call_us_telephone}><a href="mailto:support@brightdigigold.com">support@brightdigigold.com</a></div>
                                    </div>
                                </div>

                            </div>
                            <div className='col-md-12 col-lg-4 col-12 text-center  mb-4'>
                                <div className={style.reach_us}></div>
                                <div className={style.call_us_box}>
                                    <div className='text-center '>
                                        <Link target='_blank' href="https://www.google.com/maps/dir//brightdigigold/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x390cfd318e5aaaab:0xf356a848ef1c91ee?sa=X&ved=2ahUKEwi4vYjQuvL_AhWNDt4KHRZlDKcQ9Rd6BAhcEAA&ved=2ahUKEwi4vYjQuvL_AhWNDt4KHRZlDKcQ9Rd6BAhkEAU">
                                            <div className='d-flex align-items-center justify-content-center'><Image src={"/images/placeholder.png"} height={25} width={25} alt='telephone' /></div>
                                            <div className={style.call_us_text}>Reach us</div>
                                            <div className={style.call_us_telephone}>BRIGHT DIGITAL GOLD PRIVATE LIMITED<br />
                                                501, 5th Floor, World Trade Center,Babar Road, New Delhi - 110001</div>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={`${style.contact_desc} mt-4`}>
                            <div>
                                Our Team is Open to feedback and suggestions. If you wish to share your reviews with us, you are
                                most welcome to do so. We strive to continually improve and provide the best possible experience
                                for our customers.
                                <br /><br />
                                Thank you for choosing Bright DiGi Gold. We look forward to hearing from you.
                            </div>
                        </div>
                        <div className={style.contact_form}>
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                {({ values, errors, touched, setFieldValue, handleChange,setFieldError, handleBlur, handleSubmit }) => (
                                    <form className='pt-2' onSubmit={(e) => { e.preventDefault(); }}>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <label>Name</label><br />
                                                <input
                                                    name="name"
                                                    type="text"
                                                    placeholder="Enter Your Name"
                                                    value={values.name}
                                                    minLength={3}
                                                    maxLength={25}
                                                    onChange={(event) => {
                                                        const { name, value } = event.target;
                                                        const updatedValue = value.replace(/[^A-Za-z\s]/g, '');
                                                        setFieldValue('name', updatedValue);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage name="name" component="div" className="error text-danger" />
                                            </div>
                                            <div className='col-6'>
                                                <label>Email ID</label><br />
                                                <input
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter Your Email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage name="email" component="div" className="error text-danger" />
                                            </div>
                                            <div className='col-6'>
                                                <label>City</label><br />
                                                <input
                                                    name="city"
                                                    type="text"
                                                    placeholder="Enter Your City"
                                                    value={values.city}
                                                    onChange={(event) => {
                                                        const { name, value } = event.target;
                                                        const updatedValue = value.replace(/[^A-Za-z\s]/g, '');
                                                        setFieldValue('city', updatedValue);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage name="city" component="div" className="error text-danger" />
                                            </div>
                                            <div className='col-6'>
                                                <label>Mobile No.</label><br />
                                                <input
                                                    name="mobile"
                                                    type="text"
                                                    minLength={10}
                                                    maxLength={10}
                                                    placeholder="Enter Your Mobile No."
                                                    value={values.mobile}
                                                    onChange={(event) => {
                                                        const { name, value } = event.target;
                                                        const updatedValue = value.replace(/[^0-9]/g, '');
                                                        setFieldValue('mobile', updatedValue);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage name="mobile" component="div" className="error text-danger" />
                                            </div>
                                            <div className='col-12'>
                                                <label>Message</label><br />
                                                <textarea
                                                    name="message"
                                                    type="text"
                                                    placeholder="Write Here"
                                                    rows="4"
                                                    value={values.message}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage name="message" component="div" className="error text-danger" />
                                            </div>
                                            <div className='col-12'>
                                                <label>Attachment</label><br />
                                                <div className={style.fileselected}>
                                                <Field
                                                    type="file"
                                                    id="document"
                                                    className={style.document}
                                                    name="document"
                                                    title=""
                                                    value ={""}
                                                     onChange={(event) => {
                                                        const file = event.currentTarget.files[0];
                                                        const error = validateFile(file);
                                                        if (!error) {
                                                        setFieldValue('document', file);
                                                        setFieldError('document', '');
                                                        } else {
                                                        setFieldValue('document', null);
                                                        setFieldError('document', error);
                                                        }
                                                    }}
                                                />
                                                <p className={style.nofileselected}>{values.document ? values.document.name.length > 10 ? values.document.name.slice(0, 10)+'...': values.document.name : 'No file chosen'}</p>
                                                </div>
                                                <ErrorMessage name="document" component="div" className="error text-danger" />
                                            </div>
                                            <div className='col-12'>
                                                <div className={style.send}>
                                                    <button className='button' type='submit' onClick={handleSubmit} disabled={isSubmitting}>SEND</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact





