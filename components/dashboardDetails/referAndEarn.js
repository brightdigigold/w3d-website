
import React, { useState,useEffect } from 'react';
import style from './dashboardDetails.module.css'
import Image from 'next/image';
import { HiShare } from 'react-icons/hi'
import { AesEncrypt, AesDecrypt } from '../middleware';
import axios from 'axios';
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import SocialMediaShare from '../socialMediaShare';
import { log } from "../logger";

const ReferAndEarn = (props) => {
    const [show, setShow] = useState(false);
    const [url, setUrl] = useState("");
    const [userDetails, setUserDetails] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const initialValues = {
        referredUser: '',

    };
    const validationSchema = Yup.object({
        referredUser: Yup.string()
        .required("This field is required.")
        .matches(/^[6789][0-9]{9}$/, "Please enter a valid mobile number.")
        .min(10, "Please enter 10 digit mobile number")
        .max(10, "too long")

    });

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true)
        try {

            const resAfterEncrypt = await AesEncrypt(values);
            
            const body = {
                "payload": resAfterEncrypt
            }
            const token = localStorage.getItem('token')
            const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            const response = await axios.post(`${process.env.baseUrl}/user/refer/earn`, body, configHeaders);
            // 
            const decryptedData = await AesDecrypt(response.data.payload)
            const result = JSON.parse(decryptedData);
            if (result.status) {
                Swal.fire({
                    position: 'centre',
                    icon: 'success',
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            resetForm();
        } catch (error) {
            const decryptedData = await AesDecrypt(error.response.data.payload);

        const result = JSON.parse(decryptedData);
            Swal.fire({
                position: 'centre',
                icon: 'error',
                title: 'Error',
                text:result.message,
                showConfirmButton: false,
                timer: 1500,
            })
        }
    }
    useEffect(()=>{
        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders)
          .then((response) => response.json())
          .then(async (data) => {
            const decryptedData = await AesDecrypt(data.payload);
            setUserDetails(JSON.parse(decryptedData).data);
            setUrl(`Hey there! Join Bright Digi Gold using my referral code ${JSON.parse(decryptedData).data?.referralCode} and unlock exclusive perks! https://sig1e.app.link/BDG-IND`)
          });
        
    },[])

    return (
        <div>
            <SocialMediaShare show={show} url={url} onClose={() => setShow(false)} />
            <div className='container'>
                <div className={`${style.gifting_bg} mt-2`}>
                    <div className={style.gifting_data}>
                        <div className={style.gifting_left_data}>
                            <Image src={"/images/refer.svg"} height={350} width={350} alt='refer' />
                        </div>
                        <div className={style.gifting_right_data}>
                            <div className={style.referral_share}>
                                <div className={style.referral_code}>Referral code : <span style={{ fontWeight: "700" }}> {userDetails?.referralCode}</span> </div>
                                {/* <div className={style.share} onClick={() => setShow(true)}><HiShare /></div> */}
                            </div>
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                {({ values, errors, touched, setFieldValue,handleChange, handleBlur, handleSubmit }) => (
                                    <form onSubmit={(e) => { e.preventDefault(); }}>
                                        <div className={`${style.gift_money} mt-4`}>
                                            <label>Mobile No.</label><br />
                                            <input
                                                name="referredUser"
                                                type="text"
                                                minLength="10"
                                                maxLength="10"
                                                placeholder="Type here"
                                                value={values.referredUser}
                                                onChange={(event)=>{
                                                    const { name, value } = event.target;
                                                    const updatedValue = value.replace(/[^0-9]/g, '');
                                                    setFieldValue('referredUser',updatedValue);
                                                }}
                                                onBlur={handleBlur}
                                            />
                                            <ErrorMessage name="referredUser" className='text-danger' component="div" />
                                        </div>
                                        <div className={style.image_worth}>
                                            <div className={style.image_rs}>
                                                <Image src={"/images/worth.svg"} height={65} width={65} alt='worth' />
                                            </div>
                                            <div className={style.worth_text}>
                                            Friend registers using referral code. On his first transaction of Rs. 2000 both of you are rewarded with 0.01 gm of gold
                                            </div>
                                        </div>
                                        <div className={style.send_gift}>
                                            <button type="submit" onClick={handleSubmit} disabled={submitting}>REFER</button>
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

export default ReferAndEarn;
