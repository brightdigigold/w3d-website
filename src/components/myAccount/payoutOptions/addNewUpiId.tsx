import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { funForAesEncrypt, funcForDecrypt } from "@/components/helperFunctions";
import axios from "axios";
import Swal from "sweetalert2";
import { fetchAllUPI } from "@/api/DashboardServices";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Notiflix from "notiflix";
import CustomButton from "@/components/customButton";

export default function UpiModal({
  toggled,
  toggleUPImodal,
  upiUpdated,
  setupiUpdated,
  onClose
}: any) {
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upiError, setUpiError] = useState("");

  const validate = () => {
    let upiErrorMess = "";
    if (!upiId) {
      upiErrorMess = "Please enter UPI Id";
    }
    if (upiErrorMess) {
      setUpiError(upiErrorMess);
      return false;
    }
    return true;
  };

  const upiIdHandler = (e: any) => {
    setUpiError("");
    // Replace invalid characters with an empty string
    let upiIdInput = e.target.value.replace(/[^a-zA-Z0-9.@]/g, "");
    upiIdInput = upiIdInput.replace(/\.+/g, ".");
    let updatedValue = upiIdInput.replace(/\@+/g, "@");
    setUpiId(updatedValue);
  };

  const addNewUPI = async () => {
    if (validate()) {
      if (!isSubmitting) {
        Notiflix.Loading.custom({ svgSize: '180px', customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>' });
        setIsSubmitting(true);

        const dataToBeDecrypt = {
          value: upiId,
          isDefault: 1,
        };

        const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt);

        const payloadToSend = {
          payload: resAfterEncryptData,
        };
        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            // onUploadProgress: Notiflix.Loading.circle()
          },
        };

        axios
          .post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user/kyc/upi/verify`,
            payloadToSend,
            configHeaders
          )
          .then(async (resAfterSellReq) => {
            const decryptedData = await funcForDecrypt(
              resAfterSellReq.data.payload
            );

            if (JSON.parse(decryptedData).status) {
              await fetchAllUPI();
              Notiflix.Loading.remove();
              setUpiId("");
              Swal.fire({
                html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
                title: "Successfully Done",
                // titleText: `${JSON.parse(decryptedData).message}`,
                titleText: `Your UPI has been added successfully `,
                timer: 2500,
              });
              setupiUpdated(true);
              setOpen(false);
            }
          })
          .catch(async (errInBuyReq) => {
            Notiflix.Loading.remove();
            const decryptedData = await funcForDecrypt(
              errInBuyReq?.response?.data?.payload
            );
            Swal.fire({
              html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
              title: "Oops...",
              titleText: `${JSON.parse(decryptedData).message}`,
            });
          })
          .finally(() => {
            Notiflix.Loading.remove();
            setIsSubmitting(false);
          });
      }
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

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-theme px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-xl sm:text-3xl font-semibold text-center leading-6 text-white mb-3"
                      >
                        ADD UPI ID
                      </Dialog.Title>
                      <Dialog.Title
                        as="h2"
                        className="text-base font-semibold leading-6 text-white"
                      >
                        Enter UPI ID
                      </Dialog.Title>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1 focus:ring-0 focus:border-b"
                          placeholder="Enter UPI ID"
                          value={upiId}
                          onChange={upiIdHandler}
                        />
                      </div>
                      {upiError && (
                        <div className="text-red-600 text-center mt-2">
                          {upiError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-theme px-4 py-3 pb-6 flex  justify-center sm:px-6">
                  <CustomButton
                    btnType="button"
                    title="VERIFY AND ADD"
                    loading={isSubmitting}
                    isDisabled={isSubmitting}
                    containerStyles="mt-3 inline-flex w-full justify-center rounded-md bg-themeBlue px-3 py-2 text-sm font-semibold  shadow-sm  sm:mt-0 sm:w-auto"
                    handleClick={addNewUPI}
                  />
                  
                  <button
                    type="submit"
                    className="mt-3 absolute top-5 bg-transparent right-5  justify-center rounded-full border-1 text-white p-2 text-sm font-semibold shadow-sm  sm:mt-0 sm:w-auto"
                    onClick={() => {
                      if (onClose) onClose();
                      setOpen(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    <XMarkIcon className="h-4" />
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
