"use client";
import React, { useState } from "react";
import FormInput, {
  AesDecrypt,
  AesEncrypt,
  Card,
} from "@/components/helperFunctions";
import * as Yup from "yup";
import axios from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import Swal from "sweetalert2";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import OtpModal from "@/components/modals/otpModal";
import {} from "../../../public/images/MailiIcon.png"

const Contacts = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpModal = useSelector((state: RootState) => state.auth.otpModal);

  const initialValues: {
    name: string;
    email: string;
    city: string;
    mobile: string;
    message: string;
    document: File | null;
  } = {
    name: "",
    email: "",
    city: "",
    mobile: "",
    message: "",
    document: null,
  };

  const validateFile = (file: { type: any }) => {
    const allowedFileTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedFileTypes.includes(file.type)) {
      return "Only PNG, JPEG, and PDF files are allowed.";
    }
    return null;
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .transform((value, originalValue) => {
        if (originalValue) {
          return originalValue.replace(/[^A-Za-z]/g, "");
        }
        return value;
      })
      .min(3, "Name should be min. 3 Character")
      .max(50, "Name should be max. 50 Character")
      .required("Name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email address")
      .matches(/\./, "Invalid email address")
      .required("Email is required"),
    city: Yup.string().trim().required("City is required"),
    mobile: Yup.string()
      .required("Mobile Number required")
      .matches(/^[6789][0-9]{9}$/, "Mobile No. is not valid")
      .min(10, "Please enter 10 digit mobile number")
      .max(10, "too long"),
    message: Yup.string()
      .trim()
      .required("Required")
      .max(500, "Message should be max. 500 Charcter"),
  });
  const onSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      // Object.entries(values).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });

      const resAfterEncrypt = await AesEncrypt(values);
      formData.append("document", values.document);
      formData.append("payload", resAfterEncrypt);
      const body = {
        payload: resAfterEncrypt,
      };
      const token = localStorage.getItem("token");
      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.post(
        `${process.env.baseUrl}/data/contactus`,
        formData,
        configHeaders
      );
      const decryptedData = await AesDecrypt(response.data.payload);
      const finalResult = JSON.parse(decryptedData);
      if (finalResult.status) {
        Swal.fire({
          html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
          title: finalResult.message,
          customClass: {
            popup: "swal2-popup-custom",
            title: "swal2-title-custom",
          },
          showConfirmButton: false,
          timer: 1500,
        });
      }
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-theme">
      {otpModal && <OtpModal />}

      <div className="container py-16 pb-28 xl:pb-8 pt-32">
        <h1 className="text-white text-center text-2xl sm:text-4xl extrabold">
          Contact Us
        </h1>
        <div>
          <p className="text-white py-6">
            At Bright DiGi Gold, we value the opinion of our customers. Our
            Customer support service is here to support you if you need any
            assistance with your account or just want to provide your valuable
            feedback.
          </p>
        </div>

        <div className="w-full rounded relative md:flex justify-end">
          <div className=" md:w-2/5 bg-contact rounded-lg p-6 product001 mb-4 md:mb-0 md:absolute z-30 top-12 left-0">
            <p className="text-3xl text-white text-center text-gold01 extrabold">
              Get in Touch
            </p>
            <Card
              imageUrl="https://www.brightdigigold.com/images/telephone-call.png"
              title="CALL US"
              description="+91 9289480033"
              linkTo="tel:9289480033"
            />
            <Card
              imageUrl="https://brightdigigold.s3.ap-south-1.amazonaws.com/Mail+icon.png"
              title="MAIL US"
              description="support@brightdigigold.com"
              linkTo="mailto:support@brightdigigold.com"
            />
            <Card
              imageUrl="https://www.brightdigigold.com/images/placeholder.png"
              title="REACH US"
              description="BRIGHT DIGI GOLD PRIVATE LIMITED 501, 5th Floor, World Trade Center, Babar Road, New Delhi - 110001"
              linkTo="https://www.google.com/maps/dir//brightdigigold/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x390cfd318e5aaaab:0xf356a848ef1c91ee?sa=X&ved=2ahUKEwi4vYjQuvL_AhWNDt4KHRZlDKcQ9Rd6BAhcEAA&ved=2ahUKEwi4vYjQuvL_AhWNDt4KHRZlDKcQ9Rd6BAhkEAU"
            />
          </div>
          <div className="w-full md:w-3/4 bg-themeBlue p-6 rounded-lg md:pl-40 lg:pl-40 xl:pl-56">
            <div className=" ">
              <p className="pb-4">
                Our Team is Open to feedback and suggestions. If you wish to
                share your reviews with us, you are most welcome to do so. We
                strive to continually improve and provide the best possible
                experience for our customers.
              </p>
              <p className=" py-2">
                Thank you for choosing Bright DiGi Gold. We look forward to
                hearing from you.
              </p>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  setFieldValue,
                  handleChange,
                  setFieldError,
                  handleBlur,
                  handleSubmit,
                }: {
                  values: typeof initialValues;
                  setFieldValue: (field: string, value: any) => void;
                  handleChange: (
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => void;
                  setFieldError: (field: string, message: string) => void;
                  handleBlur: (
                    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => void;
                  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
                }) => (
                  <form
                    className="pt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="">Name</label>
                        <br />
                        <input
                          name="name"
                          type="text"
                          className="bg-contact placeholder:text-gray-500 border-2 border-gray-800 rounded-md px-4 py-3 w-full text-white"
                          placeholder="Enter Your Name"
                          value={values.name}
                          minLength={3}
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(
                              /[^A-Za-z\s]/g,
                              ""
                            );
                            setFieldValue(name, updatedValue);
                          }}
                          onBlur={(
                            event: React.FocusEvent<HTMLInputElement>
                          ) => {
                            handleBlur(event);
                          }}
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="">Email ID</label>
                        <br />
                        <input
                          name="email"
                          type="email"
                          className="bg-contact placeholder:text-gray-500 border-2 border-gray-800 rounded-md px-4 py-3 w-full text-white"
                          placeholder="Enter Your Email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="">City</label>
                        <br />
                        <input
                          name="city"
                          type="text"
                          className="bg-contact border-2 placeholder:text-gray-500 border-gray-800 rounded-md px-4 py-3 w-full text-white"
                          placeholder="Enter Your City"
                          value={values.city}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(
                              /[^A-Za-z\s]/g,
                              ""
                            );
                            setFieldValue("city", updatedValue);
                          }}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-black">Mobile No.</label>
                        <br />
                        <input
                          name="mobile"
                          type="text"
                          className="bg-contact border-2 placeholder:text-gray-500 border-gray-800 rounded-md px-4 py-3 w-full text-white"
                          minLength={10}
                          maxLength={10}
                          placeholder="Enter Your Mobile No."
                          value={values.mobile}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(/[^0-9]/g, "");
                            setFieldValue("mobile", updatedValue);
                          }}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-black">Message</label>
                        <br />
                        <textarea
                          name="message"
                          placeholder="Write Here"
                          className="bg-contact border-2 placeholder:text-gray-500 border-gray-800 rounded-md px-4 py-3 w-full text-white"
                          rows={4}
                          value={values.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="message"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-black">Attachment</label>
                        <br />
                        <div className={""}>
                          <input
                            type="file"
                            id="document"
                            className="bg-contact border-2 placeholder:text-gray-500 border-gray-800 rounded-md px-4 py-3 w-full text-white"
                            name="document"
                            title=""
                            value={""}
                            onChange={(event: any) => {
                              const file = event.currentTarget.files[0];
                              const error = validateFile(file);
                              if (!error) {
                                setFieldValue("document", file);
                                setFieldError("document", "");
                              } else {
                                setFieldValue("document", null);
                                setFieldError("document", error);
                              }
                            }}
                          />
                          {values.document && (
                            <p className={"text-black"}>
                              {values.document.name}
                            </p>
                          )}
                          {/* <p className={'text-red-500'}>{values.document ? values.document.name : "No file chosen"}</p> */}
                        </div>
                        <ErrorMessage
                          name="document"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="col-12">
                        <div className={""}>
                          <button
                            className="button text-white py-2 px-6 bg-theme cursor-pointer rounded-lg"
                            type="submit"
                            onClick={() => handleSubmit()}
                            disabled={isSubmitting}
                          >
                            SEND
                          </button>
                        </div>
                      </div>
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

export default Contacts;
