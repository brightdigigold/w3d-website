import { fetchAllUPI } from "@/api/DashboardServices";
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
  const [otherBankName, setOtherBankName] = useState<boolean>(false);
  const [bankName, setBankName] = useState();

  const fetchAllBankName = async () => {
    fetch(`${process.env.baseUrl}/public/bank/list`, {
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
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    isDefault: 1,
  };

  const validationSchema = Yup.object().shape({
    bankName: Yup.string()
      .required("Bank Name is required")
      .matches(/^[a-zA-Z\s]+$/, "Invalid Bank Name"),
    accountName: Yup.string()
      .required("Account Holders Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .matches(/^[a-zA-Z0-9\s]+$/, "Invalid Account Holder Name"),
    accountNumber: Yup.string()
      .required("Account Number is required")
      .min(9, "Account Number must be at least 9 characters")
      .max(18, "Account Number cannot exceed 18 characters"),
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
        `${process.env.baseUrl}/user/bank/account`,
        body,
        configHeaders
      );
      const decryptedData = await AesDecrypt(response.data.payload);
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
      const decryptedData = await AesDecrypt(error.response.data.payload);
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
              <label>Bank Name</label>
              <br />
              <select
                className="mt-3 block w-full text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1  pl-0 focus:ring-0 focus:border-b"
                name="bankName"
                value={bankName}
                onChange={(data) => {
                  // log('data', data.target.value);
                  setFieldValue("bankName", data.target.value);
                  if (data.target.value == "Others") {
                    setOtherBankName(true);
                  } else {
                    setOtherBankName(false);
                  }
                }}
                onBlur={handleBlur}
              >
                <option value="" selected disabled>
                  Select Bank Name
                </option>
                {bankList.map((item, key) => {
                  return (
                    <>
                      <option
                        className="text-black"
                        key={item._id}
                        value={item.name}
                        // onChange={setBankName(item.name)}
                      >
                        {item.name}
                      </option>
                    </>
                  );
                })}
                ;
              </select>
              {!otherBankName && (
                <ErrorMessage
                  name="bankName"
                  className="text-red-500"
                  component="div"
                />
              )}
            </div>
            {otherBankName && (
              <div className="mt-2">
                <label>Bank Name</label>
                <br />
                <input
                  className="mt-3 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1 focus:ring-0 focus:border-b"
                  name="bankName"
                  type="text"
                  placeholder="Enter Bank Name"
                  value={values.bankName === "Others" ? "" : values.bankName}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    const updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
                    setFieldValue("bankName", updatedValue);
                  }}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="bankName"
                  className="text-red-500"
                  component="div"
                />
              </div>
            )}
            <div className="mt-2">
              <label>Account Holder’s Name</label>
              <br />
              <input
                className="mt-3 block w-full placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1 focus:ring-0 focus:border-b"
                name="accountName"
                type="text"
                placeholder="Enter Your Name"
                maxLength={50}
                value={values.accountName}
                onChange={(event) => {
                  const { name, value } = event.target;
                  const updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
                  setFieldValue("accountName", updatedValue);
                }}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="accountName"
                className="text-red-500"
                component="div"
              />
            </div>
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
              <button
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="px-3 py-1 rounded bg-themeBlue font-semibold text-black"
              >
                Verify
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddNewBank;
