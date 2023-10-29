import React, { useState, useEffect, useRef } from "react";
import style from "./profileDetail.module.css";
import Image from "next/image";
import axios from "axios";
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdEdit } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { AesEncrypt, AesDecrypt } from "../../components/middleware";
import Swal from "sweetalert2";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCalendarAlt } from "react-icons/fa";
import { VscVerifiedFilled } from "react-icons/vsc";
import { log } from "../logger";

const ProfileEdit = (props) => {
  // const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setshowCalendar] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [gstNumber, setGstNumber] = useState(
    props.props.userDetails.gst_number
  );
  let userGst =
    props.props.userDetails.gst_number &&
    props.props.userDetails.gst_number.length
      ? props.props.userDetails.gst_number.length
      : 0;
  const [isGstVerified, setIsGstVerified] = useState(userGst ? true : false);
  const [errorMess, setErrorMess] = useState("");
  const refOne = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  useEffect(() => {
    setProfileImage(props.props.userDetails.profile_image);
  }, [props]);

  // if(props.props.userDetails.gst_number.length > 0){
  //     setIsGstVerified(true);
  // }

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

  const initialValues = {
    name: props.props.userDetails.name,
    email: props.props.userDetails.email,
    gender: props.props.userDetails.gender,
    dateOfBirth: props.formattedDate,
    gst_number: props.props.userDetails.gst_number || "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z ]+$/, 'Special characters are not allowed.')
      .required("Name is required")
      .min(3, "Must be 3 Characters").max(25, "Must be 25 Characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth must be before today"),
    // .matches(/^([0-9]){2}[A-Z]{5}([0-9]){4}[A-Z]{1}[1-9A-Za-z]{1}Z([0-9]){1}$/, 'Invalid GST number'),
  });
  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt);
    //
    return response;
  };
  const funForAesEncrypt = async (dataToBeEncrypt) => {
    const response = await AesEncrypt(dataToBeEncrypt);
    //
    return response;
  };
  const validate = (values) => {
    if (values.gst_number.length > 0) {
      if (isGstVerified == false) {
        setErrorMess("Please verify gst");
        return false;
      }
    }
    return true;
  };
  const onSubmit = async (values, { resetForm }) => {
    if (validate(values)) {
      setIsSubmitting(true);
      try {
        const resAfterEncrypt = await AesEncrypt(values);

        const body = {
          payload: resAfterEncrypt,
        };
        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.post(
          `${process.env.baseUrl}/user/profile/details`,
          body,
          configHeaders
        );
        //
        const decryptedData = await AesDecrypt(response.data.payload);
        //
        const finalResult = JSON.parse(decryptedData);
        if (finalResult.status) {
          Swal.fire({
            position: "centre",
            icon: "success",
            title: finalResult.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        props.props.setToggle(!props.props.toggle);
        props.onHide();
      } catch (error) {
        const decryptedData = await AesDecrypt(error.response.data.payload);
        //
        const finalResult = JSON.parse(decryptedData);
        console.error(error);
        Swal.fire({
          position: "centre",
          icon: "error",
          title: "Oops...",
          text: finalResult.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleProfileImageChange = async (event) => {
    const formData = new FormData();
    formData.append("profile_image", event.target.files[0]);

    formData.append("payload", "CD46F0B542BF044C3F5CEC4AFA6AC27A");

    try {
      const token = localStorage.getItem("token");
      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.post(
        `${process.env.baseUrl}/user/profile/image`,
        formData,
        configHeaders
      );

      const decryptedData = await AesDecrypt(response.data.payload);
      const finalResult = JSON.parse(decryptedData);

      if (finalResult.status) {
        props.props.setToggle(!props.props.toggle);
      } else {
        alert("Error while uploading Profile Image");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditIconClick = () => {
    fileInputRef.current.click();
  };

  const verifyGst = async () => {
    const dataToBeDecrypt = {
      value: gstNumber,
    };

    const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt);
    //
    const payloadToSend = {
      payload: resAfterEncryptData,
    };
    const token = localStorage.getItem("token");

    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `${process.env.baseUrl}/user/kyc/gst/verify`,
        payloadToSend,
        configHeaders
      )
      .then(async (resAfterVerfiyGst) => {
        const decryptedData = await funcForDecrypt(
          resAfterVerfiyGst.data.payload
        );
        let decodedData = JSON.parse(decryptedData);
        //
        //
        if (decodedData.status) {
          setIsGstVerified(true);
          setErrorMess("");
        }
      })
      .catch(async (errInGst) => {
        const decryptedData = await funcForDecrypt(
          errInGst.response.data.payload
        );
        let response = JSON.parse(decryptedData);

        if (JSON.parse(decryptedData).code == 400) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: JSON.parse(decryptedData).message,
          });
        }
      });
  };

  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  return (
    <div>
      <div className="p-3">
        <div className={style.cross} onClick={props.onHide}>
          <IoIosClose />
        </div>

        <div className={style.profile_image}>
          <Image
            className={style.profileImage}
            src={profileImage ? profileImage : "/images/profileImage.png"}
            alt="profileImage"
            width={100}
            height={100}
          />
          <div className={`${style.edit_image} edit_image_icons`}>
            {/* <label></label> */}
            <input
              type="file"
              id="file"
              // ref={fileInputRef}
              name="profileImage"
              onChange={handleProfileImageChange}
              accept="image/*"
              style={{ color: "transparent" }}
            />
          </div>
        </div>

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
              <div className={style.user_profile}>
                <label>Name</label>
                <br />
                <input
                  name="name"
                  type="text"
                  placeholder="Enter name as per Aadhar Card"
                  value={values.name}
                  minLength={3}
                  maxLength={25}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    const updatedValue = value.replace(/[^A-Za-z\s]/g, '');
                    setFieldValue('name', updatedValue);
                  }}
                  onBlur={handleBlur}
                  disabled={props.props.userDetails.isKycDone ? true : false}
                />
                <ErrorMessage
                  name="name"
                  className="text-danger"
                  component="div"
                />
              </div>
              <div className={style.user_profile}>
                <label>Date of Birth</label>
                <br />
                <div className="calendar-input-container">
                  <input
                    name="dateOfBirth"
                    type="text"
                    placeholder="Enter Your DOB"
                    value={values.dateOfBirth}
                    // onClick={() =>
                    //   setshowCalendar((showCalendar) => !showCalendar)
                    // }
                    readOnly={props.props.userDetails.isKycDone ? true : false}
                  />
                  {!props.props.userDetails.isKycDone && (
                    <FaCalendarAlt
                      className="calendar-icon"
                      onClick={() =>
                        setshowCalendar((showCalendar) => !showCalendar)
                      }
                    />
                  )}
                  <div className={style.dobcalender} ref={refOne}>
                    {showCalendar && (
                      <Calendar
                        onChange={(date) => {
                          if (getAge(date) >= 18) {
                            log(
                              "working here : ",
                              format(date, "yyyy-MM-dd")
                            );
                            setFieldValue(
                              "dateOfBirth",
                              format(date, "yyyy-MM-dd")
                            );
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
                  name="dateOfBirth"
                  className="text-danger"
                  component="div"
                />
              </div>
              <div className={`${style.user_profile}`}>
                <label>Gender</label>
                <br />
                <select
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
              <div className={style.user_profile}>
                <label>Email</label>
                <br />
                <input
                  name="email"
                  type="text"
                  placeholder="Enter Your Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={props.props.userDetails.isEmailVerified ? true : false}
                />
                <ErrorMessage
                  name="email"
                  className="text-danger"
                  component="div"
                />
              </div>
              <div className={`${style.user_profile} ${style.gstnumber}`}>
                <label>GST Number</label>
                <br />
                <input
                  name="gst_number"
                  type="text"
                  placeholder="Enter Your GST Number"
                  value={values.gst_number}
                  onChange={(event) => {
                    setGstNumber(event.target.value);
                    setIsGstVerified(false);
                    setErrorMess("");
                    setFieldValue("gst_number", event.target.value);
                  }}
                  onBlur={handleBlur}
                />
                {gstNumber && gstNumber.length > 0 ? (
                  <>
                    {isGstVerified ? (
                      <VscVerifiedFilled className="verified-icon" />
                    ) : (
                      <div className="verified-text" onClick={verifyGst}>
                        <span>Verify</span>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
                <div>{errorMess}</div>
              </div>
              <div className={`mt-5 ${style.edit_details}`}>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Save Details
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <style>{`
            .calendar-icon{
                cursor:pointer;
            }
            .verified-text{
                margin-top:20px;
            }
            .verified-icon{
                margin-top:15px;
                color:green;
                font-size:22px;
            }

            .form-control {
                display: block;
                width: 100%;
                padding-left:10px !important;
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
                margin-bottom: 15px !important;
              }
            
              .form-control:focus {
                color: var(--bs-body-color);
                background-color: var(--bs-body-bg);
                border-color: #86b7fe;
                outline: 0;
                box-shadow: none !important;
            }
            `}</style>
    </div>
  );
};

export default ProfileEdit;
