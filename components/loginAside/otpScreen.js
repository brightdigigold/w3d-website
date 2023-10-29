import style from "./loginAside.module.css";
import OTPInput from "react-otp-input";
import Swal from "sweetalert2";
import axios from "axios";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosArrowBack } from "react-icons/io";
import { BiPencil } from "react-icons/bi";
import { AesEncrypt, AesDecrypt } from "../middleware";
import CountDown from "../countdown";
import { useDispatch } from "react-redux";
import { logInUser, doShowLoginAside, profileFilled } from "../../store/index";
import { log } from "../logger";

const OTPScreen = (props) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [showMobileNumber, setShowMobileNumber] = useState();
  const router = useRouter();
  const countDownTime = [0, 2, 0];
  const [[hours, minutes, seconds], setTimer] = useState(countDownTime);
  const [disabledBtn, setDisabledBtn] = useState(true);

  function handleChange(otp) {
    setOtp(otp);
  }

  const handleSubmit = async (e) => {
    const mobile_number = localStorage.getItem("mobile_number");
    setShowMobileNumber(mobile_number);
    if (otp === undefined) {
      setOtpError("Please Fill the OTP");
    } else {
      const data = {
        mobile_number: localStorage.getItem("mobile_number"),
        otp: otp,
        skipMobileNumber: false,
      };

      e.preventDefault();
      try {
        setSubmitting(true);
        const resAfterEncrypt = await AesEncrypt(data);

        const body = {
          payload: resAfterEncrypt,
        };
        const header = {
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          `${process.env.baseUrl}/auth/verify/otp`,
          body,
          header
        );
        //
        const decryptedData = await AesDecrypt(response.data.payload);

        const result = JSON.parse(decryptedData);
        log("🚀 ~ file: otpScreen.js:63 ~ handleSubmit ~ result:", result)

        if (result.status == true) {
          if (result.data.isNewUser == false) {
            localStorage.setItem("token", result?.data?.otpVarifiedToken);
            localStorage.setItem("isLogIn", true);
            dispatch(doShowLoginAside(false));
            dispatch(logInUser(true));
            dispatch(profileFilled(true));
            if (props.redirectData) {
              props.redirectData({ redirect: "handleClick", data: "SELL" });
            }
            props.setToggle(0);
            props.onHide();
            log("result?.data : ", result?.data);

            // const configHeaders = {
            //     headers: {
            //       authorization: `Bearer ${result?.data.}`,
            //       "Content-Type": "application/json",
            //     },
            //   };
            // fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders)
            //   .then((response) => response.json())
            //   .then(async (data) => {
            //     // log("isUserProfileFilled in data : ", data);
            //     const decryptedData = await AesDecrypt(data.payload);
            //     const userdata = JSON.parse(decryptedData).data;
            //     log("userdata : ", userdata);
            //     if (userdata.isBasicDetailsCompleted == false) {
            //       log("doooooooo");
            //       dispatch(doShowLoginAside(true));
            //     } else {
            //       dispatch(profileFilled(true));
            //     }
            //   })
            //   .catch((errorWhileCheckingIsUserNew) => {
            //     log(
            //       "errorWhileCheckingIsUserNew : ",
            //       errorWhileCheckingIsUserNew
            //     );
            //   });
            // dispatch(profileFilled(true));

            // props.onHide();
          } else {
            localStorage.setItem("token", result?.data?.otpVarifiedToken);
            props.setToggle(2);
          }
        } else {
          setOtp("");
          log("🚀 ~ file: otpScreen.js:112 ~ handleSubmit ~ setOtp:", setOtp)
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.message,
          });
        }
        setSubmitting(false);
      } catch (error) {
        log('asdasd');
        const decryptedData = await AesDecrypt(error?.response?.data?.payload);
        const result = JSON.parse(decryptedData);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
        });
        setOtp("");
        setOtpError("");
      }
    }
  };

  const resendOtp = async (values) => {
    log('disabled', disabledBtn);
    if (!disabledBtn) {
      setDisabledBtn(true);
      setTimeout(() => {
        setDisabledBtn(false);
      }, 2 * 60 * 1000);

      try {
        const data = {
          mobile_number: localStorage.getItem("mobile_number"),
        };

        Notiflix.Loading.init({ svgColor: "rgba(241,230,230,0.985)" });

        const resAfterEncrypt = await AesEncrypt(data);
        //
        const body = {
          payload: resAfterEncrypt,
        };
        const header = {
          "Content-Type": "application/json",
          onUploadProgress: Notiflix.Loading.circle(),
        };
        const result = await axios.post(
          `${process.env.baseUrl}/auth/send/otp`,
          body,
          header
        );

        const decryptedData = await AesDecrypt(result.data.payload);

        if (JSON.parse(decryptedData).status) {
          Notiflix.Loading.remove();
          props.setToggle(1);
        }
      } catch (error) {
        const decryptedData = await AesDecrypt(result.data.payload);
        Swal.fire({
          position: "centre",
          icon: "error",
          title: JSON.parse(decryptedData).message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };
  const reset = () => {
    log('User Request Coming here');
    setDisabledBtn(false);
    //setTimer(countDownTime);
  };

  const editMobileNumber = () => {
    props.setToggle(0);
  };

  const closeSidebar = () => {
    props.setToggle(0);
    props.onHide();
  };

  const miscallPopup = () => {
    Notiflix.Loading.init({ svgColor: "rgba(241,230,230,0.985)" });
    props.setToggle(3);
    props.updateData({ mobile_number: localStorage.getItem("mobile_number") })
  };

  useEffect(() => {
    const mobile_number = localStorage.getItem("mobile_number");
    setShowMobileNumber(mobile_number);
    // Clear the timer and enable the button when the component unmounts
    return () => {
      clearTimeout();
      // setDisabled(false);
    };
  }, []);
  return (
    <div className="maincomponent">
      <div className={style.arrow_back} onClick={closeSidebar}>
        <IoIosArrowBack />
      </div>
      <div className={style.align_login_data}>
        <div className={style.enter_otp}>Enter OTP</div>
        <div className={style.send_otp_text}>
          We’ve sent it to +91-{showMobileNumber}
          <BiPencil className={style.pencil_edit} onClick={editMobileNumber} />{" "}
        </div>
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
            <div className={`${style.terms_conditions} resend`}>
              {/* <input id="checkbox" type="checkbox" /> */}
              <label for="checkbox" className={style.terms_conditions_text}>
                <a
                  style={{
                    opacity: disabledBtn ? "0.5" : "1",
                    marginRight: "4px",
                    cursor:"  pointer",
                  }}
                  onClick={resendOtp}
                >
                  Resend OTP{" "}
                </a>
                {disabledBtn &&
                  <>
                    in {" "}
                    <CountDown
                      timer={[hours, minutes, seconds]}
                      onRestart={reset}
                    />{" "}
                    sec
                  </>}
              </label>
            </div>
            <div className={style.send_otp}>
              <button type="submit" >
                VERIFY
              </button>
            </div>
            <div className={style.or}>
              <div className={style.left_line}></div>
              <div className={style.or_text}>Or</div>
              <div className={style.right_line}></div>
            </div>
            <div className={style.give_miscall}>
              <button type="button"  onClick={miscallPopup} disabled={submitting}>
                Give a missed call
              </button>
            </div>
          </div>
        </form>
      </div>
      <style>{`
        .resend{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0px;
        }

            `}</style>
    </div>
  );
};

export default OTPScreen;
