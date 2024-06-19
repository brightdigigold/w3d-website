"use client";
import React, { useEffect, useState } from "react";
import {
  setEnteredAmount,
  setMetalPrice,
  setMetalType,
  setTransactionType,
} from "@/redux/giftSlice";
import {
  AesDecrypt,
  AesEncrypt,
  ParseFloat,
} from "@/components/helperFunctions";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Formik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import * as Yup from "yup";
import OtpModal from "./otpModal";
import GiftFaq from "./giftFaq";
import Redeem from "./giftSentOrReedem";
import {
  fetchWalletData,
  selectGoldVaultBalance,
  selectSilverVaultBalance,
} from "@/redux/vaultSlice";
import mixpanel from "mixpanel-browser";

const GiftTab = () => {
  const dispatch = useDispatch();
  const [isgold, setIsGold] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string>("");
  const [activeTab, setactiveTab] = useState<string>("rupees");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [otpModalShow, setOtpModalShow] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [mobile, setMobile] = useState<number>();
  const [enterMsg, setEnterMsg] = useState<string>();
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const goldVaultBalance = useSelector(selectGoldVaultBalance);
  const silverVaultBalance = useSelector(selectSilverVaultBalance);

  const metalType = useSelector((state: RootState) => state.gift.metalType);
  const goldData = useSelector((state: RootState) => state.gold);
  const silverData = useSelector((state: RootState) => state.silver);
  const totalAmount = useSelector((state: RootState) => state.gift.totalAmount);
  const metalQuantity = useSelector((state: RootState) => state.gift.metalQuantity);
  const transactionType = useSelector((state: RootState) => state.gift.transactionType);
  const enteredAmount = useSelector((state: RootState) => state.gift.enteredAmount);
  const actualAmount = useSelector((state: RootState) => state.gift.actualAmount);

  useEffect(() => {
    dispatch(setMetalType("gold"));
    dispatch(setEnteredAmount(0));
    dispatch(setTransactionType("rupees"));
  }, []);

  const toggleMetal = () => {
    setIsGold(!isgold);
    dispatch(setMetalType(!isgold ? "gold" : "silver"));
    dispatch(setEnteredAmount(0));
    setValidationError("");
  };

  useEffect(() => {
    if (isgold) {
      dispatch(setMetalPrice(goldData.salePrice));
    } else {
      dispatch(setMetalPrice(silverData.salePrice));
    }
  }, [isgold, activeTab, toggleMetal]);

  const handleTabRupeesAndGrams = (tab: "rupees" | "grams") => {
    setactiveTab(tab);
    dispatch(setTransactionType(tab));
    dispatch(setEnteredAmount(tab === "rupees" ? totalAmount : metalQuantity));
    setValidationError("");
  };

  const handleEnteredAmountChanges = (e: any) => {
    e.preventDefault();
    setactiveTab("rupees");
    dispatch(setTransactionType("rupees"));
    const enteredValue = ParseFloat(e.target.value, 4);
    setValidationError("");
    if (metalType === "gold") {
      if (activeTab === "rupees") {
        if (enteredValue > 5 * goldData.salePrice) {
          setValidationError(
            `We appreciate your trust to Gift  ${metalType} on our platform, but our current limit for gifting is ₹${5 * goldData.salePrice
            } only. Please change the amount.`
          );
          return;
        } else {
          dispatch(setEnteredAmount(+enteredValue));
        }
      }
    } else {
      if (activeTab === "rupees") {
        if (enteredValue > 50 * silverData.salePrice) {
          setValidationError(
            `We appreciate your trust to Gift  ${metalType} on our platform, but our current limit for gifting is ₹${50 * silverData.salePrice
            } only. Please change the amount.`
          );
          return;
        } else {
          dispatch(setEnteredAmount(+enteredValue));
        }
      }
    }
  };

  const handleEnteredAmountChangeGrams = (e: any) => {
    e.preventDefault();
    setactiveTab("grams");
    dispatch(setTransactionType("grams"));
    const enteredValue = ParseFloat(e.target.value, 4);
    setValidationError("");
    if (metalType === "gold") {
      if (activeTab === "grams") {
        if (Number(e.target.value) > 5) {
          setValidationError(
            `We appreciate your trust to Gift  ${metalType} on our platform, but our current limit for gifting is 5gm only. Please change the amount.`
          );
          return;
        } else {
          dispatch(setEnteredAmount(+enteredValue));
        }
      }
    } else {
      if (activeTab === "grams") {
        if (Number(e.target.value) > 50) {
          setValidationError(
            `We appreciate your trust to Gift  ${metalType} on our platform, but our current limit for gifting is 50gm only. Please change the amount.`
          );
          return;
        } else {
          dispatch(setEnteredAmount(+enteredValue));
        }
      }
    }
  };

  const QuickGiftButtons = ({ amounts, unit, onClickHandler }: any) => (
    <div className="mt-4 flex justify-between">
      {amounts.map((amount: number) => (
        <button
          key={amount}
          onClick={() => {
            dispatch(setEnteredAmount(amount));
          }}
          className="bg-themeLight001 border border-blue-200 rounded-md py-1 px-4 text-white text-sm"
        >
          {unit === "rupees" ? `₹${amount}` : `${amount}gm`}
        </button>
      ))}
    </div>
  );

  const initialValues = {
    giftedUsers: "",
    textMsg: "",
  };
  const validationSchema = Yup.object().shape({
    giftedUsers: Yup.string()
      .required("Enter Mobile Number")
      .matches(/^[6789][0-9]{9}$/, "Mobile number is not valid")
      .min(10, "Please enter 10-digit mobile number")
      .max(10, "too long"),
    textMsg: Yup.string().max(500, "too long msg"),
  });

  const onSubmit = async (
    values: { giftedUsers: any; textMsg: any },
    { resetForm }: any
  ) => {
    if (!enteredAmount) {
      setValidationError("Please enter amount");
      return;
    } else if (actualAmount < 10) {
      setValidationError("Minimum gifting amount is Rs.10");
      return;
    }

    if (
      validationError == "" &&
      metalQuantity !== undefined &&
      metalQuantity > 0
    ) {
      setSubmitting(true);
      const data = {
        itemType: metalType.toUpperCase(),
        unitType: "GRAMS",
        quantity: metalQuantity,
        giftedUsers: values.giftedUsers,
        customMessage: values.textMsg,
      };
      try {
        const resAfterEncryptData = AesEncrypt(data);
        const body = {
          payload: resAfterEncryptData,
        };

        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.post(
          `${process.env.baseUrl}/user/gifting/verify`,
          body,
          configHeaders
        );
        const decryptedData = await AesDecrypt(response.data.payload);
        const result = JSON.parse(decryptedData);
        if (result.status) {
          setOtpModalShow(true);
        }
      } catch (error: any) {
        const decryptedData = await AesDecrypt(error.response.data.payload);

        const result = JSON.parse(decryptedData);
        Swal.fire({
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          title: "Error",
          titleText: result.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setSubmitting(false);
        resetForm();
      }
    } else {
      // log("gramError or rupeeError is there");
      // setCommonError("Please enter Rs. or Grams");
    }
  };

  function handleOTPChange(otp: React.SetStateAction<string>) {
    setOtp(otp);
    setOtpError("");
  }

  const onSubmitVerify = async (e: { preventDefault: () => void }) => {
    if (otp === "") {
      setOtpError("Please enter the OTP");
    } else if (validationError == "" && metalQuantity > 0) {
      setSubmitting(true);
      const data = {
        itemType: metalType.toUpperCase(),
        unitType: "GRAMS",
        quantity: metalQuantity,
        giftedUsers: mobile,
        customMessage: enterMsg,
        otp: otp,
      };

      try {
        const resAfterEncryptData = await AesEncrypt(data);
        const body = {
          payload: resAfterEncryptData,
        };
        const token = localStorage.getItem("token");
        const configHeaders = {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.post(
          `${process.env.baseUrl}/user/gifting`,
          body,
          configHeaders
        );
        const decryptedData = await AesDecrypt(response.data.payload);
        const result = JSON.parse(decryptedData);

        if (result.status) {
          setOtpModalShow(false);
          setOtp("");
          setOtpError("");
          mixpanel.track('Gift Sent (web) ', {
            "transaction_Type": transactionType,
            "metal_Quantity": metalQuantity,
            "metal_Type": metalType,
            "amount": totalAmount,
            "Gift Sent to": mobile,
          });
          dispatch(setEnteredAmount(0));
          dispatch(fetchWalletData() as any);
          setRefresh(true);
          Swal.fire({
            html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
            title: "Gift has been sent successfully",
            width: "500px",
            padding: "4em",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error: any) {
        // setOtpModalShow(false);
        dispatch(setEnteredAmount(0));
        const decryptedData = await AesDecrypt(error?.response?.data?.payload);
        const result = JSON.parse(decryptedData);
        setOtpError(result.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full ">
      <OtpModal
        isOpen={otpModalShow}
        onClose={() => {
          setOtpModalShow(false);
          setOtp("");
          setOtpError("");
        }}
        onSubmitVerify={onSubmitVerify}
        handleOTPChange={handleOTPChange}
        otp={otp}
        otpError={otpError}
        isSubmitting={isSubmitting}
      />
      <div className="rounded-lg bg-themeLight">
        <p className="text-center text-gold01 pt-4 extrabold text-2xl sm:text-4xl">
          Gift
        </p>
        <div className=" p-4 items-center  text-white grid lg:grid-cols-2 gap-6">
          <div className=" hidden lg:block">
            <img alt="gold-logo" className="p-4" src="/lottie/gift.gif" />
          </div>
          <div>
            {/* gifting section */}
            <div className="grid grid-cols-2 items-center py-4">
              <div
                onClick={toggleMetal}
                className={`flex justify-center text-center py-3 rounded bold cursor-pointer ${isgold === true
                  ? "bg-themeBlue extrabold active text-black"
                  : "bg-themeLight01 text-white"
                  }`}
              >
                <img
                  src={"/Goldbarbanner.png"}
                  alt="digital gold"
                  className={`mr-2 cursor-pointer h-5 sm:h-6 ${isgold === true ? "opacity-100" : "opacity-50"
                    }`}
                />
                <p className="text-sm sm:text-base">Gold</p>
              </div>
              <div
                onClick={toggleMetal}
                className={`flex justify-center text-center py-3 rounded bold cursor-pointer ${isgold === false
                  ? "bg-themeBlue text-black extrabold  active"
                  : "bg-themeLight01 text-white"
                  }`}
              >
                <img
                  src={"/Silverbar.png"}
                  alt="digital gold"
                  className={`mr-2 cursor-pointer h-5 sm:h-6 ${isgold === false ? "opacity-100" : "opacity-50"
                    }`}
                />
                <p className="text-sm sm:text-base">Silver</p>
              </div>
            </div>
            {/* vault Balance */}
            <div className="flex justify-between items-center bg-themeLight px-4 p-2 rounded-md mt-4">
              <div className="flex items-center">
                <img
                  src="/giftbucket.png"
                  className="mr-2 h-5 sm:h-8"
                  alt="digital gold gift"
                />
                <div className="text-sm sm:text-lg bold sm:flex items-center">
                  <p className="text-sm sm:text-lg mr-2 ">Gift</p>
                  {isgold ? (
                    <p className="text-gold01">Gold</p>
                  ) : (
                    <p className="text-white">Silver</p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-end">
                  <div>
                    {isgold ? (
                      <img
                        src="/Goldbarbanner.png"
                        className="mr-2 h-4 sm:h-6"
                        alt="digital gold gift"
                      />
                    ) : (
                      <img
                        src="/Silverbar.png"
                        className="mr-2 h-4 sm:h-6"
                        alt="digital gold gift"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm">Weight</p>
                    {isgold ? (
                      <p>{goldVaultBalance} gm</p>
                    ) : (
                      <p>{silverVaultBalance} gm</p>
                    )}
                  </div>
                  <img
                    src="/lottie/New Web Vault.gif"
                    className="h-8 sm:h-14 ml-2 sm:ml-4"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col pt-8 ">
              <div className="flex items-center justify-center ">
                <div className="flex justify-around border-1 bg-themeLight rounded mx-auto w-4/5 lg:w-3/4">
                  <div
                    className={`text-center text-xxs w-1/2 sm:text-sm px-2 sm:px-9 py-2 rounded-tl rounded-bl bold cursor-pointer ${activeTab === "rupees"
                      ? "bg-transparent text-black bg-themeBlue active extrabold"
                      : "text-white "
                      }`}
                    onClick={() => handleTabRupeesAndGrams("rupees")}
                  >
                    {activeTab === "buy" ? " In Rupees" : " In Rupees"}
                  </div>
                  <div
                    className={`text-center text-xxs w-1/2 sm:text-sm px-2 sm:px-9 py-2 rounded-tr rounded-br bold cursor-pointer ${activeTab === "grams"
                      ? "bg-transparent text-black bg-themeBlue active extrabold"
                      : "text-white "
                      }`}
                    onClick={() => handleTabRupeesAndGrams("grams")}
                  >
                    {activeTab === "buy" ? "In Grams" : "In Grams"}
                  </div>
                </div>
              </div>
              <div className="pt-2 mt-2 grid grid-cols-2 items-center gap-6 border-1 extrabold p-1 rounded-lg">
                <div className="relative rounded-md shadow-sm">
                  <div
                    className={`pointer-events-none absolute text-gray-400  inset-y-0 left-0 flex items-center ${activeTab === "rupees" ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl"
                      }`}
                  >
                    ₹
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    className={`bg-transparent  pl-7 py-1 focus:outline-none text-gray-100 w-full ${activeTab === "rupees" ? "text-2xl sm:text-3xl" : "text-sm sm:text-xl"
                      }`}
                    placeholder="0000"
                    onClick={() => handleTabRupeesAndGrams("rupees")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleEnteredAmountChanges(e) }}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.preventDefault() }}
                    onScroll={(e: React.UIEvent<HTMLElement>) => { e.preventDefault() }}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) => { e.preventDefault() }}
                    min={10}
                    step="0.0001"
                    value={
                      activeTab === "rupees"
                        ? enteredAmount === 0
                          ? ""
                          : enteredAmount
                        : totalAmount
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      // Prevent the input of a decimal point if purchase type is rupees
                      if (activeTab === "rupees" && e.key === ".") {
                        e.preventDefault();
                      }
                      // Prevent entering negative values
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault(); // Prevent the default action
                      }
                    }}
                  />
                </div>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0.0000"
                    onClick={() => handleTabRupeesAndGrams("grams")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEnteredAmountChangeGrams(e)}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.preventDefault() }}
                    onScroll={(e: React.UIEvent<HTMLElement>) => { e.preventDefault() }}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) => { e.preventDefault() }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                      }
                    }}
                    className={`bg-transparent w-full pr-14 py-1  focus:outline-none text-gray-100 text-right ${activeTab === "grams" ? "text-2xl sm:text-3xl" : "text-sm sm:text-xl"
                      }`}
                    value={
                      activeTab === "grams" ? enteredAmount : metalQuantity
                    }
                  // readOnly
                  />
                  <div
                    className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 ${activeTab === "grams" ? "text-sm sm:text-2xl" : "text-xs sm:text-xl"
                      }`}
                  >
                    gm
                  </div>
                </div>
              </div>
              {validationError ? (
                <span className="text-red-500 text-sm">{validationError}</span>
              ) : (
                ""
              )}
              <p className="mt-3 text-lg pt-3">Quick Gift</p>
              {transactionType === "rupees" ? (
                <QuickGiftButtons
                  amounts={[50, 100, 500, 1000]}
                  unit="rupees"
                />
              ) : (
                <QuickGiftButtons amounts={[0.2, 0.5, 1, 2]} unit="gm" />
              )}
              <div className="mt-6">
                <p className="text-lg">Add a Personalized Message</p>
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
                      className="pt-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <div className="">
                        <input
                          name="textMsg"
                          type="text"
                          // minLength={10}
                          maxLength={500}
                          placeholder="Type your message here "
                          value={values.textMsg}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            setFieldValue("textMsg", value);
                            setEnterMsg(value);
                          }}
                          className="text-white text-lg p-2 px-4 rounded-lg bg-theme border-1 w-full focus:outline-none focus:bg-transparent outline-none"
                        />
                        <ErrorMessage
                          name="giftedUsers"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <p className="text-lg mt-2">Send to</p>
                      <div className="">
                        <input
                          name="giftedUsers"
                          type="tel"
                          minLength={10}
                          maxLength={10}
                          placeholder="Enter Mobile Number"
                          value={values.giftedUsers}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(/[^0-9]/g, "");
                            setFieldValue("giftedUsers", updatedValue);
                            setMobile(+updatedValue);
                          }}
                          className="text-white text-lg p-2 px-4 rounded-lg bg-theme border-1 w-full focus:outline-none focus:bg-transparent outline-none"
                        />
                        <ErrorMessage
                          name="giftedUsers"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div
                        onClick={() => handleSubmit()}
                        className="rounded-md items-center justify-center text-center bg-themeBlue text-black bold mt-6 cursor-pointer"
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="p-2"
                        >
                          SEND GIFT
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* redeem part */}
      <div className="mt-4">
        <Redeem refreshOnGiftSent={refresh} />
      </div>
      {/* faq part */}
      <div className="mt-4">
        <GiftFaq />
      </div>
    </div>
  );
};

export default GiftTab;
