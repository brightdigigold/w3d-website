import { fetchAllUPI } from "@/api/DashboardServices";
import CustomButton from "@/components/customButton";
import {
  AesDecrypt,
  AesEncrypt,
  funcForDecrypt,
} from "@/components/helperFunctions";
import axios from "axios";
import { ErrorMessage, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

const AddNewBank = ({ toggleBankVerificationHandler }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankList, setBankList] = useState<any[]>([]);
  const [checkingBankStatus, setCheckingBankStatus] = useState<boolean>();

  const fetchAllBankName = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/bank/list`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);
        let decryptedDataList = JSON.parse(decryptedData).data;
        setBankList(decryptedDataList);
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    fetchAllBankName();
  }, []);

  const initialValues = {
    accountNumber: "",
    ConfirmAccountNumber: "",
    ifsc: "",
    isDefault: 1,
  };

  const validationSchema = Yup.object().shape({
    accountNumber: Yup.string()
      .required("Account Number is required")
      .min(9, "Account Number must be at least 9 characters")
      .max(18, "Account Number cannot exceed 18 characters"),
    ConfirmAccountNumber: Yup.string()
      .oneOf([Yup.ref('accountNumber')], 'Account Numbers must match')
      .required('Confirm Account Number is required'),
    ifsc: Yup.string()
      .required("IFSC Number is required")
      .min(11, "IFSC code must be at least 11 characters")
      .max(11, "IFSC code cannot exceed 11 characters")
      .matches(/^[a-zA-Z0-9]+$/, "Invalid IFSC code"),
  });
  const onSubmit = async (values: any, { resetForm }: any) => {
    //
    setIsSubmitting(true);
    try {
      // Notiflix.Loading.custom({svgSize:'180px',customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>'});
      const resAfterEncrypt = await AesEncrypt(values);
      const body = {
        payload: resAfterEncrypt,
      };
      const token = localStorage.getItem("token");
      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          // onUploadProgress: Notiflix.Loading.circle(),
        },
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/bank/account`,
        body,
        configHeaders
      );
      const decryptedData = AesDecrypt(response.data.payload);
      const finalResult = JSON.parse(decryptedData);
      if (finalResult.status) {
        setCheckingBankStatus(true);
        // Notiflix.Loading.remove();
        Swal.fire({
          html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
          width: "450px",
          padding: "4em",
          title: finalResult.message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      await fetchAllUPI();
      toggleBankVerificationHandler();
    } catch (error: any) {
      // Notiflix.Loading.remove();
      const decryptedData = AesDecrypt(error.response.data.payload);
      const finalResult = JSON.parse(decryptedData);
      console.error(error);
      Swal.fire({
        html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
        title: finalResult.message,
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="coins_background  p-4 rounded-bl rounded-br mb-4">
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
        }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="mt-2">
              <label>Account Number</label>
              <br />
              <input
                className="mt-3 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1  focus:ring-0 focus:border-b"
                name="accountNumber"
                type="text"
                placeholder="Enter Your Account Number"
                maxLength={18}
                value={values.accountNumber}
                onChange={(event) => {
                  const { name, value } = event.target;
                  const updatedValue = value.replace(/[^0-9]/g, "");
                  setFieldValue("accountNumber", updatedValue);
                }}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="accountNumber"
                className="text-red-500"
                component="div"
              />
            </div>
            <div className="mt-2">
              <label>Confirm Account Number</label>
              <br />
              <input
                className="mt-3 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1  focus:ring-0 focus:border-b"
                name="ConfirmAccountNumber"
                type="password"
                placeholder="Enter Your Account Number"
                maxLength={18}
                value={values.ConfirmAccountNumber}
                onChange={(event) => {
                  const { name, value } = event.target;
                  const updatedValue = value.replace(/[^0-9]/g, "");
                  setFieldValue("ConfirmAccountNumber", updatedValue);
                }}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="ConfirmAccountNumber"
                className="text-red-500"
                component="div"
              />
            </div>
            <div className="mt-2">
              <label>IFSC</label>
              <br />
              <input
                className="mt-3 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1 focus:ring-0 focus:border-b"
                name="ifsc"
                type="text"
                placeholder="Enter Your IFSC Code"
                value={values.ifsc}
                maxLength={11}
                onChange={(event) => {
                  const { name, value } = event.target;
                  const updatedValue = value.replace(/[^a-zA-Z0-9]/g, "");
                  setFieldValue("ifsc", updatedValue);
                }}
                onBlur={handleBlur}
                style={{ textTransform: "uppercase" }}
              />
              <ErrorMessage
                name="ifsc"
                className="text-red-500"
                component="div"
              />
            </div>

            <div className="flex justify-center mt-3">
              <CustomButton
                btnType="submit"
                title="Verify"
                handleClick={() => {
                  handleSubmit();
                }}
                loading={isSubmitting}
                isDisabled={isSubmitting}
                containerStyles="px-3 py-1 rounded bg-themeBlue font-semibold text-black"
              />
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddNewBank;
