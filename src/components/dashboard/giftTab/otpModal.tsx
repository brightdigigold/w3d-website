import React, { Fragment, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import OtpInput from "react-otp-input";
import { Dialog, Transition } from "@headlessui/react";
import { OtpModalProps } from "@/types";

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onSubmitVerify,
  handleOTPChange,
  otp,
  otpError,
  isSubmitting,
}) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition show={isOpen} aria-labelledby="contained-modal-title-vcenter">
      <Dialog
        as="div"
        className="z-50 fixed inset-0 overflow-y-auto"
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
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-theme p-4 max-w-md mx-auto rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg bold text-white">Enter OTP</div>
              <div className="cursor-pointer" onClick={onClose}>
                <IoMdClose style={{ color: "white" }} size={26} />
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitVerify(e);
              }}
            >
              <div className="mb-4">
                <div className="mb-2">
                  <OtpInput
                    value={otp}
                    inputType="number"
                    onChange={handleOTPChange}
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
                </div>
                <span className="block text-red-500 text-sm">{otpError}</span>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2 px-12 bg-yellow-400 font-semibold rounded-md"
                >
                  VERIFY
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OtpModal;
