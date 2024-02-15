import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { AppDispatch } from "@/redux/store";
import { fetchUserDetails, selectUser } from "@/redux/userDetailsSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { AesDecrypt, AesEncrypt, } from "@/components/helperFunctions";
import axios from "axios";
import Swal from "sweetalert2";
import ProfileInput from "@/utils/profileInput";
import Loading from "@/app/loading";

const EditProfileModel = ({ onSaveDetails, onCancel }: any) => {
  const [open, setOpen] = useState(true);
  const user = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    formik.setFieldValue("name", user.data?.name);
    formik.setFieldValue("email", user.data?.email);
    formik.setFieldValue("gender", user.data?.gender);
    formik.setFieldValue("gst_number", user.data?.gst_number);
    formik.setFieldValue(
      "dateOfBirth",
      new Date(user.data?.dateOfBirth).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  }, [fetchUserDetails]);

  const fetchData = async () => {
    dispatch(fetchUserDetails());
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      gst_number: "",
    },
    enableReinitialize: true,
    validate(values) {
      const errors: any = {};
      const isValidLength = /^.{2,50}$/;
      //validation on name
      if (!values.name) {
        errors.name = "Name Is Required!";
      } else if (!isValidLength.test(values.name)) {
        errors.name =
          "Name should be greater than 2 character and less than 50 character";
      } else if (!/^[A-Za-z][A-Za-z]/.test(values.name)) {
        errors.name = "Invalid name";
      }

      //validation for Email
      if (!values.email) {
        errors.email = "Email Is Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Please enter a valid Email address.";
      }
      return errors;
    },

    onSubmit: async (values, { resetForm }) => {
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

        const decryptedData = await AesDecrypt(response.data.payload);
        const finalResult = JSON.parse(decryptedData);

        if (finalResult.status) {
          Swal.fire({
            html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
            width: "450px",
            padding: "4em",
            title: finalResult.message,
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData();
          setOpen(false);
          resetForm();
          onSaveDetails();
        }
      } catch (error: any) {
        const decryptedData = AesDecrypt(error.response.data.payload);
        const finalResult = JSON.parse(decryptedData);
        console.error(error);
        Swal.fire({
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          title: "Oops...",
          titleText: finalResult.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setIsSubmitting(false);
        setOpen(false);
      }
    },
  });

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
                <div className="w-full relative">
                  {isSubmitting && <Loading />}
                  <div className=" absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none">
                  </div>
                  <ProfileInput
                    type="text"
                    label="Full Name *"
                    name="name"
                    formik={formik}
                    readonly={!user.data.isKycDone ? false : true}
                  />

                  <ProfileInput
                    type="text"
                    label="Date of Birth *"
                    name="dateOfBirth"
                    placeholder="01/01/2000"
                    formik={formik}
                    extra={{ max: "2005-01-01" }}
                    readonly={!user.data.isKycDone ? false : true}
                  />

                  <ProfileInput
                    type="gender"
                    label="Gender"
                    name="gender"
                    formik={formik}
                    readonly={true}
                  />

                  <ProfileInput
                    type="email"
                    label="Email Address"
                    name="email"
                    formik={formik}
                    readonly={user.data?.isEmailVerified ? true : false}
                  />

                  <div className="flex justify-center">
                    <button
                      className="font-semibold py-2 bg-themeBlue rounded px-3 text-center inline-block"
                      onClick={() => {
                        formik.submitForm();
                        setOpen(false);
                      }}
                    >
                      Save Details
                    </button>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className=" absolute top-2 right-3 justify-center rounded-full border-1 p-1 text-sm font-semibold text-white shadow-sm focus-visible:outline"
                    onClick={() => setOpen(false)}
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

export default EditProfileModel;
