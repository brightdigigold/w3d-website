import React, { useState, useEffect } from 'react'
import style from './profileDetail.module.css'
import Notiflix from "notiflix";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import axios from "axios";
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { AesEncrypt, AesDecrypt } from '../../components/middleware';
import Swal from "sweetalert2";
import { log } from "../logger";

const BankVerification = (props) => {
    log('props in BankVerification', props);
    const [toggle, setToggle] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bankList, setBankList] = useState([])
    const [bankName, setBankName] = useState()
    const [otherBankName, setOtherBankName] = useState(false);
    const [ifscCode, setIfscCode] = useState()
    const [accountName, setAccountName] = useState()
    const [accountNumber, setAccountNumber] = useState()
    const [checkingBankStatus, setCheckingBankStatus] = useState('')
    const funcForDecrypt = async (dataToBeDecrypt) => {
        const response = await AesDecrypt(dataToBeDecrypt)
        return response;
    }
    const KycData = async () => {
        // 
        if(props?.props?.bankDetails){
            const decryptedBankName = await funcForDecrypt(props?.props?.bankDetails?.bankName);
            const decryptedIfscCode = await funcForDecrypt(props?.props?.bankDetails?.ifsc);
            const decryptedAccountName = await funcForDecrypt(props?.props?.bankDetails?.accountName);
            const decryptedAccountNumber = await funcForDecrypt(props?.props?.bankDetails?.accountNumber);
            setBankName(decryptedBankName)
            setIfscCode(decryptedIfscCode)
            setAccountName(decryptedAccountName)
            setAccountNumber(decryptedAccountNumber)
        }
        // 
    }

    const fetchAllBankName = async() =>{

        fetch(`${process.env.baseUrl}/public/bank/list`, { headers: { 'Content-Type': 'application/json' } }).then(response => response.json())
        .then(async (data) => {
            const decryptedData = await funcForDecrypt(data.payload);
            let decryptedDataList = JSON.parse(decryptedData).data
            setBankList(decryptedDataList);
        })
        .catch(error => console.error(error));

    }

    useEffect(() => {
        fetchAllBankName();
        KycData()
        setCheckingBankStatus(props?.props?.userDetails?.isBankDetailsCompleted)
    }, [])

    const initialValues = {
        bankName: bankName,
        accountName: accountName,
        accountNumber: accountNumber,
        ifsc: ifscCode,
        isDefault:1
    }
    const validationSchema = Yup.object().shape({
        bankName: Yup.string().required('Bank Name is required').matches(/^[a-zA-Z\s]+$/, 'Invalid Bank Name'),
        accountName: Yup.string().required('Account Holder Name is required').min(3, 'Name must be at least 3 characters').max(50, 'Name cannot exceed 50 characters').matches(/^[a-zA-Z0-9\s]+$/, 'Invalid Account Holder Name'),
        accountNumber: Yup.string().required('Account Number is required').min(9, 'Account Number must be at least 9 characters').max(18, 'Account Number cannot exceed 18 characters'),
        ifsc: Yup.string().required('IFSC Number is required').min(11, 'IFSC code must be at least 11 characters').max(11, 'IFSC code cannot exceed 11 characters').matches(/^[a-zA-Z0-9]+$/, 'Invalid IFSC code'),
    });
    const onSubmit = async (values, { resetForm }) => {
        // 
        setIsSubmitting(true);
        try {
            Notiflix.Loading.custom({svgSize:'180px',customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>'});
            const resAfterEncrypt = await AesEncrypt(values);
            // 
            const body = {
                "payload": resAfterEncrypt
            }
            const token = localStorage.getItem('token')
            const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' , onUploadProgress: Notiflix.Loading.circle(),} }
            const response = await axios.post(`${process.env.baseUrl}/user/bank/account`, body, configHeaders);
            // 
            const decryptedData = await AesDecrypt(response.data.payload)
            // 
            const finalResult = JSON.parse(decryptedData)
            if (finalResult.status) {
                setCheckingBankStatus(true);
                Notiflix.Loading.remove();
                Swal.fire({
                    position: 'centre',
                    icon: 'success',
                    title: finalResult.message,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            props.setToggle(!props.toggle);
            setToggle(false)

        } catch (error) {
            Notiflix.Loading.remove();
            const decryptedData = await AesDecrypt(error.response.data.payload)
            // 
            const finalResult = JSON.parse(decryptedData)
            console.error(error);
            Swal.fire({
                position: 'centre',
                icon: 'error',
                title: finalResult.message,
                showConfirmButton: false,
                timer: 3000
            })
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div>
            <div className='p-3' >
                <div className={style.verification_bg}>
                    <div className={style.verification} onClick={() => setToggle(!toggle)}>
                        <div className={style.aadhar}>Bank Verification</div>
                        <div className={style.notification_arrow}>
                            {/* {!checkingBankStatus ?
                                <div className={style.notification}>1</div> : ""} */}
                            <div className={style.arrow} >
                                {!toggle ? <IoIosArrowDown onClick={() => setToggle(true)} /> : <IoIosArrowUp onClick={() => setToggle(false)} />}
                            </div>
                        </div>
                    </div>
                    {toggle &&
                        (
                            <>
                                {/* {!checkingBankStatus ? (
                                    <> */}
                                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                            {({ values, errors, touched, setFieldValue,handleChange, handleBlur, handleSubmit }) => (
                                                <form onSubmit={(e) => { e.preventDefault(); }}>
                                                    <div className={style.user_kyc}>
                                                        <label >Bank Name</label><br />
                                                        <select name="bankName" value={bankName} onChange={(data)=>{
                                                            log('data',data.target.value);
                                                                setFieldValue('bankName',data.target.value);
                                                                if(data.target.value == 'Others'){
                                                                    setOtherBankName(true);
                                                                }else{
                                                                    setOtherBankName(false);
                                                                }
                                                             
                                                        }} onBlur={handleBlur}>
                                                            <option value="" selected disabled>Select Bank Name</option>
                                                        {bankList.map((item, key) => {

                                                            return (<>
                                                                <option key={item._id} value={item.name}>{item.name}</option>
                                                            </>)
                                                            })};
                                                        </select>
                                                        {!otherBankName && <ErrorMessage name="bankName" className='text-danger' component="div" /> }
                                                    </div>
                                                    {otherBankName && (
                                                        <div className={style.user_kyc}>
                                                        <label >Bank Name</label><br />
                                                        <input
                                                            name="bankName"
                                                            type="text"
                                                            placeholder="Enter Bank Name"
                                                            value={values.bankName}
                                                            onChange={(event)=>{
                                                                const { name, value } = event.target;
                                                                const updatedValue = value.replace(/[^a-zA-Z\s]/g, '');
                                                                setFieldValue("bankName", updatedValue);
                                                            }}
                                                            onBlur={handleBlur}
                                                        />
                                                        <ErrorMessage name="bankName" className='text-danger' component="div" />
                                                    </div>
                                                    )}
                                                    <div className={style.user_kyc}>
                                                        <label >Account Holder’s Name</label><br />
                                                        <input
                                                            name="accountName"
                                                            type="text"
                                                            placeholder="Enter Your Name"
                                                            maxLength={50}
                                                            value={values.accountName}
                                                            onChange={(event)=>{
                                                                const { name, value } = event.target;
                                                                const updatedValue = value.replace(/[^a-zA-Z\s]/g, '');
                                                                setFieldValue("accountName", updatedValue);
                                                            }}
                                                            onBlur={handleBlur}
                                                        />
                                                        <ErrorMessage name="accountName" className='text-danger' component="div" />
                                                    </div>
                                                    <div className={style.user_kyc}>
                                                        <label >Account Number</label><br />
                                                        <input
                                                            name="accountNumber"
                                                            type="text"
                                                            placeholder="Enter Your Account Number"
                                                            maxLength={18}
                                                            value={values.accountNumber}
                                                            onChange={(event)=>{
                                                                const { name, value } = event.target;
                                                                const updatedValue = value.replace(/[^0-9]/g, '');
                                                                setFieldValue("accountNumber", updatedValue);
                                                            }}
                                                            onBlur={handleBlur}
                                                        />
                                                        <ErrorMessage name="accountNumber" className='text-danger' component="div" />
                                                    </div>
                                                    <div className={style.user_kyc}>
                                                        <label >IFSC</label><br />
                                                        <input
                                                            name="ifsc"
                                                            type="text"
                                                            placeholder="Enter Your IFSC Code"
                                                            value={values.ifsc}
                                                            maxLength={11}
                                                            onChange={(event)=>{
                                                                const { name, value } = event.target;
                                                                const updatedValue = value.replace(/[^a-zA-Z0-9]/g, '');
                                                                setFieldValue("ifsc", updatedValue);
                                                            }}
                                                            onBlur={handleBlur}
                                                            style={{ textTransform: "uppercase" }}
                                                        />
                                                        <ErrorMessage name="ifsc" className='text-danger' component="div" />
                                                    </div>

                                                    <div className={style.verify}>
                                                        <button type="submit" onClick={handleSubmit} disabled={isSubmitting}>Verify</button>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                    {/* </>
                                ) : (
                                    <>
                                        <div className={style.details}>
                                            <h1>Bank Details Completed</h1>
                                        </div>
                                    </>
                                )} */}

                            </>
                        )}
                </div>
            </div>
        </div>

    )
}

export default BankVerification
