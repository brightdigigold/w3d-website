import React, { useState, useEffect, useRef } from 'react'
import style from './profileDetail.module.css'
import Image from 'next/image';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { AesEncrypt, AesDecrypt } from "../middleware"
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from 'axios'
import { log } from "../logger";

const PanCardVerification = (props) => {
    
    const fileInputRef = useRef(null);
    const [showPanCardImage, setShowPanCardImage] = useState('');
    const [panCardImage, setPanCardImage] = useState('');
    const [toggle, setToggle] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [checkingPanStatus, setCheckingPanStatus] = useState('')
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }
    const funForAesEncrypt = async (dataToBeEncrypt) => {
        const response = await AesEncrypt(dataToBeEncrypt)
        return response;
    }

    const initialValues = {
        pancard_number: '',
    };
    const validationSchema = Yup.object().shape({
        pancard_number: Yup.string().min(3, 'Pancard Number must be at least 1 characters').max(50, 'Pancard Number cannot exceed 16 characters').matches(/^[a-zA-Z0-9]+$/, 'Invalid Pancard Number')
        // .matches(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, 'Invalid PAN card number')
        .required('Please Enter PAN card number'),

    });
    // const handlePanCardImage = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         setShowPanCardImage(URL.createObjectURL(file));
    //         setPanCardImage(file)
    //     }
    // }
    const onSubmit = async (values, event) => {
        // if(!panCardImage){
        //     Swal.fire({
        //         position: 'centre',
        //         icon: 'error',
        //         title: 'Oops...',
        //         text: 'Please select image',
        //         showConfirmButton: false,
        //         timer: 1500
        //     })
        //     return;
        // }
        
        setIsSubmitting(true);
        try {
            let dataToBeEncryptPayload = {
                documentType: "PANCARD",
                value: values.pancard_number.toUpperCase()
            }
            const resAfterEncryptData = await funForAesEncrypt(dataToBeEncryptPayload)
            
            const payloadToSend = {
                payload: resAfterEncryptData,
            }
            const formData = new FormData();
            formData.append("documentType", 'PANCARD');
            // formData.append("frontImage", panCardImage);
            formData.append("value", values.pancard_number);
            formData.append("payload", payloadToSend.payload);
            
            const token = localStorage.getItem('token')
            const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            const response = await axios.post(`${process.env.baseUrl}/user/kyc/verify`, formData, configHeaders);
            
            const decryptedData = await AesDecrypt(response.data.payload)
            
            const finalResult = JSON.parse(decryptedData)
            if (finalResult.status) {
                // setCheckingPanStatus(true);
                updateUserData();
                Swal.fire({
                    position: 'centre',
                    icon: 'success',
                    title: finalResult.message,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            setToggle(false)
            props.props.setToggle(!props.props.toggle);
        } catch (error) {
            console.error(error);
            const decryptedData = await AesDecrypt(error.response.data.payload)
            const finalResult = JSON.parse(decryptedData)
            Swal.fire({
                position: 'centre',
                icon: 'error',
                title: 'Oops...',
                text: finalResult.message,
                showConfirmButton: false,
                timer: 3000
            })
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    const updateUserData = ()=>{
        const token = localStorage.getItem('token')
        const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders).then(response => response.json())
        .then(async (data) => {
            if (token) {
            const decryptedData = await funcForDecrypt(data.payload);
            const userdata = JSON.parse(decryptedData).data;
                setCheckingPanStatus(userdata?.isPanUploaded);
            } else {
                router.push('/')
            }
        })
    }
    useEffect(() => {
        log('updated data',props?.props?.userDetails);
        if(!props?.props?.userDetails?.isPanUploaded){
            log("working in undefined : ");
            setCheckingPanStatus(false);
        } else {
            setCheckingPanStatus(props?.props?.userDetails?.isPanUploaded)
        }
    }, [])
    return (
        <div>
            <div className='p-3' >
                <div className={style.verification_bg}>
                    <div className={style.verification} onClick={() => setToggle(!toggle)}>
                        <div className={style.aadhar}>Pan Card Verification</div>
                        <div className={style.notification_arrow}>
                            {!checkingPanStatus &&
                                <div className={style.notification}>1</div>}
                            <div className={style.arrow} >
                                {!toggle ? <IoIosArrowDown onClick={() => setToggle(true)} /> : <IoIosArrowUp onClick={() => setToggle(false)} />}
                            </div>
                        </div>
                    </div>
                    {toggle &&
                        (
                            <>
                                { !checkingPanStatus &&
                                    <>
                                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                            {({ values, errors, touched, handleChange,setFieldValue, handleBlur, handleSubmit }) => (
                                                <form onSubmit={(e) => { e.preventDefault(); }}>
                                                    <div className={style.user_kyc}>
                                                        <label >PAN Card Number</label><br />
                                                        <input
                                                            name="pancard_number"
                                                            type="text"
                                                            placeholder="Enter Your PanCard No."
                                                            value={values.pancard_number}
                                                            onChange={(event)=>{
                                                                const { name, value } = event.target;
                                                                const updatedValue = value.replace(/[^a-zA-Z0-9]/g, '');
                                                                setFieldValue("pancard_number", updatedValue);
                                                            }}
                                                            onBlur={handleBlur}
                                                        />
                                                        <ErrorMessage name="pancard_number" className='text-danger' component="div" />
                                                    </div>
                                                    <div className={style.aadharCard}>
                                                        {/* <div className={`${style.aadhar_card_upload_text} aadhar_card_upload`}>
                                                            <label onClick={handleEditIconClick}>Pan Front</label>
                                                            {showPanCardImage ? (
                                                                <>
                                                                <Image src={showPanCardImage} height={250} width={250} alt='PanCardImage'/>
                                                                </>

                                                            ) : (
                                                                <>
                                                                    <input type='file' id="file"
                                                                        ref={fileInputRef}
                                                                        name="frontImage"
                                                                        onChange={handlePanCardImage}
                                                                        accept="image/*" style={{ color: 'transparent' }} />
                                                                </>
                                                            )}
                                                        </div> */}
                                                        {/* <div className={`${style.aadhar_card_upload_text} aadhar_card_upload`}>
                                            <label>Aadhar Back </label>
                                            <input type="file" id="file" name="aadharBack" accept="image/*" style={{ color: 'transparent' }} />
                                        </div> */}
                                                    </div>
                                                    <div className={style.verify}>
                                                        <button type="submit" onClick={handleSubmit} disabled={isSubmitting}>Verify</button>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                    </>
                                }
                                {  checkingPanStatus &&
                                    <>
                                        <div className={style.details}>
                                            <h1>PAN KYC has been Completed</h1>
                                        </div>
                                    </>
                                }

                            </>
                        )}
                </div>
            </div>
        </div>

    )
}

export default PanCardVerification
