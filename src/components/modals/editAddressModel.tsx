import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useRef } from "react";
import { ErrorMessage, Formik } from "formik";
import { AesDecrypt, AesEncrypt } from "@/components/helperFunctions";
import axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";

const EditAddressModel = ({
  onCancel,
  ToEditAddress,
  onAddressListUpdate,
}: any) => {
  const [open, setOpen] = useState(true);
  const formikRef = useRef<any>();
  const [state, setState] = useState([]);
  const [commonError, setCommonError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  let address;
  if (ToEditAddress?.address?.pincode.toString().length === 6) {
    address = true;
  } else {
    address = false;
  }
  const [delivered, setDelivered] = useState(address);

  const fetchPincode = async (pincode: Number) => {
    setCommonError("");
    if (pincode.toString().length === 6) {
      try {
        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.get(
          `${process.env.baseUrl}/user/ecom/pincode/${pincode}`,
          configHeaders
        );
        const decryptedData = AesDecrypt(response.data.payload);
        const finalResult = JSON.parse(decryptedData);
        if (finalResult.data.length > 0) {
          formikRef.current?.setFieldValue("city", finalResult.data[0].city);
          formikRef.current?.setFieldValue("state", finalResult.data[0].state);
          setCommonError("");
          setDelivered(true);
          setIsSubmitting(false);
        } else {
          formikRef.current?.setFieldValue("city", "");
          formikRef.current?.setFieldValue("state", "");
          setCommonError("Sorry, We do not provide service on this pincode");
          setDelivered(false);
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  useEffect(() => {
    fetch(`${process.env.baseUrl}/public/state/list`, {
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = AesDecrypt(data.payload);

        const stateList = JSON.parse(decryptedData).data;
        setState(stateList);
      })
      .catch((error) => console.error(error));
  }, []);

  const initialValues = {
    line1: ToEditAddress?.address?.line1,
    line2: ToEditAddress?.address?.line2,
    city: ToEditAddress?.address?.city,
    state: ToEditAddress?.address?.state,
    pincode: ToEditAddress?.address?.pincode,
    id: ToEditAddress?._id,
  };

  const validationSchema = Yup.object().shape({
    line1: Yup.string().required("Required"),
    line2: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pincode: Yup.string()
      .matches(/^\d{6}$/, "PinCode is not valid")
      .required("Required"),
  });

  const onSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    if (delivered) {
      setCommonError("");
      try {
        const resAfterEncrypt = await AesEncrypt(values);
        const body = { payload: resAfterEncrypt };
        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.post(
          `${process.env.baseUrl}/user/address/update`,
          body,
          configHeaders
        );
        const decryptedData = await AesDecrypt(response.data.payload);
        const finalResult = JSON.parse(decryptedData);
        if (finalResult.status) {
          Swal.fire({
            html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,

            width: "450px",
            padding: "4em",
            title: "Address Updated Successfully",
            customClass: {
              popup: "swal2-popup-custom",
              title: "swal2-title-custom",
            },

            showConfirmButton: false,
            timer: 1500,
          });

          setOpen(false);
          onCancel();
          onAddressListUpdate();
          onCancel();
        }
      } catch (error: any) {
        alert(error);
      } finally {
        setIsSubmitting(false);
        onCancel();
        // setOpen(false);
      }
    } else {
      setCommonError("Sorry, We do not provide service on this pincode");
    }
  };
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={open} as={Fragment}>
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
          //   onClose={closeModal}
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg  bg-theme px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-sm sm:p-6">
                <div className=" relative">
                  <div className="text-white text-xl mt-2 cursor-pointer  absolute top-0 right-4">
                    {/* <FaTimes onClick={onCancel} /> */}
                  </div>
                  <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      setFieldValue,
                      handleSubmit,
                    }) => (
                      <form
                        className="pt-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <div className="pt-2">
                          <label className="text-white">Address Line 1</label>

                          <input
                            name="line1"
                            type="text"
                            placeholder="Enter Your Address"
                            value={values.line1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-2 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none focus:bg-black  border-1  focus:ring-0 focus:border-b"
                          />
                          <ErrorMessage
                            name="line1"
                            component="div"
                            className="text-red-600"
                          />
                        </div>
                        <div className="pt-2">
                          <label className="text-white">Address Line 2</label>
                          <input
                            name="line2"
                            type="text"
                            placeholder="Enter Your Address"
                            value={values.line2}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-2 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1  focus:ring-0 focus:border-b"
                          />
                          <ErrorMessage
                            name="line2"
                            component="div"
                            className=""
                          />
                        </div>
                        <div className="pt-2">
                          <label className="text-white">PIN Code</label>

                          <input
                            name="pincode"
                            type="tel"
                            className="mt-2 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1  focus:ring-0 focus:border-b"
                            placeholder="Enter Your Pin Code"
                            value={values.pincode}
                            maxLength={6}
                            onChange={(event) => {
                              setDelivered(false);
                              const { name, value } = event.target;
                              const updatedValue = value.replace(/[^0-9]/g, "");
                              fetchPincode(+updatedValue);
                              setFieldValue("pincode", +updatedValue);
                            }}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="pincode"
                            component="div"
                            className="text-red-600"
                          />
                          {commonError && (
                            <div className="text-red-600">{commonError}</div>
                          )}
                        </div>
                        <div className="pt-2">
                          <label className="text-white">City</label>
                          <input
                            name="city"
                            type="text"
                            placeholder="Enter Your City Name"
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-2 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1  focus:ring-0 focus:border-b"
                          />
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="text-red-600"
                          />
                        </div>
                        <div className="pt-2">
                          <label className="text-white">State</label>
                          <select
                            name="state"
                            id="state_id"
                            value={values.state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-2 block w-full text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1  focus:ring-0 focus:border-b"
                          >
                            <option value="">Please choose an option</option>
                            {state.map((item: any, key) => {
                              return (
                                <>
                                  <option key={item._id} value={item.name}>
                                    {item.name}
                                  </option>
                                </>
                              );
                            })}
                          </select>
                          <ErrorMessage
                            name="state"
                            component="div"
                            className="text-red-600"
                          />
                        </div>
                        <div className="mt-4 flex justify-center">
                          <button
                            className="bg-themeBlue font-semibold rounded px-2 py-2"
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubmit();
                            }}
                            disabled={isSubmitting}
                          >
                            Save Details
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className=" absolute top-2 right-3 justify-center rounded-full border-1 p-1 text-sm font-semibold text-white shadow-sm focus-visible:outline"
                    onClick={() =>
                      // setOpen(false)
                      onCancel()
                    }
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

export default EditAddressModel;
