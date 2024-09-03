"use client";
import { AesDecrypt, AesEncrypt } from "@/components/helperFunctions";
import { setShowOTPmodal, setPurpose } from "@/redux/authSlice";
import axios, { AxiosRequestConfig } from "axios";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Notiflix from "notiflix";
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { HiOutlineUser, HiOutlineHome } from 'react-icons/hi';
import { UserIcon } from "@heroicons/react/20/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import { FaBuilding } from 'react-icons/fa';
import clsx from "clsx";

interface LoginAsideProps {
  isOpen: boolean;
  onClose: () => any;
  purpose: string;
}

const LoginAside = ({ isOpen, onClose, purpose }: LoginAsideProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const [submitting, setSubmitting] = useState(false);
  const [personalOrCorporate, setPersonalOrCorporate] = useState<"personal" | "corporate" | null>(null);
  console.log("personalOrCorporate", personalOrCorporate)
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const toggleBodyScroll = (shouldLock: boolean) => {
      document.body.style.overflow = shouldLock ? 'hidden' : 'auto';
    };

    toggleBodyScroll(isOpen);
    return () => toggleBodyScroll(false);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, onClose]);

  const handleTermsClick = () => {
    router.push("/term-and-conditions")
    onClose();
  };

  const initialValues = {
    mobile_number: "",
    termsAndConditions: false,
    buttonType: "",
  };

  const validationSchema = Yup.object({
    // termsAndConditions: Yup.boolean().oneOf(
    //   [true],
    //   "Terms and conditions are Required"
    // ),

    termsAndConditions: purpose === 'login' ? Yup.boolean()
      .oneOf([true], "Terms and conditions are required") : Yup.boolean(),
    mobile_number: Yup.string()
      .required("Mobile number is required")
      .matches(/^[6789][0-9]{9}$/, "Mobile No. is not valid")
      .matches(phoneRegex, "Invalid Number, Kindly enter a valid number")
      .min(10, "Please enter a 10-digit mobile number")
      .max(10, "Too long"),
  });

  const onSubmit = async (values: any) => {
    values.buttonType = "OtpLogin"
    try {
      setSubmitting(true);
      if (values.buttonType == "OtpLogin") {
        const resAfterEncrypt = await AesEncrypt(values);
        const body = {
          payload: resAfterEncrypt,
        };
        const header: AxiosRequestConfig = {
          headers: {
            "Content-Type": "application/json",
          },
          onUploadProgress: () => {
            Notiflix.Loading.circle();
          },
        };
        const result = await axios.post(
          `${process.env.baseUrl}/auth/send/otp`,
          body,
          header
        );
        const decryptedData = await AesDecrypt(result.data.payload);
        if (JSON.parse(decryptedData).status) {
          localStorage.setItem("mobile_number", values.mobile_number);
          dispatch(setPurpose(purpose));
          dispatch(setShowOTPmodal(true));
        }
        setSubmitting(false);
        Notiflix.Loading.remove();
        onClose();
      } else {
        setSubmitting(false);
        Notiflix.Loading.remove();
      }
    } catch (error) {
      // Handle error
      // alert(error);
      setSubmitting(false);
      Notiflix.Loading.remove();
    }
  };

  return (
    <div ref={modalRef} className={`modal-class ${isOpen ? 'open-class' : ''}`}>
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-4/12 md:w-7/12 sm:w-8/12 loginGrad shadow-lg transform overflow-y-scroll translate-x-${isOpen ? "0" : "full"
          } transition-transform ease-in-out z-50`}
        style={{ zIndex: 1000 }}
      >
        <div className="grid h-screen place-items-center w-full">
          <div className="w-full px-6">
            <button
              onClick={onClose}
              className="absolute top-3 end-2.5 text-white hover:text-gold01 text-xl cursor-pointer "
            >
              <FaTimes size={28} className="text-themeBlueLight p-0.5 border-1 rounded-full hover:text-red-400 transition-colors duration-300 ease-out " />
            </button>
            <div className=" text-center text-white pb-4">
              <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgLogo.png" className="h-20 mx-auto mb-6" />
              <p className=" text-2xl mb-2">Start Savings Today</p>
              <p className="">
                Safe.Secure.Certified
                <img src="/secure.png" className="ml-1 inline-block h-5" />
              </p>
            </div>
            {purpose === 'login' ? <> <h1 className="text-2xl bold mb-0 text-white text-left">
              Login/Sign Up
            </h1>
              <h3 className="text-md mb-4 text-white text-left">
                Login to start
                <span className="text-yellow-400 ml-1">SAVINGS</span>
              </h3></> : null}
            <div className="">
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
                      handleSubmit();
                    }}
                  >
                    <div className="flex items-center mt-12 gap-4">
                      <div onClick={() => { setPersonalOrCorporate("personal") }} className="cursor-pointer">
                        <UserIcon className={clsx('h-9 w-9 mx-auto', `${personalOrCorporate == "personal" ? "text-yellow-400" : "text-white"}`)} />
                        <div className={clsx('text-center poppins-medium py-2 tracking-wide', `${personalOrCorporate == "personal" ? "text-yellow-400" : "text-white"}`)}>PERSONAL</div>
                      </div>
                      <div onClick={() => { setPersonalOrCorporate("corporate") }} className="cursor-pointer">
                        <FaBuilding size={30} color={`${personalOrCorporate == "corporate" ? "#FACC15" : "#fff"}`} className={clsx('mx-auto', `${personalOrCorporate == "corporate" ? "yellow" : "white"}`)} />
                        <div className={clsx('text-center poppins-medium tracking-wide px-4 mt-2', `${personalOrCorporate == "corporate" ? "text-yellow-400" : "text-white"}`)}>CORPORATE</div>
                      </div>
                    </div>
                    {/* <p className="text-red-600 text-md bold">Please Select Personal or Corporate</p> */}
                    <div className="mt-2">
                      <label className="text-white mb-2">Mobile Number</label>
                      <br />
                      <input
                        name="mobile_number"
                        className="text-gray-100  tracking-widest placeholder:text-gray-500 semibold border-1 rounded mt-2 w-full p-2 coins_backgroun outline-none user-select-none focus:bg-transparent focus:outline-none"
                        type="numeric"
                        inputMode="numeric"
                        minLength={10}
                        maxLength={10}
                        placeholder="Enter Mobile Number"
                        onChange={(event) => {
                          const { name, value } = event.target;
                          const updatedValue = value.replace(/[^0-9]/g, "");
                          setFieldValue("mobile_number", updatedValue);
                        }}
                        onBlur={handleBlur}
                        value={values.mobile_number}
                      />
                      {touched.mobile_number && errors.mobile_number ? (
                        <div
                          style={{
                            color: "#ab0000",
                            marginLeft: 5,
                            fontWeight: "bold",
                            marginTop: 8,
                            fontSize: 15,
                          }}
                        >
                          {errors.mobile_number}
                        </div>
                      ) : null}
                    </div>
                    <div className="items-center mt-20 mb-2 flex">
                      {purpose === "login" ? <input
                        className="cursor-pointer placeholder:text-gray-500 w-4 h-5 text-theme coins_background  rounded-lg focus:outline-none "
                        id="termsAndConditions"
                        type="checkbox"
                        name="termsAndConditions"
                        checked={values.termsAndConditions}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      /> : null}
                      {purpose === "login" ? <div className="ml-2 items-center text-white">
                        I agree to these
                        <span>
                          <button
                            type="button"
                            onClick={handleTermsClick}
                            className="text-yellow-400 underline pl-2"
                          >
                            T & C
                          </button>
                        </span>
                      </div> : null}
                    </div>
                    {touched.termsAndConditions && errors.termsAndConditions ? (
                      <div
                        style={{
                          color: "black",
                          marginLeft: 4,
                          fontWeight: "bold",
                          marginTop: 0,
                        }}
                      >
                        <span className="text-red-600 text-md bold">
                          {errors.termsAndConditions}
                        </span>
                      </div>
                    ) : null}
                    <div className="">
                      <button
                        type="submit"
                        className="bg-themeBlue px-2 py-2 rounded-full w-full mt-2 mb-2 extrabold"
                        onClick={() => {
                          values.buttonType = "OtpLogin";
                        }}
                        disabled={submitting}
                      >
                        SEND OTP
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAside;
