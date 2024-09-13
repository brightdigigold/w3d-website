import { RootState } from '@/redux/store';
import React, { useState, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import OtpInput from "react-otp-input";
import CustomButton from '../customButton';
import { useDispatch } from 'react-redux';
import { postMethodHelperWithEncryption } from '@/api/postMethodHelper';

const OTPCorporateSignUp = ({ OTPMsg }) => {
    const corporateBusinessDetails = useSelector((state: RootState) => state.auth.corporateBusinessDetails);
    const dispatch = useDispatch();
    console.log("corporateBusinessDetails", corporateBusinessDetails);
    const [otp, setOtp] = useState('');
    const cancelButtonRef = useRef(null);
    const [open, setOpen] = useState(true);
    const [otpError, setOtpError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        const corporateDetails = "corporateDetails"
        try {
            setSubmitting(true);
            const result = await postMethodHelperWithEncryption(
                `${process.env.baseUrl}/auth/verify/otp`,
                corporateDetails,
            );

            // console.log("decrypted data from otp modal", result);
            if (!result.isError && result.data.status) {

            } else {
                setOtp("");

            }
            setSubmitting(false);
        } catch (error: any) {
            setOtp("");
            setOtpError("");
            setSubmitting(false);
        } finally {
            setSubmitting(false);
        }
    }

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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-theme text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="px-5 pt-5 sm:p-6 sm:pb-3">
                                    <div>
                                        <img src="/LogoOtp.png" className="h-16 mb-4 mx-auto" />
                                    </div>
                                    <p className="text-green-600 sm:text-sm text-xs text-center sm:mb-3">
                                        {OTPMsg}
                                    </p>
                                    <div className="flex flex-col justify-center">
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
                                                        justifyContent: "space-around"
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
                                        {/* <div className="m-2">
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
                                                    containerStyles={`text-yellow-400 ${resendDisabled ? "cursor-not-allowed" : ""
                                                        }`}
                                                    handleClick={() => resendOtp()}
                                                    isDisabled={resendDisabled}
                                                />
                                            )}
                                        </div> */}
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
                                        className="mt-3 inline-flex absolute top-5 right-5 justify-center rounded-full bg-transparent p-2 text-sm bold text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                                        onClick={() => {
                                            setOpen(false);
                                            // dispatch(SetUserType('user'));
                                            // dispatch(setCorporateBusinessDetails(null));
                                            // dispatch(setShowOTPmodal(false));
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
};

export default OTPCorporateSignUp;
