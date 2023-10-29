import React, { useEffect, useState,useRef } from 'react'
import style from './profileDetail.module.css'
import Image from 'next/image'
import { IoIosClose } from "react-icons/io"
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { MdEdit } from 'react-icons/md'
import { AesEncrypt, AesDecrypt } from '../../components/middleware';
import Swal from "sweetalert2";
import axios from 'axios';
import { log } from "../logger";

const AddressEdit = (props) => {
    // 
    const formikRef = useRef();
    const [state, setState] = useState([])
    let address;
    if(props?.editAddressId?.address?.pincode.length == 6){
        address = true
    }else{
        address = false
    }
    const [delivered, setDelivered] = useState(address)
    const [commonError,setCommonError] = useState([]);
    const id = props.editAddressId._id
    
    
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchPincode = async (pincode)=>{
        setCommonError('')
        if(pincode.length == 6){
            try{
                log('pincode2',pincode);
                const token = localStorage.getItem("token");
                const configHeaders = { headers: {  authorization: `Bearer ${token}`,'Content-Type': 'application/json' } }
                const response = await axios.get(`${process.env.baseUrl}/user/ecom/pincode/${pincode}`, configHeaders);
                const decryptedData = await AesDecrypt(response.data.payload)
                const finalResult = JSON.parse(decryptedData)
                if(finalResult.data.length > 0){

                    log('city',finalResult.data[0]['city'])
                    log('state',finalResult.data[0]['state'])
                    formikRef.current.setFieldValue('city', finalResult.data[0]['city']);
                    formikRef.current.setFieldValue('state', finalResult.data[0]['state']);
                    setCommonError('')
                    setDelivered(true);
                    setIsSubmitting(false);
                }else{
                    formikRef.current.setFieldValue('city','');
                    formikRef.current.setFieldValue('state','');
                    setCommonError('Sorry, We do not provide service on this pincode')
                    setDelivered(false);
                }
                log('fetchpincode',finalResult.data);
            }catch(error){
                
            }
        }
    }

    useEffect(() => {
        fetch(`${process.env.baseUrl}/public/state/list`, { headers: { 'content-type': "application/json" } }).then(response => response.json())
            .then(async (data) => {
                const decryptedData = await AesDecrypt(data.payload);
                
                const stateList = JSON.parse(decryptedData).data;
                setState(stateList)
            }).catch(error => console.error(error));

    }, [])
    const initialValues = {
        line1: props?.editAddressId?.address?.line1,
        line2: props?.editAddressId?.address?.line2,
        city: props?.editAddressId?.address?.city,
        state: props?.editAddressId?.address?.state,
        pincode: props?.editAddressId?.address?.pincode,
        id: props.editAddressId._id
    };
    const validationSchema = Yup.object().shape({
        line1: Yup.string().required('Required'),
        line2: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        pincode: Yup.string().matches(/^\d{6}$/, "PinCode is not valid")
        .required('Required'),
    });
    const onSubmit = async (values, { resetForm }) => {
        
        setIsSubmitting(true);
        if(delivered){
            setCommonError('')
        try {
            const resAfterEncrypt = await AesEncrypt(values);
            
            const body = {
                "payload": resAfterEncrypt
            }
            const token = localStorage.getItem('token')
            const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            const response = await axios.post(`${process.env.baseUrl}/user/address/update`, body, configHeaders);
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
            props?.props?.setToggle(!props?.props?.toggle);
            props?.setIsShow('');

        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }else{
        setCommonError('Sorry, We do not provide service on this pincode')
    }
    };
    const closeEditForm = () => {
        
        props.setIsShow('');
    }
    return (
        <div>
            <div className='p-2'>
                <div className={style.cross} onClick={closeEditForm}><IoIosClose /></div>
                <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ values, errors, touched, handleChange, handleBlur,setFieldValue, handleSubmit }) => (
                        <form className='pt-2' onSubmit={(e) => { e.preventDefault(); }}>
                            <div className={style.user_kyc}>
                                <label >Address Line 1</label><br />
                                <input
                                    name="line1"
                                    type="text"
                                    placeholder="Enter Your Address"
                                    value={values.line1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                 <ErrorMessage name="line1"  component="div" className="error text-danger" />
                            </div>
                            <div className={style.user_kyc}>
                                <label >Address Line 2</label><br />
                                <input
                                    name="line2"
                                    type="text"
                                    placeholder="Enter Your Address"
                                    value={values.line2}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                 <ErrorMessage name="line2" component="div" className="error text-danger" />
                            </div>

                            <div className={style.user_kyc}>
                                <label >PIN Code</label><br />
                                <input
                                    name="pincode"
                                    type="tel"
                                    placeholder="Enter Your Pin Code"
                                    value={values.pincode}
                                    maxLength={6}
                                    onChange={(event)=>{
                                        setDelivered(false);
                                        const { name, value } = event.target;
                                        const updatedValue = value.replace(/[^0-9]/g, '');
                                         fetchPincode(updatedValue);
                                        setFieldValue("pincode", updatedValue);
                                    }}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="pincode" component="div" className="error text-danger" />
                                {commonError && <div className='text-danger'>{commonError}</div>}
                            </div>
                            <div className={style.user_kyc}>
                                <label >City</label><br />
                                <input
                                    name="city"
                                    type="text"
                                    placeholder="Enter Your City Name"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                 <ErrorMessage name="city" component="div" className="error text-danger" />
                            </div>
                            <div className={style.user_kyc}>
                                <label >State</label><br />
                                <select name="state" id="state_id" value={values.state} onChange={handleChange}
                                    onBlur={handleBlur}>
                                    <option value=''>Please choose an option</option>
                                    {state.map((item, key) => {
                                        return (<>
                                            <option key={item._id} value={item.name}>{item.name}</option>
                                        </>)
                                    })}
                                    {/* <option value="uttar pradesh">Uttar Pradesh</option>
                            <option value="uttarakhand">Uttarakhand</option>  */}
                                </select>
                                <ErrorMessage name="state" component="div" className="error text-danger" />
                            </div>
                            <div className={`mt-5 ${style.edit_details}`}>
                                <button type="submit" onClick={handleSubmit} disabled={isSubmitting} >Save Details</button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default AddressEdit
