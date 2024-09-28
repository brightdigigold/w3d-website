import { fetchUserDetails, selectUser } from "@/redux/userDetailsSlice";
import React, { useState, Fragment, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  AesDecrypt,
  funForAesEncrypt,
  funcForDecrypt,
} from "@/components/helperFunctions";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "@/utils/loader";
import ProfileInput from "@/utils/profileInput";
import {
  CheckBadgeIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const KycTab = () => {
  const user = useSelector(selectUser);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [panNumber, setPanNumber] = useState<String>('');
  const dispatch = useDispatch<AppDispatch>();
  const [refresh, setrefresh] = useState(false);
  const [enteredPanNumber, setEnteredPanNumber] = useState<String>('')


  useEffect(() => {
    fetchData();
    KycData();
  }, [refresh]);



  const updateDetails = async (name: string, dob: string) => {
    const payload = {
      Name: name,
      Dob: dob,
      panNumber: enteredPanNumber.toUpperCase(),
      documentType: "PANCARD"
    };
    try {
      const token = localStorage.getItem("token");

      setIsSubmitting(true);
      const resAfterEncryptData = await funForAesEncrypt(
        payload
      );

      const payloadToSend = {
        payload: resAfterEncryptData,
      };

      const response = await axios.put(`${process.env.baseUrl}/user/autoUpdate/Kyc`, payloadToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const decryptedData = AesDecrypt(response.data.payload);

      const finalResult = JSON.parse(decryptedData);
      if (finalResult.status) {
        Swal.fire({
          html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
          width: '450px',
          padding: '4em',
          title: finalResult.message,
          showConfirmButton: false,
          timer: 3000,
        });
        KycData();
        fetchData();
        setrefresh(true);
      }
    } catch (error) {
      Swal.fire(
        'Failed!',
        'There was a problem updating your details.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleToggleDetails = () => {
    setShowDetails((prevShowDetails) => !prevShowDetails);
  };

  const KycData = async () => {
    const decryptedPan: string = await funcForDecrypt(
      user?.data?.kyc?.panNumber
    );
    setPanNumber(decryptedPan);
  };


  const fetchData = async () => {
    dispatch(fetchUserDetails());
  };


  useEffect(() => {
    if (user?.data?.kyc?.panNumber) {
      KycData();
    }
  }, [user?.data?.kyc?.panNumber, refresh]);  // Ensuring useEffect runs whenever necessary data changes


  const formik = useFormik({
    initialValues: {
      pancard_number: "",
    },
    enableReinitialize: true,
    validate(values) {
      const errors: any = {};
      // Validation of PAN number
      setEnteredPanNumber(values.pancard_number)
      if (values.pancard_number === "") {
        errors.pancard_number = "Please Enter PAN Number";
      } else if (
        !/^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/.test(
          values.pancard_number.toUpperCase()
        )
      ) {
        errors.pancard_number =
          "First 5 characters must be alphabets, Next 4 characters must be numbers, and the last 1 character must be an alphabet";
      }
      return errors;
    },

    onSubmit: async (values, { resetForm }) => {

      setIsSubmitting(true);
      try {
        let dataToBeEncryptPayload = {
          documentType: "PANCARD",
          value: values.pancard_number.toUpperCase(),
        };
        const resAfterEncryptData = await funForAesEncrypt(
          dataToBeEncryptPayload
        );

        const payloadToSend = {
          payload: resAfterEncryptData,
        };
        const formData = new FormData();
        formData.append("documentType", "PANCARD");
        // formData.append("frontImage", panCardImage);
        formData.append("value", values.pancard_number);
        formData.append("payload", payloadToSend.payload);

        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        };
        const response = await axios.post(
          `${process.env.baseUrl}/user/kyc/verify`,
          formData,
          configHeaders
        );

        const decryptedData = AesDecrypt(response.data.payload);

        const finalResult = JSON.parse(decryptedData);
        console.log("final result: ", finalResult)
        if (finalResult.status) {
          Swal.fire({
            html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
            width: '450px',
            padding: '4em',
            title: finalResult.message,
            showConfirmButton: false,
            timer: 3000,
          });
          setrefresh(true);
          KycData();
          fetchData();
        }
        resetForm();
      } catch (error: any) {
        const decryptedData = AesDecrypt(error.response.data.payload);
        const finalResult = JSON.parse(decryptedData);
        Swal.fire({
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done"><br><p>Name: ${finalResult?.data?.Name}</p>`,
          title: "Oops...",
          titleText: finalResult.message,
          showConfirmButton: finalResult.message === "Pan card number already Exist." ? false : true,
          showDenyButton: true,
          cancelButtonColor: "#d33",
          confirmButtonText: finalResult.message === "Pan card number already Exist." ? "" : "Update",
          denyButtonText: "Cancel"
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            updateDetails(finalResult?.data?.Name, finalResult?.data?.Dob);
          }
        }
        )
        // resetForm();
      } finally {
        setIsSubmitting(false);
        // resetForm();
      }
    },
  });

  return (
    <Fragment>
      {user.data.isKycDone ? (
        <div className="coins_background rounded-lg block">
          <div className="border-b p-4 flex justify-between items-center">
            <p className="text-white flex items-center">
              {" "}
              <img src="/kycprofile.png" className="h-5 inline-block pr-2" />
              KYC Status
            </p>
          </div>

          <div className="p-4">
            <div className="shadow shadow-gray-100 rounded p-3 relative text-white flex justify-between">
              <div>
                <p className="text-gray-300 flex items-center gap-1">
                  <CreditCardIcon className="h-4" /> PAN
                </p>
                <p className="my-2">
                  {showDetails ? (
                    <strong className=" extrabold text-sm sm:text-lg">
                      {panNumber}
                    </strong>
                  ) : (
                    <strong>XXXXXXXXXX</strong>
                  )}
                </p>

                <p className=" flex items-center gap-1 text-green-500">
                  <CheckBadgeIcon className="h-5" /> PAN Verified
                </p>
              </div>
              <div>
                <div
                  className="flex flex-row justify-end mr-2 items-center text-gold01 cursor-pointer"
                  onClick={handleToggleDetails}
                >
                  <p className="mr-1 cursor-pointer">
                    {showDetails ? (
                      <FaEye size={24} />
                    ) : (
                      <FaEyeSlash size={24} />
                    )}
                  </p>
                  <div>Show PAN Details</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="coins_background rounded-lg w-full p-4">
            <div className="">
              <ProfileInput
                type="text"
                label="ENTER YOUR PAN NUMBER"
                name="pancard_number"
                formik={formik}
              />
            </div>
            <div className=" flex justify-center">
              <button
                onClick={() => {
                  formik.submitForm();
                }}
                className="relative px-4 bg-themeBlue rounded py-2"
              >
                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader />
                  </div>
                )}
                <strong className={`${isSubmitting ? "invisible" : "visible"}`}>
                  VERIFY
                </strong>
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default KycTab;
