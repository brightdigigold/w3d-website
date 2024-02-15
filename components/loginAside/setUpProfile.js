import style from "./loginAside.module.css";
import OTPInput from "react-otp-input";
import Swal from "sweetalert2";
import axios from "axios";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoIosArrowBack } from "react-icons/io";
import { BiPencil } from "react-icons/bi";
import { AesEncrypt, AesDecrypt } from "../middleware";
import { FaCalendarAlt } from "react-icons/fa";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useDispatch } from "react-redux";
import { log } from "../logger";
import { profileFilled, doShowLoginAside, logInUser } from "../../store/index";

const SetUpProfile = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDate, setShowDate] = useState(null);
  const [showCalendar, setshowCalendar] = useState(false);
  const [ageError, setAgeError] = useState("");
  const refOne = useRef(null);
  //
  const initialValues = {
    mobile_number: localStorage.getItem("mobile_number"),
    name: "",
    dob: "",
    email: "",
    gender: "",
    referCode: "",
    termsAndConditions: false,
    mobileVerified: true,
  };
  const validationSchema = Yup.object({
    name: Yup.string().matches(/^[a-zA-Z ]+$/, 'Special characters are not allowed.')
      .required("Name is required"),
    dob: Yup.string().required("DOB is required"),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string()
      .email("Invalid email address").matches(/\./, 'Invalid email address')
      .required("Email is required"),
    termsAndConditions: Yup.boolean().oneOf(
      [true],
      "Terms and conditions are required"
    ),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      props.setToggle(0);
    }
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  });

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    //
    if (e.key === "Escape") {
      setshowCalendar(false);
    }
  };

  // Hide on outside click
  const hideOnClickOutside = (e) => {
    //
    //
    if (refOne.current && !refOne.current.contains(e.target)) {
      setshowCalendar(false);
    }
  };
  const handleDateChange = (dateStr) => {
    setShowDate(dateStr);
    var date = new Date(dateStr),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const formattedDate = [date.getFullYear(), month, day].join("-");

    setSelectedDate(formattedDate);
  };
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    Notiflix.Loading.init({ svgColor: "rgba(241,230,230,0.985)" });

    const dataToBeEncrypted = {
      mobile_number: values.mobile_number,
      name: values.name,
      email: values.email,
      gender: values.gender,
      dateOfBirth: values.dob,
      mobileVerified: "true",
    };

    try {
      const resAfterEncrypt = await AesEncrypt(dataToBeEncrypted);
      // const formData = new FormData()
      // formData.append('payload', resAfterEncrypt)
      const token = localStorage.getItem("token");

      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          onUploadProgress: Notiflix.Loading.circle(),
        },
      };
      const body = {
        payload: resAfterEncrypt,
      };
      const result = await axios.post(
        `${process.env.baseUrl}/auth/signup`,
        body,
        configHeaders
      );

      const decryptedData = await AesDecrypt(result.data.payload);
      const finalResult = JSON.parse(decryptedData);

      if (finalResult.status == true) {
        dispatch(logInUser(true));
        dispatch(profileFilled(true));
        dispatch(doShowLoginAside(false));
        props.setToggle(0);
        Swal.fire({
          position: "centre",
          icon: "success",
          title: finalResult.message,
          showConfirmButton: false,
          timer: 1500,
        });
        props.onHide();
      } else {
        Swal.fire({
          position: "centre",
          icon: "error",
          title: finalResult.message,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      let decryptedData = await AesDecrypt(error.response.data.payload);
      let finalResult = JSON.parse(decryptedData);
      Swal.fire({
        position: "centre",
        icon: "error",
        title: finalResult.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsSubmitting(false);
      Notiflix.Loading.remove();
    }
  };

  // const decryptedData = await AesDecrypt(result.data.payload);
  // const finalResult = JSON.parse(decryptedData);

  //   if (finalResult.status == true) {
  //     dispatch(logInUser(true));
  //     dispatch(profileFilled(true));
  //     dispatch(doShowLoginAside(false));
  //     props.setToggle(0);
  //     Notiflix.Loading.remove();
  //     Swal.fire({
  //       position: "centre",
  //       icon: "success",
  //       title: finalResult.message,
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     props.onHide();
  //   } else {
  //     Swal.fire({
  //       position: "centre",
  //       icon: "error",
  //       title: finalResult.message,
  //       showConfirmButton: false,
  //     });
  //   }

  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  return (
    <div className="maincomponent">
      {/* <div className={style.arrow_back} onClick={onHide}><IoIosArrowBack /></div> */}
      <div className={style.align_login_data}>
        <div className={style.enter_otp}>Set Up Your Profile</div>
        <div className={style.login_form}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className={style.user_mobile_no}>
                  <label>Name</label>
                  <br />
                  <input
                    name="name"
                    type="text"
                    minLength={3}
                    maxLength={25}
                    placeholder="Enter name as per Aadhar Card"
                    onChange={(event) => {
                      const { name, value } = event.target;
                      const updatedValue = value.replace(/[^A-Za-z\s]/g, '');
                      setFieldValue('name', updatedValue);
                    }}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error text-danger"
                  />
                </div>
                <div className={style.user_mobile_no}>
                  <label>Date of Birth</label>
                  <br />
                  <div className="calendar-input-container">
                    <input
                      name="dob"
                      type="text"
                      placeholder="Enter Your DOB"
                      value={values.dob}
                      minLength={3}
                      readOnly="true"
                      onClick={() => setshowCalendar(!showCalendar)}
                    />
                    <FaCalendarAlt
                      className="calendar-icon"
                      onClick={() => setshowCalendar(!showCalendar)}
                    />
                    <div className={style.dobcalender} ref={refOne}>
                      {showCalendar && (
                        <Calendar
                          onChange={(date) => {
                            if (getAge(date) >= 18) {
                              setFieldValue("dob", format(date, "yyyy-MM-dd"));
                              setshowCalendar(false);
                              setAgeError("");
                            } else {
                              setshowCalendar(false);
                              setAgeError("must be 18 or above to register");
                            }
                          }}
                          value={values.dateOfBirth}
                        />
                      )}
                    </div>
                  </div>
                  <div>{ageError}</div>
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="error text-danger"
                  />
                </div>

                <div className={`${style.user_mobile_no}`}>
                  <label>Gender</label>
                  <br />
                  <select
                    id="myDropdown"
                    name="gender"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    value={values.gender}
                  >
                    <option Value="">Select Gender</option>
                    <option Value="male">Male</option>
                    <option Value="female">Female</option>
                    <option Value="other">Other</option>
                  </select>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="error text-danger"
                  />
                </div>

                <div className={style.user_mobile_no}>
                  <label>E-mail</label>
                  <br />
                  <input
                    name="email"
                    type="text"
                    placeholder="Enter your E-mail Address."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error text-danger"
                  />
                </div>

                {/* <div className={style.user_mobile_no}>
                  <label>Referral Code</label>
                  <br />
                  <input
                    name="referCode"
                    type="text"
                    placeholder="Enter your Refer code."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.referCode}
                  />
                </div> */}
                <div className={style.terms_conditions}>
                  <input
                    id="checkbox"
                    type="checkbox"
                    name="termsAndConditions"
                    checked={values.termsAndConditions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label className={style.terms_conditions_text}>
                    I am at least 18 years old and agree to the following terms
                    <br />
                  </label>
                </div>
                <ErrorMessage
                  name="termsAndConditions"
                  component="div"
                  className="error text-danger"
                />
                <div className={style.terms_conditions_text_profile}>
                  By tapping continue. I’ve read and agree to the E-Sign
                  Disclosure and Consent to receive all the communications
                  electronically.
                </div>
                <div className={style.send_otp}>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    CONTINUE
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <style>{`

.form-control {
    display: block;
    width: 100%;
  
    font-size: 12px !important;
    font-weight: 400;
    line-height: 2 !important;
    color: white !important;
    background-color: rgba(44, 123, 172, 0.2) !important;
    background-clip: padding-box;
    border: none !important;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 4px !important;
    transition: none !important;
    background: rgba(44, 123, 172, 0.2);
    margin-top:5px;
  }

  .form-control:focus {
    color: var(--bs-body-color);
    background-color: #0b4263 !important;
    border-color: transparent !important;
    outline: 0;
    box-shadow: none !important;
}

// select option {
//   background: #0b4263 !important;
// }
      
      `}</style>
    </div>
  );
};

export default SetUpProfile;
