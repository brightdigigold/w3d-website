"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import OtpInput from "react-otp-input";
import Swal from "sweetalert2";
import { AesDecrypt, AesEncrypt } from "../helperFunctions";
import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import {
  setIsLoggedIn,
  setShowOTPmodal,
  setShowProfileForm,
} from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { fetchUserDetails } from "@/redux/userDetailsSlice";
import CustomButton from "../customButton";
import Notiflix from "notiflix";
import { fetchWalletData } from "@/redux/vaultSlice";

export default function OtpModal() {
  let completeButtonRef = useRef(null);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [otpError, setOtpError] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const [resendTimer, setResendTimer] = useState(120);
  const [resendDisabled, setResendDisabled] = useState(false);

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
    // const mobile_number = localStorage.getItem("mobile_number");
    // setShowMobileNumber(mobile_number);
    if (otp.length < 6) {
      setOtpError("Please Fill the OTP");
    } else {
      const data = {
        mobile_number: localStorage.getItem("mobile_number"),
        otp: otp,
        skipMobileNumber: false,
      };

      try {
        setSubmitting(true);
        const resAfterEncrypt = await AesEncrypt(data);

        const body = {
          payload: resAfterEncrypt,
        };
        const header: AxiosRequestConfig = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.post(
          `${process.env.baseUrl}/auth/verify/otp`,
          body,
          header
        );
        const decryptedData = await AesDecrypt(response.data.payload);
        const result = JSON.parse(decryptedData);
        if (result.status === true) {
          localStorage.setItem("token", result?.data?.otpVarifiedToken);
          dispatch(fetchUserDetails());
          dispatch(setIsLoggedIn(true));
          dispatch(fetchWalletData() as any);
          if (result.data.isNewUser) {
            dispatch(setShowProfileForm(true));
          }
          dispatch(setShowOTPmodal(false));
          router.push("/");
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
        const decryptedData = await AesDecrypt(error?.response?.data?.payload);
        const result = JSON.parse(decryptedData);
        Swal.fire({
          // icon: "error",
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,

          title: "Oops...",
          titleText: result.message,
        });
        setOtp("");
        setOtpError("");
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
      console.error(error);
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
          <div className="flex min-h-full z-[50] items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-theme text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-theme px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div>
                    <img src="/LogoOtp.png" className="h-16 mb-6 mx-auto" />
                  </div>
                  {/* <h1 className="text-gold01 extrabold text-5xl text-center mb-3">
                    OTP
                  </h1> */}
                  <div className="sm:flex sm:items-start justify-center">
                    <div className="mt-3 items-center text-center sm:ml-4 sm:mt-0 sm:text-left">
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
                          numInputs={6}
                          containerStyle={{
                            padding: "2px",
                            margin: "0 auto",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "space-around",
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

                        <div className="flex flex-col justify-start w-48 h-18 mt-2 ml-2">
                          <div className="flex items-center">
                            {resendTimer > 0 && (
                              <span className="mr-2 text-yellow-400">
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
                                containerStyles={`text-yellow-400 ${
                                  resendDisabled ? "cursor-not-allowed" : ""
                                }`}
                                handleClick={() => resendOtp()}
                                isDisabled={resendDisabled}
                              />
                            )}
                          </div>
                        </div>
                        <div className=" flex justify-center">
                          <button
                            data-modal-hide="popup-modal"
                            type="submit"
                            className="mt-4 w-40 text-md text-black bg-themeBlue focus:outline-none rounded-full border border-gray-200 bold px-5 py-2.5 focus:z-10"
                            onClick={() => {
                              handleSubmit();
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex absolute top-5 right-5 justify-center rounded-full bg-transparent p-2 text-sm bold text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
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
