import { AppDispatch } from "@/redux/store";
import { fetchUserDetails, selectUser } from "@/redux/userDetailsSlice";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  AesDecrypt,
  AesEncrypt,
  funForAesEncrypt,
  funcForDecrypt,
} from "@/components/helperFunctions";
import axios from "axios";
import Swal from "sweetalert2";
import ProfileInput from "@/utils/profileInput";
import Loading from "@/app/loading";

const EditProfile = ({ onSaveDetails, onCancel }: any) => {
  const user = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUserDetails());
    };

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
            // icon: "success",
            html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
            width: '450px', 
            padding: '4em',
            title: finalResult.message,
            showConfirmButton: false,
            timer: 1500,
          });
          resetForm();
          onSaveDetails();
        }
      } catch (error: any) {
        const decryptedData = AesDecrypt(error.response.data.payload);
        const finalResult = JSON.parse(decryptedData);
        console.error(error);
        Swal.fire({
          // icon: "error",
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,

          title: "Oops...",
          titleText: finalResult.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setIsSubmitting(false);

        setOpen(true);
      }
    },
  });

  const verifyGst = async (gst_number: string) => {
    const dataToBeDecrypt = {
      value: gst_number,
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
      },
    };

    axios
      .post(
        `${process.env.baseUrl}/user/kyc/gst/verify`,
        payloadToSend,
        configHeaders
      )
      .then(async (resAfterVerfiyGst) => {
        const decryptedData = await funcForDecrypt(
          resAfterVerfiyGst.data.payload
        );
        let decodedData = JSON.parse(decryptedData);
        if (decodedData.status) {
          // setIsGstVerified(true);
          // setErrorMess("");
        }
      })
      .catch(async (errInGst) => {
        const decryptedData = await funcForDecrypt(
          errInGst.response.data.payload
        );
        let response = JSON.parse(decryptedData);

        if (JSON.parse(decryptedData).code == 400) {
          Swal.fire({
            // icon: "error",
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,

            title: "Oops...",
            titleText: JSON.parse(decryptedData).message,
          });
        }
      });
  };

  return (
    <div className="w-full relative">
      {isSubmitting && <Loading />}
      <div className=" absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none">
        {/* <FaTimes
          onClick={onSaveDetails}
          className="cursor-pointer text-themeBlueLight"
          size={20}
        /> */}
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
        readonly={true}
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

      {/* <ProfileInput
                type="text"
                label="GST Number"
                name="gst_number"
                placeholder="Enter GST Number"
                formik={formik}
            /> */}
      <div className="flex justify-center">
        <button
          className="font-semibold py-2 bg-themeBlue rounded px-3 text-center inline-block"
          onClick={() => {
            // verifyGst(formik.values.gst_number);
            formik.submitForm();
            setOpen(false);
          }}
        >
          Save Details++++
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
