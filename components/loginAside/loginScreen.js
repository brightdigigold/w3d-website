import style from './loginAside.module.css'
import Swal from "sweetalert2";
import axios from "axios";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { IoIosArrowBack } from "react-icons/io"
import { AesEncrypt, AesDecrypt } from '../middleware';
import Link from 'next/link';
import { log } from "../logger";


const LoginScreen = (props) => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [sendMissCallNumber,setSendMissCallNumber]=useState()
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const initialValues = {
        mobile_number: "",
        termsAndConditions: false,
    };
    const validationSchema = Yup.object({
        termsAndConditions: Yup.boolean().oneOf([true], 'Terms and conditions are Required'),
        mobile_number: Yup.string()
            .required("Required")
            .matches(/^[6789][0-9]{9}$/, "Mobile No. is not valid")
            .matches(phoneRegex, "Invalid Number, Kindly enter valid number")
            .min(10, "Please enter 10 digit mobile number")
            .max(10, "too long"),
    });
const gotoTermsConditions = () =>{
    router.push('/termsAndConditions')
    props.onHide();
}
    const onSubmit = async (values,) => {
        try {
            setSubmitting(true);
            if (values.buttonType == 'OtpLogin') {
                // 
                Notiflix.Loading.custom({svgSize:'180px',customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>'});
                const resAfterEncrypt = await AesEncrypt(values);
                // 
                const body = {
                    "payload": resAfterEncrypt
                }
                const header = {
                    "Content-Type": "application/json",
                    onUploadProgress: Notiflix.Loading.circle(),
                }
                const result = await axios.post(`${process.env.baseUrl}/auth/send/otp`, body, header);
                // 
                const decryptedData = await AesDecrypt(result.data.payload)
                // 
                if (JSON.parse(decryptedData).status) {
                    Notiflix.Loading.remove();
                    // 
                    localStorage.setItem("mobile_number", values.mobile_number);
                    props.setToggle(1);
                }
                setSubmitting(false);
            } else {
                Notiflix.Loading.remove();
                log('values',values);
                props.setToggle(3)
                props.updateData(values)
                setSubmitting(false);    
            }

        }
        catch (error) {
            Notiflix.Loading.remove();
           log(error)
        }
    }
    return (
        <div className='maincomponent'>
            <div className={style.arrow_back} onClick={props.onHide}><IoIosArrowBack /></div>
            <div className={style.align_login_data}>
                <div className={style.login_signup}>Login/Sign Up</div>
                <div className={style.login_to_start}>Log in to start <span className={style.investing}>INVESTING</span> </div>
                <div className={style.login_form}>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({ values, errors, touched,setFieldValue, handleChange, handleBlur, handleSubmit }) => (
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                <div className={style.user_mobile_no}>
                                    <label>Mobile Number</label><br />
                                    <input
                                        name="mobile_number"
                                        type="text"
                                        minLength="10"
                                        maxLength="10"
                                        placeholder="Enter Your Number"
                                        onChange={(event)=>{
                                            // 
                                            const { name, value } = event.target;
                                            const updatedValue = value.replace(/[^0-9]/g, '');
                                            setFieldValue('mobile_number',updatedValue);
                                        }}
                                        onBlur={handleBlur}
                                        value={values.mobile_number}
                                    />
                                    {touched.mobile_number && errors.mobile_number ? (
                                        <div
                                            style={{
                                                color: "#ab0000",
                                                marginLeft: 5,
                                                fontWeight: 'bold',
                                                marginTop: 8,
                                                fontSize: 15,
                                            }}
                                        >
                                            {errors.mobile_number}
                                        </div>
                                    ) : null}
                                </div>
                                <div className={style.terms_conditions}>
                                    <input
                                        id="termsAndConditions" type="checkbox"
                                        name="termsAndConditions"
                                        checked={values.termsAndConditions}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <label for="termsAndConditions" className={style.terms_conditions_text}> I agree to these <span onClick={gotoTermsConditions}><Link href="#">Terms and Conditions</Link></span></label>
                                </div>
                                {touched.termsAndConditions && errors.termsAndConditions ? (<div style={{
                                    color: "black",
                                    marginLeft: 4,
                                    fontWeight: 'bold',
                                    marginTop: 0,
                                    fontSize: 10,
                                    color: '#ab0000'
                                }}>{errors.termsAndConditions}</div>) : null}
                                <div className={style.send_otp}>
                                    <button type="submit" onClick={() => { values.buttonType = "OtpLogin"; }} disabled={submitting}>SEND OTP</button>
                                </div>
                                <div className={style.or}>
                                    <div className={style.left_line}></div>
                                    <div className={style.or_text}>Or</div>
                                    <div className={style.right_line}></div>
                                </div>
                                <div className={style.give_miscall}>
                                    <button type="submit" onClick={() => { values.buttonType = "missCallLogin"; }} disabled={submitting}>Give a missed call</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>

            </div>
            {/* <div className={style.align_login_data}>
                    <div className={style.enter_otp}>Enter OTP</div>
                    <div className={style.send_otp_text}>We’ve sent it to +91-987654321<BiPencil /> </div>
                    <div className={style.login_form}>
                        <div className={style.user_mobile_no}>
                            <div className={style.otp_box}>
                                <input type="text" maxLength={1} />
                                <input type="text" maxLength={1} />
                                <input type="text" maxLength={1} />
                                <input type="text" maxLength={1} />
                                <input type="text" maxLength={1} />
                                <input type="text" maxLength={1} />
                            </div>
                        </div>
                        <div className={style.terms_conditions}>
                           
                            <label for="checkbox" className={style.terms_conditions_text}> <a href="#" style={{ marginRight: "4px" }}>Resend OTP </a>in 14 sec</label>
                        </div>
                        <div className={style.send_otp}>
                            <button type="submit">VERIFY</button>
                        </div>
                        <div className={style.or}>
                            <div className={style.left_line}></div>
                            <div className={style.or_text}>Or</div>
                            <div className={style.right_line}></div>
                        </div>
                        <div className={style.give_miscall}>
                            <button type="submit">Give a missed call</button>
                        </div>

                    </div>
                </div>

                <div><h1>C</h1></div>
                <button type='submit'>Submit</button> */}


            {/* <style>{`
        .aside {
          position: fixed;
          top: 0;
          right: -450px;
          width: 450px;
          height: 100vh;
          background: linear-gradient(0.69deg, #154C6D 0.62%, #12242E 101.27%);
          border-radius: 8px 0px 0px 8px;
          z-index: 1000;
          transition: right 0.3s ease-out !important;
      }

      .aside.show {
        right: 0;
      }

            `}</style> */}
        </div>
    )
}

export default LoginScreen
