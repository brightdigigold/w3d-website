"use client";
import { setShowOTPmodal, setPurpose, setOtpMsg, SetUserType, setCorporateBusinessDetails, setAuthenticationMode } from "@/redux/authSlice";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Notiflix from "notiflix";
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { UserIcon } from "@heroicons/react/20/solid";
import { FaBuilding } from 'react-icons/fa';
import clsx from "clsx";
import { postMethodHelperWithEncryption } from "@/api/postMethodHelper";
import CustomButton from "../customButton";
import { RootState } from "@/redux/store";
import useDetectMobileOS from "@/hooks/useDetectMobileOS";
interface LoginAsideProps {
  isOpen: boolean;
  onClose: () => any;
}

const LoginAside = ({ isOpen, onClose }: LoginAsideProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const os = useDetectMobileOS();
  const modalRef = useRef<HTMLDivElement>(null);
  const userType = useSelector((state: RootState) => state.auth.UserType);
  const purpose = useSelector((state: RootState) => state.auth.purpose);
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const [corporateLoginOrSignUp, setCorporateLoginOrSignUp] = useState<"corporateLogin" | "corporateSignUp" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errString = "You already have account on this number as a corporate please login!"

  useEffect(() => {
    dispatch(setAuthenticationMode('personalLogin'));
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
    gstNumber: "",
    termsAndConditions: false,
    type: "user",
    country_iso: '91',
    isCountryIsoRequired: false,
    mode: "",
  };

  const validationSchema = Yup.object({
    termsAndConditions: purpose === 'login' ? Yup.boolean().oneOf([true], "Terms and conditions are required") : Yup.string(),

    type: Yup.string().required("Please select Personal or Corporate"),

    mobile_number: (userType === "corporate" && corporateLoginOrSignUp === 'corporateLogin') || (userType === "user")
      ? Yup.string()
        .required("Mobile number is required")
        .matches(/^[6789][0-9]{9}$/, "Mobile No. is not valid")
        .matches(phoneRegex, "Invalid Number, Kindly enter a valid number")
        .min(10, "Please enter a 10-digit mobile number")
        .max(10, "Too long")
      : Yup.string(),

    gstNumber: (userType === 'corporate' && corporateLoginOrSignUp === 'corporateSignUp')
      ? Yup.string()
        .required("GST number is required")
        .min(15, 'GST number must be of 15 characters')
        .max(15, "GST number cannot be more than 15 characters")
        .matches(/^[a-zA-Z0-9]*$/, "GST number can only contain letters and numbers")
      : Yup.string()
  });


  const onSubmit = async (values: any) => {
    dispatch(SetUserType(values.type));

    const updatedValues = {
      ...values,
      mode: userType === 'user' ? 'login' : corporateLoginOrSignUp === "corporateLogin" ? "login" : "signup",
    };


    const apiEndPoint = userType === 'user' ? "auth/send/otp" : corporateLoginOrSignUp !== 'corporateSignUp' ? "auth/send/otp" : "auth/gst/send/otp"
    try {
      setSubmitting(true);
      // Notiflix.Loading.circle();
      const result = await postMethodHelperWithEncryption(
        `${process.env.baseUrl}/${apiEndPoint}`,
        updatedValues,
        // {
        //   onUploadProgress: () => Notiflix.Loading.circle(),
        // }
      );

      if (!result.isError && result.data.status) {
        localStorage.setItem("mobile_number", values.mobile_number);
        dispatch(setPurpose(purpose));
        if (corporateLoginOrSignUp !== null) {
          dispatch(setAuthenticationMode(corporateLoginOrSignUp));
        }
        if (corporateLoginOrSignUp === "corporateSignUp") {
          dispatch(setCorporateBusinessDetails(result.data.data));
        }
        dispatch(setShowOTPmodal(true));
        dispatch(setOtpMsg(result.data.message));
        setSubmitting(false);
        onClose();
      } else if (result.isError) {
        // Handle error case
        setError(result?.errorMsg)
        // Notiflix.Report.failure('Error', result?.errorMsg || 'An unexpected error occurred.', 'OK');
      }
    } catch (error) {
      // This block may not be needed unless you want to handle non-Axios errors
      Notiflix.Report.failure('Error', 'Something went wrong!', 'OK');
      setSubmitting(false);
    } finally {
      setSubmitting(false);
      Notiflix.Loading.remove();
    }
  };


  return (
    <div ref={modalRef} className={`modal-class ${isOpen ? 'open-class' : ''}`}>
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-4/12 md:w-7/12 sm:w-8/12 loginGrad shadow-lg transform translate-x-${isOpen ? "0" : "full"
          } transition-transform ease-in-out z-50`}
        style={{ zIndex: 1000 }}
      >
        <div className="grid h-screen  w-full">
          <div className="w-full">
            <button
              onClick={() => {
                onClose();
                dispatch(SetUserType(''));
              }}
              className="absolute top-3 end-2.5 text-white hover:text-gold01 text-xl cursor-pointer "
            >
              <FaTimes size={28} className="text-themeBlueLight hover:text-red-500 border-1 rounded-full p-1 transition-colors duration-300 ease-in-out" />
            </button>
            {os === "iOS" ? <div className=" text-center text-white pb-1">
              <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgLogo.png" className="h-12 mx-auto mt-6 md:mt-8" />
              <p className=" text-xl mb-1 mt-4 md:mt-4">Start Savings Today</p>
              <p className="">
                Safe.Secure.Certified
                <img src="/secure.png" className="ml-1 inline-block h-5" />
              </p>
            </div> :
              <div className=" text-center text-white pb-1">
                <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgLogo.png" className="h-20 sm:h-12 mx-auto mt-10 sm:mt-6 md:mt-8" />
                <p className="text-2xl sm:text-lg mb-1 mt-10 md:mt-2">Start Savings Today</p>
                <p className="">
                  Safe.Secure.Certified
                  <img src="/secure.png" className="ml-1 inline-block h-5" />
                </p>
              </div>}
            {purpose === 'login' && <>
              <h1 className="text-2xl text-[#d3ecf4] bold mb-0 px-4 mt-4 text-center md:text-left">
                Login/Sign Up
              </h1>
              <h3 className="text-xl sm:text-sm mb-4 sm:mb-2 text-white px-4 text-center md:text-left">
                Login to start
                <span className="text-yellow-400 ml-1">SAVINGS</span>
              </h3>
            </>}

            <div className="mb-4 pt-4 sm:pt-1">
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
                  setFieldError,
                  setTouched,
                }) => (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    className=""
                  >
                    {purpose !== "receipt" && <div className="flex gap-6 px-4 mt-4 md:mt-5 justify-center">
                      <div
                        onClick={() => {
                          setFieldValue("type", "user");
                          dispatch(SetUserType("user"));
                          dispatch(setAuthenticationMode("personalLogin"));
                          setCorporateLoginOrSignUp(null);
                          setFieldValue("termsAndConditions", false);
                          setFieldError('termsAndConditions', '');
                          setFieldError('gstNumber', '');
                          setFieldError('mobile_number', '');
                          setFieldValue("mobile_number", '');
                          setTouched({ ...touched, type: false, termsAndConditions: false, gstNumber: false, mobile_number: false });
                          setError(null);
                        }}
                        className="cursor-pointer"
                      >
                        <UserIcon
                          className={clsx(
                            'h-20 sm:h-12 w-23 mx-auto p-1',
                            values.type === "user" ? "text-yellow-400 border-2 border-yellow-400 rounded-full p-2" : "text-white border-2 rounded-full"
                          )}
                        />
                        <div
                          className={clsx(
                            'text-center poppins-medium py-2 tracking-wide',
                            values.type === "user" ? "text-yellow-400" : "text-white"
                          )}
                        >
                          PERSONAL
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setFieldValue("type", "corporate");
                          dispatch(SetUserType("corporate"));
                          dispatch(setAuthenticationMode("corporateLogin"));
                          setCorporateLoginOrSignUp('corporateLogin');
                          setFieldValue("termsAndConditions", false);
                          setFieldError('termsAndConditions', '');
                          setFieldError('gstNumber', '');
                          setFieldError('mobile_number', '');
                          setFieldValue("mobile_number", '');
                          setTouched({ ...touched, type: false, termsAndConditions: false, gstNumber: false, mobile_number: false });
                          setError(null);
                        }}
                        className="cursor-pointer"
                      >
                        <FaBuilding
                          // size={80}
                          className={clsx(
                            'mx-auto h-20 w-20 sm:h-12 sm:w-12',
                            values.type === "corporate" ? "text-yellow-400 border-2 border-yellow-400 rounded-full p-2" : "text-white border-2 border-white rounded-full p-2"
                          )}
                        />
                        <div
                          className={clsx(
                            'text-center poppins-medium tracking-wide px-4 mt-2',
                            values.type === "corporate" ? "text-yellow-400" : "text-white"
                          )}
                        >
                          CORPORATE
                        </div>
                      </div>
                    </div>}
                    {errors.type && touched.type && (
                      <div className="text-red-600 text-md bold px-4 text-center">{errors.type}</div>
                    )}

                    {values.type === "corporate" && (
                      <div className="mt-6 sm:mt-2 px-4">
                        {corporateLoginOrSignUp === "corporateLogin" && (
                          <>
                            <label className="text-white text-lg sm:textsm">Mobile Number</label>
                            <br />
                            <input
                              name="mobile_number"
                              className="text-gray-100 tracking-widest placeholder:text-gray-500 semibold border-1 rounded mt-1 w-full p-2 sm:p-1 coins_backgroun outline-none user-select-none focus:bg-transparent focus:outline-none"
                              type="text"
                              inputMode="numeric"
                              minLength={10}
                              maxLength={10}
                              placeholder="Enter Mobile Number"
                              onChange={(event) => {
                                const { name, value } = event.target;
                                const updatedValue = value.replace(/[^0-9]/g, "");
                                setFieldValue("mobile_number", updatedValue);
                                setError(null);
                              }}
                              onBlur={handleBlur}
                              value={values.mobile_number}
                            />
                            {touched.mobile_number && errors.mobile_number && (
                              <div className="text-red-600 text-md sm:text-sm bold">
                                {errors.mobile_number}
                              </div>
                            )}
                            {error && (
                              <div className="text-red-600 mt-0.5 sm:bold sm:text-sm tracking-wide">
                                {error}
                              </div>
                            )}
                            <div className="mt-1">
                              <p className="text-white">
                                Don’t have an account?
                                <button
                                  onClick={() => {
                                    setCorporateLoginOrSignUp('corporateSignUp');
                                    setFieldValue("termsAndConditions", false);
                                    setFieldValue('mobile_number', "");
                                    setError(null);
                                    setTouched({ ...touched, type: false, termsAndConditions: false, gstNumber: false, mobile_number: false });
                                  }}
                                  type="button"
                                  className="text-yellow-400 underline tracking-wider cursor-pointer poppins-bold ml-1"
                                >
                                  Sign Up
                                </button>
                              </p>
                            </div>
                          </>
                        )}

                        {corporateLoginOrSignUp === "corporateSignUp" && (
                          <>
                            <label className="text-white text-lg">GST Number</label>
                            <br />
                            <input
                              name="gstNumber"
                              className="text-gray-100 tracking-widest placeholder:text-gray-500 semibold border-1 rounded mt-1 w-full p-2 coins_backgroun outline-none user-select-none focus:bg-transparent focus:outline-none"
                              type="text"
                              maxLength={15}
                              placeholder="Enter GST Number"
                              onChange={(event) => {
                                const { name, value } = event.target;
                                const updatedValue = value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only letters and numbers
                                setFieldValue(name, updatedValue);
                                setError('');
                              }}
                              onBlur={handleBlur}
                              value={values.gstNumber}
                            />
                            {touched.gstNumber && errors.gstNumber && (
                              <div className="text-red-600 text-md bold">
                                {errors.gstNumber}
                              </div>
                            )}
                            {error && (
                              <div className="text-red-600 mt-0.5 bold tracking-wide">
                                {error}
                              </div>
                            )}
                            <div className="mt-1">
                              <p className="text-white">
                                Already have an account?
                                <button
                                  onClick={() => {
                                    setCorporateLoginOrSignUp('corporateLogin');
                                    setFieldValue("termsAndConditions", false);
                                    setFieldValue('gstNumber', "");
                                    setError(null);
                                    setTouched({ ...touched, type: false, termsAndConditions: false, gstNumber: false, mobile_number: false });
                                  }}
                                  type="button"
                                  className="text-yellow-400 underline tracking-wider cursor-pointer poppins-bold ml-1"
                                >
                                  Login
                                </button>
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {values.type !== "corporate" && (
                      <div className="mt-6 px-4">
                        <label className="text-white text-lg">Mobile Number</label>
                        <br />
                        <input
                          name="mobile_number"
                          className="text-gray-100 tracking-widest placeholder:text-gray-500 semibold border-1 rounded mt-1 w-full p-2 coins_backgroun outline-none user-select-none focus:bg-transparent focus:outline-none"
                          type="text"
                          inputMode="numeric"
                          minLength={10}
                          maxLength={10}
                          placeholder="Enter Mobile Number"
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(/[^0-9]/g, "");
                            setFieldValue("mobile_number", updatedValue);
                            setError('');
                          }}
                          onBlur={handleBlur}
                          value={values.mobile_number}
                        />
                        {touched.mobile_number && errors.mobile_number && (
                          <div className="text-red-600 text-md bold sm:text-sm">
                            {errors.mobile_number}
                          </div>
                        )}
                        {error && (
                          <div className="text-red-600 mt-0.5 bold tracking-wide">
                            {error}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bottom-2 absolute w-full px-4">
                      <div className="items-center flex">
                        {purpose === "login" ? (
                          <>
                            <input
                              className="cursor-pointer placeholder:text-red-500 w-5 h-5 mb-1 sm:mb-0 ml-2 sm:ml-l text-theme coins_background rounded-lg focus:outline-none bg-red-500 checked:bg-white"
                              id="termsAndConditions"
                              type="checkbox"
                              name="termsAndConditions"
                              checked={values.termsAndConditions}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />

                            <div className="mb-1 sm:mb-0 ml-2 sm:ml-l items-center text-white">
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
                            </div>
                          </>
                        ) : null}
                      </div>
                      {touched.termsAndConditions && errors.termsAndConditions ? (
                        <div className="text-red-600 text-md sm:text-sm bold">
                          {errors.termsAndConditions}
                        </div>
                      ) : null}

                      {error !== errString ? (<CustomButton
                        btnType="submit"
                        title="SEND OTP"
                        loading={submitting}
                        containerStyles="bg-themeBlue px-2 py-2 rounded-full w-full mt-2 mb-2 extrabold"
                        isDisabled={submitting}
                        handleClick={() => { handleSubmit() }}
                      />) : (
                        <div className="text-white semiBold text-center mx-auto my-auto">
                          <p>Do You Want to continue login as Corporate</p>
                          <CustomButton
                            title="Continue Login"
                            btnType="button"
                            handleClick={() => {
                              dispatch(setPurpose('login'));
                              setFieldValue("type", "corporate");
                              dispatch(SetUserType("corporate"));
                              dispatch(setAuthenticationMode("corporateLogin"));
                              setCorporateLoginOrSignUp('corporateLogin');
                              setFieldValue("termsAndConditions", false);
                              setFieldError('termsAndConditions', '');
                              setFieldError('gstNumber', '');
                              setFieldError('mobile_number', '');
                              setFieldValue("mobile_number", '');
                              setTouched({ ...touched, type: false, termsAndConditions: false, gstNumber: false, mobile_number: false });
                              setError(null);
                            }}
                            containerStyles={'bg-themeBlue px-2 py-2 rounded-full w-full mt-2 mb-2 extrabold text-black bold'}
                          />
                        </div>
                      )}
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

