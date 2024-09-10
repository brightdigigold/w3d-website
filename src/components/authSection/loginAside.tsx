"use client";
import { setShowOTPmodal, setPurpose, setOtpMsg, SetUserType } from "@/redux/authSlice";
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
interface LoginAsideProps {
  isOpen: boolean;
  onClose: () => any;
  purpose: string;
}

const LoginAside = ({ isOpen, onClose, purpose }: LoginAsideProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const userType = useSelector((state: RootState) => state.auth.UserType);
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const [corporateLoginOrSignUp, setCorporateLoginOrSignUp] = useState<"login" | "signup" | null>("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const toggleBodyScroll = (shouldLock: boolean) => {
      document.body.style.overflow = shouldLock ? 'hidden' : 'auto';
    };

    toggleBodyScroll(isOpen);
    return () => toggleBodyScroll(false);
  }, [isOpen]);


  // useEffect(() => {
  //   const handleClickOutside = (event: any) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       onClose();
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [modalRef, onClose]);

  const handleTermsClick = () => {
    router.push("/term-and-conditions")
    onClose();
  };

  const initialValues = {
    mobile_number: "",
    GST_number: "",
    termsAndConditions: false,
    type: "user",
    country_iso: '91',
    isCountryIsoRequired: false,
    mode: "",
  };

  const validationSchema = Yup.object({
    termsAndConditions: Yup.boolean().oneOf([true], "Terms and conditions are required"),

    type: Yup.string().required("Please select Personal or Corporate"),

    mobile_number: (userType === "corporate" && corporateLoginOrSignUp === 'login') || (userType === "user")
      ? Yup.string()
        .required("Mobile number is required")
        .matches(/^[6789][0-9]{9}$/, "Mobile No. is not valid")
        .matches(phoneRegex, "Invalid Number, Kindly enter a valid number")
        .min(10, "Please enter a 10-digit mobile number")
        .max(10, "Too long")
      : Yup.string(),

    GST_number: (userType === 'corporate' && corporateLoginOrSignUp === 'signup')
      ? Yup.string()
        .required("GST number is required")
        .min(5, 'GST number must be greater than 5 characters')
        .max(15, "GST number cannot be more than 15 characters")
        .matches(/^[a-zA-Z0-9]*$/, "GST number can only contain letters and numbers")
      : Yup.string()
  });


  const onSubmit = async (values: any) => {
    console.log("onSubmit", values);
    dispatch(SetUserType(values.type));
    const updatedValues = {
      ...values,
      mode: corporateLoginOrSignUp, // Add or update the mode field
    };

    console.log("Updated Values", updatedValues);
    try {
      setSubmitting(true);
      // Notiflix.Loading.circle();
      const result = await postMethodHelperWithEncryption(
        `${process.env.baseUrl}/auth/send/otp`,
        updatedValues,
        // {
        //   onUploadProgress: () => Notiflix.Loading.circle(),
        // }
      );

      if (!result.isError && result.data.status) {
        localStorage.setItem("mobile_number", values.mobile_number);
        dispatch(setPurpose(purpose));
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
          <div className="w-full ">
            <button
              onClick={onClose}
              className="absolute top-3 end-2.5 text-white hover:text-gold01 text-xl cursor-pointer "
            >
              <FaTimes size={28} className="text-themeBlueLight hover:text-red-500 border-1 rounded-full p-1 transition-colors duration-300 ease-in-out" />
            </button>
            <div className=" text-center text-white pb-1">
              <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgLogo.png" className="h-20 mx-auto mt-12 md:mt-8" />
              <p className=" text-2xl mb-1 mt-10 md:mt-4">Start Savings Today</p>
              <p className="">
                Safe.Secure.Certified
                <img src="/secure.png" className="ml-1 inline-block h-5" />
              </p>
            </div>
            {purpose === 'login' ? <> <h1 className="text-3xl sm:text-2xl text-[#d3ecf4] bold mb-0 px-4 mt-4 text-center md:text-left">
              Login/Sign Up
            </h1>
              <h3 className="text-xl mb-4 text-white px-4 text-center md:text-left">
                Login to start
                <span className="text-yellow-400 ml-1">SAVINGS</span>
              </h3></> : null}
            <div className="mb-4 pt-4">
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
                    <div className="flex gap-6 px-4 mt-3 md:mt-0 justify-center">
                      <div
                        onClick={() => {
                          setFieldValue("type", "user");
                          dispatch(SetUserType("user"));
                          setCorporateLoginOrSignUp('login');
                          setFieldValue("termsAndConditions", false);
                          setFieldError('termsAndConditions', '');
                          setFieldError('GST_number', '');
                          setFieldError('mobile_number', '');
                          setFieldValue("mobile_number", '');
                          setTouched({ ...touched, type: false, termsAndConditions: false, GST_number: false, mobile_number: false });
                          setError(null);
                        }}
                        className="cursor-pointer"
                      >
                        <UserIcon
                          className={clsx(
                            'h-20 w-23 mx-auto p-1',
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
                          setCorporateLoginOrSignUp('login');
                          setFieldValue("termsAndConditions", false);
                          setFieldError('termsAndConditions', '');
                          setFieldError('GST_number', '');
                          setFieldError('mobile_number', '');
                          setFieldValue("mobile_number", '');
                          setTouched({ ...touched, type: false, termsAndConditions: false, GST_number: false, mobile_number: false });
                          setError(null);
                        }}
                        className="cursor-pointer"
                      >
                        <FaBuilding
                          size={80}
                          className={clsx(
                            'mx-auto',
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
                    </div>
                    {errors.type && touched.type && (
                      <div className="text-red-600 text-md bold px-4 text-center">{errors.type}</div>
                    )}

                    {values.type === "corporate" && (
                      <div className="mt-6 px-4">
                        {corporateLoginOrSignUp === "login" && (
                          <>
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
                                setError(null);
                              }}
                              onBlur={handleBlur}
                              value={values.mobile_number}
                            />
                            {touched.mobile_number && errors.mobile_number && (
                              <div className="text-red-600 text-md bold">
                                {errors.mobile_number}
                              </div>
                            )}
                            {error && (
                              <div className="text-red-600 mt-0.5 bold tracking-wide">
                                {error}
                              </div>
                            )}
                            <div className="mt-1">
                              <p className="text-white">
                                Don’t have an account?
                                <button
                                  onClick={() => {
                                    setCorporateLoginOrSignUp('signup');
                                    setFieldValue("termsAndConditions", false);
                                    setFieldValue('mobile_number', "");
                                    setError(null);
                                    setTouched({ ...touched, type: false, termsAndConditions: false, GST_number: false, mobile_number: false });
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

                        {corporateLoginOrSignUp === "signup" && (
                          <>
                            <label className="text-white text-lg">GST Number</label>
                            <br />
                            <input
                              name="GST_number"
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
                              value={values.GST_number}
                            />
                            {touched.GST_number && errors.GST_number && (
                              <div className="text-red-600 text-md bold">
                                {errors.GST_number}
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
                                    setCorporateLoginOrSignUp('login');
                                    setFieldValue("termsAndConditions", false);
                                    setFieldValue('GST_number', "");
                                    setError(null);
                                    setTouched({ ...touched, type: false, termsAndConditions: false, GST_number: false, mobile_number: false });
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
                          <div className="text-red-600 text-md bold">
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
                              className="cursor-pointer placeholder:text-gray-500 w-4 h-5 text-theme coins_background rounded-lg focus:outline-none"
                              id="termsAndConditions"
                              type="checkbox"
                              name="termsAndConditions"
                              checked={values.termsAndConditions}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <div className="ml-2 items-center text-white">
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
                        <div className="text-red-600 text-md bold">
                          {errors.termsAndConditions}
                        </div>
                      ) : null}
                      <CustomButton
                        btnType="submit"
                        title="SEND OTP"
                        loading={submitting}
                        containerStyles="bg-themeBlue px-2 py-2 rounded-full w-full mt-2 mb-2 extrabold"
                        isDisabled={submitting}
                        handleClick={() => { handleSubmit() }}
                      />
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

