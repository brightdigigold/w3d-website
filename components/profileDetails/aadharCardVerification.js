import React, { useState, useEffect, useRef } from 'react'
import style from './profileDetail.module.css'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { AesEncrypt, AesDecrypt } from "../middleware"
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from 'axios'
import Image from 'next/image';
import { log } from "../logger";

const AadharCardVerification = (props) => {
    
    const fileInputRef = useRef(null);
    const [frontImage, setFrontImage] = useState('');
    const [showFrontImage, setShowFrontImage] = useState(null);
    const [showBackImage, setShowBackImage] = useState(null);
    const [backImage, setBackImage] = useState('');
    const [toggle, setToggle] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [clientId, setClientId] = useState()
    const [otp, setOtp] = useState();
    const [otpError, setOtpError] = useState("");
    const [sendAadharOtp, setSendAadharOtp] = useState('1')
    const [checkingAadharStatus, setCheckingAadharStatus] = useState('')
    const [isDisabled, setIsDisabled] = useState(false);
    const [aadharData, setAadharData] = useState('');

    const funForAesEncrypt = async (dataToBeEncrypt) => {
        const response = await AesEncrypt(dataToBeEncrypt)
        return response;
    }

    const initialValues = {
        value: '',
        otp: ''
    };
    const validationSchema = Yup.object().shape({
        value:  Yup.string()
        .matches(/^\d{12}$/, 'Aadhaar number must be a 12-digit number').
        required('Please Enter Aadhar Number'), 
        otp: Yup.string(),
    });
    const handleProfileImageChange1 = (event) => {
        const file = event.target.files[0];
        if (file) {
            
            setFrontImage(file);
            setShowFrontImage(URL.createObjectURL(file))
        }
    }
    const handleProfileImageChange2 = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBackImage(file)
            setShowBackImage(URL.createObjectURL(file))
        }
    };
    function handleChangeOtp(e) {
        
        const { name, value } = e.target;
        const updatedValue = value.replace(/[^0-9]/g, '');
        setOtp(updatedValue);
        setOtpError('')
    }

    const updateUserData = ()=>{
        const token = localStorage.getItem('token')
        const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders).then(response => response.json())
        .then(async (data) => {
            if (token) {
            const decryptedData = await AesDecrypt(data.payload);
            const userdata = JSON.parse(decryptedData).data;
            setCheckingAadharStatus(userdata?.isAadhaarUploaded);
            } else {
                router.push('/')
            }
        })
    }

    const onSubmit = async (values, event) => {

        // if(!backImage && !frontImage){
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
        if (sendAadharOtp === '1') {
            try {
                let dataToBeEncryptPayload = {
                    documentType: "AADHARCARD",
                    value: values.value
                }
                const resAfterEncryptData = await funForAesEncrypt(dataToBeEncryptPayload)
                
                const payloadToSend = {
                    payload: resAfterEncryptData,
                }
                
                
                const formData = new FormData();
                formData.append("documentType", 'AADHARCARD');
                formData.append("frontImage", frontImage);
                formData.append("backImage", backImage);
                formData.append("value", values.value);
                formData.append("payload", payloadToSend.payload);
                const token = localStorage.getItem('token')
                const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                const response = await axios.post(`${process.env.baseUrl}/user/kyc/verify`, formData, configHeaders);
                
                const decryptedData = await AesDecrypt(response?.data?.payload)
                
                const clientId = JSON.parse(decryptedData).data.client_id
                
                setClientId(clientId)
                setIsDisabled(clientId)
                const finalResult = JSON.parse(decryptedData)
                if (finalResult.status) {
                    setAadharData(finalResult.data.kyc._id);
                    Swal.fire({
                        position: 'centre',
                        icon: 'success',
                        title: finalResult.message,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
                setSendAadharOtp('2')
            } catch (error) {

                const decryptedData = await AesDecrypt(error?.response?.data?.payload)
                const finalResult = JSON.parse(decryptedData)
                console.error(error);
                Swal.fire({
                    position: 'centre',
                    icon: 'error',
                    title: 'Oops...',
                    text: finalResult.message,
                    showConfirmButton: true,
                    // timer: 3000
                })
            } finally {
                setIsSubmitting(false);
            }
        } else if (sendAadharOtp == '2') {
            setIsSubmitting(true);
            try {
                if (clientId) {
                    if (otp === undefined) {
                        setOtpError("Please Fill the OTP");
                    } else {
                        
                        const data = {
                            kyc_id:aadharData,
                            otp: otp,
                            client_id: clientId,
                        };
                        
                        const resAfterEncrypt = await AesEncrypt(data);
                        
                        const body = {
                            "payload": resAfterEncrypt
                        }
                        const token1 = localStorage.getItem('token')
                        const configHeaders1 = { headers: { authorization: `Bearer ${token1}`, 'Content-Type': 'application/json' } }
                        const responseAfterGettingOtp = await axios.post(`${process.env.baseUrl}/user/kyc/otp/verify`, body, configHeaders1);
                        // 
                        const decryptedDataAfterGettingOtp = await AesDecrypt(responseAfterGettingOtp?.data?.payload)
                        
                        const result = JSON.parse(decryptedDataAfterGettingOtp);
                        const finalResult = result
                        log('finalResult',finalResult);
                        if (finalResult.status) {
                            updateUserData();
                            // setCheckingAadharStatus(true);
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
                    }
                }
            } catch (error) {
                const decryptedDataAfterGettingOtp = await AesDecrypt(error?.response?.data?.payload)
                const result = JSON.parse(decryptedDataAfterGettingOtp);
                Swal.fire({
                    position: 'centre',
                    icon: 'error',
                    title: result.message,
                    showConfirmButton: false,
                    timer: 3000
                })
                setOtp("");
                setOtpError("")
            } finally {
                setIsSubmitting(false);
            }
        }


    };
    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        log("props?.props?.userDetails : ",props?.props?.userDetails);
        if(!props?.props?.userDetails.isAadhaarUploaded){
            log("working in undefined : ");
            setCheckingAadharStatus(false);
        } else {
            setCheckingAadharStatus(props?.props?.userDetails?.isAadhaarUploaded)
        }
        
    }, [])

    return (
        <div>

            <div className='p-3'>
                <div className={style.verification_bg}>
                    <div className={style.verification} onClick={() => setToggle(!toggle)}>
                        <div className={style.aadhar} >Aadhar Card Verification</div>
                        <div className={style.notification_arrow}>
                            {!checkingAadharStatus ?
                                <div className={style.notification}>1</div> : ""}
                            <div className={style.arrow} >
                                {!toggle ? <IoIosArrowDown onClick={() => setToggle(true)} /> : <IoIosArrowUp onClick={() => setToggle(false)} />}
                            </div>
                        </div>

                    </div>

                    {toggle &&
                        (
                            <>
                                {
                                !checkingAadharStatus && 
                                    <>
                                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                            {({ values, errors, touched, handleChange,setFieldValue, handleBlur, handleSubmit }) => (
                                                <form onSubmit={(e) => { e.preventDefault(); }}>
                                                    <div className={style.user_kyc}>
                                                        <label>Aadhar Card Number</label><br />
                                                        <input
                                                            name="value"
                                                            disabled={isDisabled} 
                                                            placeholder="Enter Your Aadhar Number"
                                                            value={values.value}
                                                            onChange={(event)=>{
                                                                const { name, value } = event.target;
                                                                const updatedValue = value.replace(/[^0-9]/g, '');
                                                                setFieldValue("value", updatedValue);
                                                            }}
                                                            onBlur={handleBlur}
                                                        />
                                                        <ErrorMessage name="value" className='text-danger' component="div" />
                                                    </div>
                                                    
                                                    {/* <div className={style.aadharCard}>
                                                        <div className={`${style.aadhar_card_upload_text} aadhar_card_upload`}>
                                                            <label onClick={handleEditIconClick}>Aadhar Front</label>

                                                            {showFrontImage ? (
                                                                <>
                                                                    <div style={{ maxHeight: "230px", maxWidth: "230px" }}>
                                                                        <Image src={showFrontImage} height={230} width={230} alt='aadhar_front' />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <input type='file' id="file"
                                                                        ref={fileInputRef}
                                                                        name="frontImage"
                                                                        onChange={handleProfileImageChange1}
                                                                        accept="image/*" style={{ color: 'transparent' }} />
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className={`${style.aadhar_card_upload_text} aadhar_card_upload`}>
                                                            <label onClick={handleEditIconClick}>Aadhar Back </label>
                                                            {showBackImage ? (
                                                                <>
                                                                    <div style={{ maxHeight: "230px", maxWidth: "230px" }}>
                                                                        <Image src={showBackImage} height={230} width={230} alt='aadhar_back' />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <input type='file' id="file"
                                                                        ref={fileInputRef}
                                                                        name="frontImage"
                                                                        onChange={handleProfileImageChange2}
                                                                        accept="image/*" style={{ color: 'transparent' }} />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div> */}
                                                    {clientId &&
                                                        <div className={style.user_kyc}>
                                                            <label  >Type OTP Sent on registered mobile number</label><br />
                                                            <input
                                                                name="otp"
                                                                type="text"
                                                                placeholder="Enter OTP"
                                                                onChange={handleChangeOtp}
                                                                value={otp}
                                                            />
                                                            <span className='text-danger' component="div" >{otpError}</span>
                                                        </div>

                                                    }
                                                    <div className={style.verify}>
                                                        <button type="submit" onClick={handleSubmit} disabled={isSubmitting}>Verify</button>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                    </>
                                }
                                 {checkingAadharStatus &&
                                    <>
                                        <div className={style.details}>
                                            <h1>Aadhar Verification has been completed</h1>
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

export default AadharCardVerification
