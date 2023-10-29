import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import styles from '../components/sellAndBuy/sellAndBuy.module.css'
import { AesDecrypt, AesEncrypt } from "../components/middleware";
import CountDown from "./countdown";
import Notiflix from "notiflix";
import { log } from "../components/logger";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import OTPInput from "react-otp-input";
import style from "../components/loginAside/loginAside.module.css";

const GiftModal = (props) => {
  const [otp, setOtp] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [otpError, setOtpError] = useState("");
  const countDownTime = [0, 2, 0];
  const [[hours, minutes, seconds], setTimer] = useState(countDownTime);
  const [disabledBtn, setDisabledBtn] = useState(true);

  function handleChange(otp) {
    setOtp(otp);
  }

  const reset = () => {
    log('User Request Coming here');
    setDisabledBtn(false);
    //setTimer(countDownTime);
  };

  const handleSubmit = () =>{
    props.onSubmitVerify(otp)
  }
 const closeTheModal = () => {
    props.reset();
    props.onHide();
  };

  return (
 
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop={false}
 
    >
      <div className="coupons_modal">
        <Modal.Body>
        <div className="maincomponent">

      <div className={style.align_login_data}>
        <div className={style.enter_otp}>Enter OTP</div>
        {/* <div className={style.send_otp_text}>
          We’ve sent it to +91-{showMobileNumber}
          <BiPencil className={style.pencil_edit} onClick={editMobileNumber} />{" "}
        </div> */}
        <form onSubmit={handleSubmit}>
          <div className={style.login_form}>
            <div className={style.user_mobile_no}>
              <div className={style.otp_box}>
                <OTPInput
                  name="mobile"
                  onChange={handleChange}
                  value={otp}
                  inputStyle="inputStyle"
                  inputType="tel"
                  shouldAutoFocus={true}
                  numInputs={6}
                  isInputNum={true}
                  separator={<span></span>}
                  renderInput={(props) => <input type="tel" {...props} />}
                />
              </div>
            </div>
            <span
              style={{
                display: "flex",
                position: "absolute",
                marginTop: 38,
                fontWeight: "bold",
                color: "#ab0000",
                fontSize: 13,
              }}
            >
              {otpError}
            </span>
            <div className={`${style.send_otp}  w-50 m-auto`}>
              <button type="submit" >
                VERIFY
              </button>
            </div>
            
          </div>
        </form>
      </div>
      
    </div>
        </Modal.Body>
        <style>{`
        .modal-content{
          background: linear-gradient(0.69deg, #154C6D 0.62%, #12242E 101.27%);
        }
        .resend{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0px;
        }

            `}</style>
      </div>
    </Modal>
  
  );
};

export default GiftModal;
