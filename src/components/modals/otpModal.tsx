"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import OtpInput from "react-otp-input";
import Swal from "sweetalert2";
import { AesDecrypt, AesEncrypt, funcForDecrypt } from "../helperFunctions";
import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import {
  setIsLoggedIn,
  setShowOTPmodal,
  setShowProfileForm,
  setShowProfileFormCorporate,
  setDevoteeIsNewUser,
  setIsLoggedInForTempleReceipt,
  setCorporateBusinessDetails,
  SetUserType
} from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserDetails } from "@/redux/userDetailsSlice";
import CustomButton from "../customButton";
import Notiflix from "notiflix";
import { fetchWalletData } from "@/redux/vaultSlice";
import mixpanel from "mixpanel-browser";

export default function OtpModal() {
  const corporateBusinessDetails = useSelector((state: RootState) => state.auth.corporateBusinessDetails);
  const authenticationMode = useSelector((state: RootState) => state.auth.authenticationMode);
  const purpose = useSelector((state: RootState) => state.auth.purpose);
  const otpMsg = useSelector((state: RootState) => state.auth.otpMsg);
  const userType = useSelector((state: RootState) => state.auth.UserType);
  const [open, setOpen] = useState(true);
  const [otpError, setOtpError] = useState("");
  const cancelButtonRef = useRef(null);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [resendTimer, setResendTimer] = useState(10);
  const [resendDisabled, setResendDisabled] = useState(false);
  const mobile_number = localStorage.getItem("mobile_number")?.toString();

  useEffect(() => {
    let countdown: string | number | NodeJS.Timeout | any;

    if (resendTimer > 0) {
      countdown = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [resendTimer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };
    // Attach the event listener
    document.addEventListener("keydown", handleKeyDown);
    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [otp]);

  const startResendTimer = () => {
    setResendTimer(120);
    setResendDisabled(true);

    const countdown = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdown);
      setResendDisabled(false);
    }, 200); // 2 minutes
  };

  const handleSubmit = async () => {
    const apiEndPoint = authenticationMode === "corporateSignUp" ? "auth/gst/verify/otp" : "auth/verify/otp";
    const otpLength = authenticationMode === "corporateSignUp" ? 4 : 6;

    if (otp.length < otpLength) {
      setOtpError("Please fill the OTP");
    } else {

      const userData = {
        mobile_number: localStorage.getItem("mobile_number"),
        otp: otp,
        skipMobileNumber: false,
      }

      const corporateData = {
        dateOfBirth: corporateBusinessDetails?.dateOfBirth,
        gstMobile: corporateBusinessDetails?.gstMobile,
        gstNumber: corporateBusinessDetails?.gstNumber,
        legalName: corporateBusinessDetails?.legalName,
        pan: corporateBusinessDetails?.pan,
        tradeName: corporateBusinessDetails?.tradeName,
        otp: otp,
      }

      const data = authenticationMode === "corporateSignUp" ? corporateData : userData;

      try {
        setSubmitting(true);
        const resAfterEncrypt = AesEncrypt(data);

        const body = {
          payload: resAfterEncrypt,
        };
        const header: AxiosRequestConfig = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.post(
          `${process.env.baseUrl}/${apiEndPoint}`,
          body,
          header
        );
        const decryptedData = await funcForDecrypt(response.data.payload);
        const result = JSON.parse(decryptedData);
        if (result.status) {
          authenticationMode != "corporateSignUp" ? localStorage.setItem("token", result.data.otpVarifiedToken) : undefined;
          if (authenticationMode === "corporateSignUp") {
            dispatch(setShowProfileFormCorporate(true));
            mixpanel.identify(mobile_number);
            mixpanel.track('New Corporate SignUp(web)');
          } else if (authenticationMode === "corporateLogin") {
            dispatch(fetchUserDetails());
            dispatch(setIsLoggedIn(true));
            dispatch(fetchWalletData() as any);
            mixpanel.track('New Corporate Login(web)');
          } else if (purpose === 'login') {
            dispatch(fetchUserDetails());
            dispatch(setIsLoggedIn(true));
            dispatch(fetchWalletData() as any);
            if (result.data.isNewUser) {
              mixpanel.identify(mobile_number);
              mixpanel.track('New User Login(web)');
              if (userType === "user") {
                dispatch(setShowProfileForm(true));
              } else {
                dispatch(setShowProfileFormCorporate(true));
              }
            }
            mixpanel.identify(mobile_number);
            dispatch(setShowOTPmodal(false));
            // router.push("/");
          } else {
            dispatch(setShowOTPmodal(false));
            dispatch(setIsLoggedInForTempleReceipt(true));
            mixpanel.track('To download receipt');
            // console.log(".>>>>>>>>", result.data.isNewUser);
            if (result.data.isNewUser) {
              dispatch(setDevoteeIsNewUser(true));
              router.push("/donation-receipt");
            } else {
              dispatch(setIsLoggedIn(true));
              dispatch(fetchUserDetails());
              dispatch(fetchWalletData() as any);
              dispatch(setDevoteeIsNewUser(false));
              router.push("/donation-receipt");
            }
          }
        } else {
          setOtp("");
          Swal.fire({
            html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
            title: "Oops...",
            titleText: result.message,
          });
        }
        setSubmitting(false);
      } catch (error: any) {
        dispatch(setShowOTPmodal(false));
        const decryptedData = AesDecrypt(error?.response?.data?.payload);
        const result = JSON.parse(decryptedData);
        Swal.fire({
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          title: "Oops...",
          titleText: result.message,
        });
        setOtp("");
        setOtpError("");
        setSubmitting(false);
      } finally {
        setSubmitting(false);
        dispatch(setShowOTPmodal(false));
      }
    }
  };

  const resendOtp = async () => {
    try {
      const data = {
        mobile_number: localStorage.getItem("mobile_number"),
      };
      Notiflix.Loading.init({ svgColor: "rgba(241,230,230,0.985)" });
      const resAfterEncrypt = await AesEncrypt(data);
      const body = {
        payload: resAfterEncrypt,
      };

      const header = {
        "Content-Type": "application/json",
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
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
        Notiflix.Loading.remove();
        startResendTimer();
        router.push("/");
      }
    } catch (error) {
      // Handle errors here
      Swal.fire({
        html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
        title: "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="z-[110] fixed inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => {
          return false;
        }}
        data-keyboard="false"
        data-backdrop="static"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-[50] w-screen overflow-y-auto">
          <div className="flex min-h-full z-[50] items-center justify-center text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-theme text-left shadow-xl transition-all sm:my-6 sm:w-full sm:max-w-lg">
                <div className="px-5 pt-5 sm:p-6 sm:pb-3">
                  <div>
                    <img src="/LogoOtp.png" className="h-16 mb-4 mx-auto" />
                  </div>
                  <p className="text-green-600 sm:text-sm text-xs text-center sm:mb-3">
                    {otpMsg}
                  </p>
                  <div className="flex flex-col justify-center">
                    <div className="mt-3 items-center  sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base bold leading-6 text-white ml-2"
                      >
                        Enter OTP
                      </Dialog.Title>
                      <div className="mt-2 otpInput">
                        <OtpInput
                          value={otp}
                          inputType="number"
                          onChange={setOtp}
                          numInputs={userType === 'user' ? 6 : authenticationMode === "corporateSignUp" ? 4 : 6}
                          containerStyle={{
                            padding: "2px",
                            margin: "0 auto",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: userType === 'user' ? "space-around" : authenticationMode === "corporateSignUp" ? "" : "space-around",
                          }}
                          shouldAutoFocus={true}
                          renderSeparator={<span> </span>}
                          inputStyle={{
                            width: "3rem",
                            height: "3rem",
                            textAlign: "center",
                            fontSize: "1rem",
                            border: "2px solid #2c7bac",
                            background: "transparent",
                            color: "#fff",
                            borderRadius: "10px",
                            margin: "0 6px",
                            outline: "none",
                          }}
                          renderInput={(props) => <input {...props} />}
                        />
                        {otpError && (
                          <div className="text-red-600">{otpError}</div>
                        )}
                      </div>
                    </div>
                    <div className="sm:m-2 mx-1 my-1">
                      {resendTimer > 0 && (
                        <span className=" text-yellow-400 sm:ml-5">
                          Resend OTP in{" "}
                          {`${Math.floor(resendTimer / 60)
                            .toString()
                            .padStart(2, "0")}:${(resendTimer % 60)
                              .toString()
                              .padStart(2, "0")}`}
                        </span>
                      )}

                      {!resendTimer && (
                        <CustomButton
                          btnType="submit"
                          title="Resend OTP"
                          noPadding={true}
                          containerStyles={`text-yellow-400 underline ${resendDisabled ? "cursor-not-allowed" : ""
                            }`}
                          handleClick={() => resendOtp()}
                          isDisabled={resendDisabled}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <CustomButton
                      loading={submitting}
                      title="Submit"
                      btnType="submit"
                      containerStyles="bg-themeBlue rounded-full border border-gray-200 bold h-22 focus:outline-none focus:z-10"
                      handleClick={() => {
                        handleSubmit();
                      }}
                    />
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex absolute  top-2 sm:top-4 right-4 justify-center rounded-full bg-transparent p-2 text-sm bold text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      dispatch(SetUserType('user'));
                      dispatch(setCorporateBusinessDetails(null));
                      dispatch(setShowOTPmodal(false));
                    }}
                    ref={cancelButtonRef}
                  >
                    <XMarkIcon className="h-5" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
