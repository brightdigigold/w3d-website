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
import { BiPencil } from "react-icons/bi"
import { AesEncrypt, AesDecrypt } from '../middleware';
import { useDispatch } from "react-redux";
import { logInUser, doShowLoginAside, profileFilled } from "../../store/index";
import { log } from "../logger";


const MiscallPopup = (props) => {
    
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const SendMissCallLog = async () => {
        
        try {
            setSubmitting(true);
            Notiflix.Loading.init({ svgColor: "rgba(241,230,230,0.985)" });
            const data={
                mobile_number: props.updateData.mobile_number
            }
            const resAfterEncrypt = await AesEncrypt(data);
            
            const body = {
                "payload": resAfterEncrypt
            }
            const header = {
                "Content-Type": "application/json"
            }
            const result = await axios.post(`${process.env.baseUrl}/auth/missed/call/status`, body, header);
            
            const decryptedData = await AesDecrypt(result.data.payload)
            
            const response = JSON.parse(decryptedData);
            
            if (response.data.isNewUser == false) {
                Notiflix.Loading.remove();
                localStorage.setItem("token", response?.data?.otpVarifiedToken);
                localStorage.setItem("isLogIn", true)
                dispatch(doShowLoginAside(false));
                dispatch(logInUser(true));
                dispatch(profileFilled(true));
                if (props.redirectData) {
                    props.redirectData({ redirect: "handleClick", data: "SELL" });
                  }
                props.setToggle(0);
                props.onHide();
                Swal.fire({
                    position: 'centre',
                    icon: 'success',
                    title: response.message,
                    showConfirmButton: false,
                    timer: 1500
                })
         
            }
            else  {
                Notiflix.Loading.remove();
                localStorage.setItem("token", response?.data?.otpVarifiedToken);
                props.setToggle(2)
            }
        }


        catch (error) {
            Notiflix.Loading.remove();
            log('error',error);
            
            const decryptedData = await AesDecrypt(error.response.data.payload)
            const response = JSON.parse(decryptedData);
            Swal.fire({
                position: 'centre',
                icon: 'error',
                title: response.message,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    const gotoLoginScreen = ()=>{
        props.setToggle(0)
    }
    return (
        <div className='maincomponent'>
            <div className={style.arrow_back} onClick={gotoLoginScreen}><IoIosArrowBack /></div>
            <div className={style.align_login_data}>
                <div className={style.login_signup}>Login/Sign Up</div>
                <div className={style.login_to_start}>Log in to start <span className={style.investing}>INVESTING</span> </div>
                <div className={style.give_miscall_text}>Give a Missed Call</div>
                <div className={style.give_miscall_number}>You have to give a missed call to<br /> +91-9953188449</div>
                <div className={style.give_miscall}>
                    <button type="submit" onClick={SendMissCallLog} >Proceed</button>
                </div>
            </div>
            <style>{`
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

            `}</style>
        </div>
    )
}

export default MiscallPopup
