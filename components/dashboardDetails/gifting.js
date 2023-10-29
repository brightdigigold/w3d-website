import React, { useState, useEffect } from "react";
import style from "./dashboardDetails.module.css";
import Image from "next/image";
import axios from "axios";
import { useFormik } from "formik";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AesEncrypt, AesDecrypt, fixDecimalDigit } from "../middleware";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import OTPInput from "react-otp-input";
import { log } from "../logger";
import styleotp from "../loginAside/loginAside.module.css";
import { IoMdClose } from "react-icons/io";

const Gifting = () => {
  const [handelItemValue, setHandelItemValue] = useState("GOLD");
  const [rupeeIn, setRupeeIn] = useState("");
  const [rupeeInComplete, setRupeeInComplete] = useState("");
  const [gramIn, setGramIn] = useState("");
  const [gramInComplete, setGramInComplete] = useState("");
  const [giftUnitType, setGiftUnitType] = useState("GRAMS");
  const [giftedUsers, setGiftedUsers] = useState("");

  const [handelItemValueError, setHandelItemValueError] = useState("");
  const [rupeeInError, setRupeeInError] = useState("");
  const [commonError, setCommonError] = useState("");
  const [giftedUserError, setGiftedUserError] = useState("");
  const [goldPrice, setGoldPrice] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [couponCode, setCouponsCode] = useState("");
  const [sellGoldPrice, setSellGoldPrice] = useState("");
  const [sellSilverPrice, setSellSilverPrice] = useState("");
  const [userWallet, setUserWallet] = useState({});
  const [walletSellGold, setWalletSellGold] = useState("");
  const [walletSellSilver, setWalletSellSilver] = useState("");
  const [userMetalGram, setUserMetalGram] = useState("1.6");
  const [giftError, setGiftError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [otpModalShow, setOtpModalShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [mobile, setMobile] = useState("");
  const handleValue = (e) => {
    setHandelItemValue(e.target.value);
    setRupeeIn("");
    setRupeeInComplete("");
    setGramIn("");
    setGramInComplete("");
    setCommonError("");
    //
  };
  const funcForDecrypt = async (dataToBeDecrypt) => {
    const response = await AesDecrypt(dataToBeDecrypt);
    //
    return response;
  };
  const funForAesEncrypt = async (dataToBeEncrypt) => {
    const response = await AesEncrypt(dataToBeEncrypt);
    //
    return response;
  };


  const handleRupeeAndGramValue = (newVal, type) => {
    setGiftUnitType(type);

    if (type == "AMOUNT") {
      let newRupee = +rupeeIn + +newVal;

      setRupeeIn(newRupee);
      setRupeeInComplete(newRupee);
    } else {
      setRupeeIn("");
      setRupeeInComplete("");

      let newGram = +gramIn + +newVal;
      setGramIn(newGram);
      setGramInComplete(newGram);
    }
  };
  useEffect(() => {
    updateMetalPrice();
    walletApiSell();
  }, []);
  const walletApiSell = () => {
    const token = localStorage.getItem("token");
    let isOn;
    if (handelItemValue == "GOLD") {
      isOn = true;
    } else {
      isOn = false;
    }

    fetch(`${process.env.baseUrl}/user/vault`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);
        // log("🚀 ~ file: gifting.js:92 ~ .then ~ data:", data)

        let userWallet = JSON.parse(decryptedData).data;
        log("🚀 ~ file: gifting.js:95 ~ .then ~ userWallet:", userWallet)

        let goldWallet = userWallet.gold * sellGoldPrice;
        log("🚀 ~ file: gifting.js:98 ~ .then ~ goldWallet:", goldWallet)

        let silverWallet = userWallet.silver * sellSilverPrice;

        if (isOn) {
          if (goldWallet && goldWallet > 0) {
            // setSellEnabled(true);
          }
        } else {
          if (silverWallet && silverWallet > 0) {
            // setSellEnabled(true);
          }
        }
        setUserWallet(userWallet);
        // setWalletSellGold(goldWallet);
        // setWalletSellSilver(silverWallet);
      })
      .catch((error) => console.error(error));
    // log("🚀 ~ file: gifting.js:112 ~ .then ~ setUserWallet:", setUserWallet)
  };

  const initialValues = {
    // gift: '',
    // gift_money: "",
    giftedUsers: "",
  };
  const validationSchema = Yup.object().shape({
    // gift: Yup.string().required("Metal Type Required"),
    // gift_money: Yup.string().required("Phone no. is required"),
    giftedUsers: Yup.string()
      .required("Enter Mobile Number")
      .matches(/^[6789][0-9]{9}$/, "Mobile No. is not valid")
      .min(10, "Please enter 10 digit mobile number")
      .max(10, "too long"),
  });
  const onSubmit = async (values, { resetForm }) => {
    if (commonError == "" && gramInComplete > 0) {
      setSubmitting(true);
      setOtp("");
      const data = {
        itemType: handelItemValue,
        unitType: giftUnitType,
        quantity: gramInComplete,
        giftedUsers: values.giftedUsers
      };
      // e.preventDefault();
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
          `${process.env.baseUrl}/user/gifting/verify`,
          body,
          configHeaders
        );
        //
        const decryptedData = await AesDecrypt(response.data.payload);

        const result = JSON.parse(decryptedData);

        if (result.status) {
          setOtpModalShow(true);
          // walletApiSell()
          // Swal.fire({
          //   position: "centre",
          //   icon: "success",
          //   title: result.message,
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
          // setGramIn("");
          // setGramInComplete("");
          // setRupeeIn("");
          // setRupeeInComplete("");
          // resetForm();
        }
      } catch (error) {
        const decryptedData = await AesDecrypt(error.response.data.payload);

        const result = JSON.parse(decryptedData);
        Swal.fire({
          position: "centre",
          icon: "error",
          title: "Error",
          text: result.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      // log("gramError or rupeeError is there");
      // setCommonError("Please enter Rs. or Grams");
    }
  };

  const onSubmitVerify = async (e) => {
    e.preventDefault();
    if (otp === '') {
      setOtpError("Please Fill the OTP");
    } else if (commonError == "" && gramInComplete > 0) {
      setSubmitting(true);
      const data = {
        itemType: handelItemValue,
        unitType: giftUnitType,
        quantity: gramInComplete,
        giftedUsers: mobile,
        otp: otp
      };
      e.preventDefault();
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
        //
        const decryptedData = await AesDecrypt(response.data.payload);

        const result = JSON.parse(decryptedData);

        if (result.status) {
          setOtpModalShow(false);
          walletApiSell()
          Swal.fire({
            position: "centre",
            icon: "success",
            title: result.message,
            showConfirmButton: false,
            timer: 1500,
          });
          setGramIn("");
          setGramInComplete("");
          setRupeeIn("");
          setRupeeInComplete("");
          resetForm();
        }
      } catch (error) {
        setOtpModalShow(false);
        const decryptedData = await AesDecrypt(error?.response?.data?.payload);
        const result = JSON.parse(decryptedData);
        Swal.fire({
          position: "centre",
          icon: "error",
          title: "Error",
          text: result.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setSubmitting(false);
      }
    } 
  };

  function handleOTPChange(otp) {
    setOtp(otp);
    setOtpError('')
  }


  const [rupeeError, setRupeeError] = useState("");
  const [gramError, setGramErrorr] = useState("");

  const updateMetalPrice = () => {
    fetch(`${process.env.baseUrl}/public/metal/price`, {
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);
        setSellGoldPrice(JSON.parse(decryptedData).data.gold[0].salePrice);
        setSellSilverPrice(JSON.parse(decryptedData).data.silver[0].salePrice);
        if (gramIn) {
          if (isOn) {
            let rupeeCalcForGold =
              +gramIn * +JSON.parse(decryptedData).data.gold[0].totalPrice;

            let finalRupeeCalcForGold = rupeeCalcForGold * +"1.03";

            setRupeeIn(finalRupeeCalcForGold);
            setRupeeInComplete(finalRupeeCalcForGold);
          } else {
            let rupeeCalcForGold =
              +gramIn * +JSON.parse(decryptedData).data.silver[0].totalPrice;

            let finalRupeeCalcForGold = rupeeCalcForGold * +"1.03";

            setRupeeIn(finalRupeeCalcForGold);
            setRupeeInComplete(finalRupeeCalcForGold);
          }
        }
      })
      .catch((error) => console.error(error));
  };

  const enterRupeeHandlerForSell = (e) => {
    let isOn;
    if (handelItemValue == "GOLD") {
      isOn = true;
    } else {
      isOn = false;
    }
    const { name, value } = e.target;
    const updatedValue = value.replace(/[^0-9]/g, '');
    let val = updatedValue;
    if (e.target.value == "") {
      setGramIn("");
      setGramInComplete("");
      setRupeeIn("");
      setRupeeInComplete("");
      setRupeeError("");
      setCommonError("");
      setGramErrorr("");
    } else {

      log('sadasd', val);
      if (!val || val.match(/^\d{1,}(\.\d{0,2})?$/)) {
        log('ewre', val);
        setRupeeIn(val);
        setRupeeInComplete(val);
        let finalVal = val;
        if (
          isOn &&
          userWallet &&
          val > 9.99 &&
          finalVal < userWallet.gold * sellGoldPrice
        ) {
          log('a');
          let grmCalcForGold = finalVal / sellGoldPrice;
          log("grmCalcForGold : ", grmCalcForGold);
          if (grmCalcForGold > 5) {
            setCommonError("You cant gift more than 5 gm of gold");
            setGramIn(fixDecimalDigit(grmCalcForGold, 4));
            setGramInComplete(grmCalcForGold);
          } else {
            setGramIn(fixDecimalDigit(grmCalcForGold, 4));
            setGramInComplete(grmCalcForGold);
            setGramErrorr("");
            setRupeeError("");
            setCommonError("");
          }
        } else if (
          isOn == false &&
          val > 9.99 &&
          finalVal < userWallet.silver * sellSilverPrice
        ) {
          log('b');
          let grmCalcForSilver = finalVal / sellSilverPrice;

          if (grmCalcForSilver > 100) {
            setCommonError("You cant gift more than 100 gm of silver");
            setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
            setGramInComplete(grmCalcForSilver);
          } else {
            setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
            setGramInComplete(grmCalcForSilver);
            setGramErrorr("");
            setRupeeError("");
            setCommonError("");
          }
        } else if (finalVal <= 9.99) {
          log('c');
          log('finalVal', finalVal);
          let grmCalcFor = 0;
          if (isOn) {
            grmCalcFor = finalVal / sellGoldPrice;
          } else {
            grmCalcFor = finalVal / sellSilverPrice;
          }
          setGramIn(fixDecimalDigit(grmCalcFor, 4));
          setGramInComplete(grmCalcFor);
          // setRupeeError("Please Enter Atleast Amount 10")
          setCommonError("Please enter atleast ₹10");
        } else if (isOn && userWallet && finalVal > userWallet.gold * sellGoldPrice) {
          let grmCalcForGold = finalVal / sellGoldPrice;
          setGramIn(fixDecimalDigit(grmCalcForGold, 4));
          setGramInComplete(grmCalcForGold);
          setCommonError(`You can't gift more than ${userWallet.gold} gm`)
          // setCommonError("You can't gift more than 2 grm of gold");
        } else if (isOn == false && finalVal > userWallet.silver * sellSilverPrice) {
          let grmCalcForSilver = finalVal / sellSilverPrice;
          setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
          setGramInComplete(grmCalcForSilver);
          setCommonError(`You can't gift more than ${userWallet.silver} gm`);
          // setRupeeError("You cant sell this much amount of silver")
        }
      }
    }
  };

  const enterGramHandlerForSell = (e) => {
    let isOn;
    if (handelItemValue == "GOLD") {
      isOn = true;
    } else {
      isOn = false;
    }
    let val = e.target.value;
    if (e.target.value == "") {
      setGramIn("");
      setGramInComplete("");
      setRupeeIn("");
      setRupeeInComplete("");
      setCommonError("");
      setRupeeError("");
      setGramErrorr("");
    } else {
      if (!val || val.match(/^\d{1,}(\.\d{0,4})?$/)) {
        setGramIn(val);
        setGramInComplete(val);
        if (val < 9.99 / sellGoldPrice || val < 9.99 / sellSilverPrice) {
          let rupeeCalcFor = 0;
          if (isOn) {
            rupeeCalcFor = +val * +sellGoldPrice;
          } else {
            rupeeCalcFor = +val * +sellSilverPrice;
          }
          setRupeeIn(fixDecimalDigit(rupeeCalcFor, 2));
          setRupeeInComplete(rupeeCalcFor);
          // setGramErrorr("Please Add Gram Of Atleast 10 Rs");
          setCommonError("Please Add Gram Of Atleast 10 Rs");
        } else if (isOn && val > 5) {
          let rupeeCalcFor = +val * +sellGoldPrice;
          setRupeeIn(fixDecimalDigit(rupeeCalcFor, 2));
          setRupeeInComplete(rupeeCalcFor);
          // setGramErrorr(`You can't Sell More then ${userWallet.gold} g`);
          setCommonError(`You can't gift more than 5 gm `);
        } else if (isOn == false && val > 100) {
          let rupeeCalcFor = +val * +sellSilverPrice;
          setRupeeIn(fixDecimalDigit(rupeeCalcFor, 2));
          setRupeeInComplete(rupeeCalcFor);
          // setRupeeIn("");
          // setRupeeInComplete("");
          // setGramErrorr(`You can't Sell More then ${userWallet.gold} g`);
          setCommonError(`You can't gift more than 100 gm `);
        } else if (isOn && val > userWallet.gold) {
          let rupeeCalcFor = +val * +sellGoldPrice;
          setRupeeIn(fixDecimalDigit(rupeeCalcFor, 2));
          setRupeeInComplete(rupeeCalcFor);
          // setRupeeIn("");
          // setRupeeInComplete("");
          // setGramErrorr(`You can't Sell More then ${userWallet.gold} g`);
          setCommonError(`You can't gift more than ${userWallet.gold} gm`);
        } else if (isOn == false && val > userWallet.silver) {
          let rupeeCalcFor = +val * +sellSilverPrice;
          setRupeeIn(fixDecimalDigit(rupeeCalcFor, 2));
          setRupeeInComplete(rupeeCalcFor);
          // setRupeeIn("");
          // setRupeeInComplete("");
          setCommonError(`You can't gift more than ${userWallet.silver} gm`);
        } else if (isOn && val > 9.99 / sellGoldPrice && val < userWallet.gold) {
          let rupeeCalcForGold = +val * +sellGoldPrice;
          let finalRupeeCalcForGold = rupeeCalcForGold;
          setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
          setRupeeInComplete(finalRupeeCalcForGold);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        } else if (
          isOn == false &&
          val > 9.99 / sellSilverPrice &&
          val < userWallet.silver
        ) {
          let grmCalcForSilver = +val * +sellSilverPrice;
          let finalGrmCalcForSilver = grmCalcForSilver;
          setRupeeIn(fixDecimalDigit(finalGrmCalcForSilver, 2));
          setRupeeInComplete(finalGrmCalcForSilver);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        }
      }
    }
    // const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
    // if (floatRegExp.test(val)) {

    // }
  };

  const rsAndGrmBtnClickHandlerForSell = (newVal, type) => {
    let isOn;
    if (handelItemValue == "GOLD") {
      isOn = true;
    } else {
      isOn = false;
    }
    if (type == "rupee") {
      let newRupee = +rupeeIn + +newVal;
      if (isOn && userWallet && newRupee < userWallet.gold * sellGoldPrice) {
        let finalVal = newRupee;
        let grmCalcForGold = finalVal / sellGoldPrice;

        if (grmCalcForGold > 5) {
          setGramIn(fixDecimalDigit(grmCalcForGold, 4));
          setGramInComplete(grmCalcForGold);
          setRupeeIn(fixDecimalDigit(newRupee, 2));
          setRupeeInComplete(newRupee);
          setCommonError("You can't gift more than 5 gm ");
        } else {
          setGramIn(fixDecimalDigit(grmCalcForGold, 4));
          setGramInComplete(grmCalcForGold);
          setRupeeIn(fixDecimalDigit(newRupee, 2));
          setRupeeInComplete(newRupee);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        }

      } else if (
        userWallet &&
        isOn == false &&
        newRupee < userWallet.silver * sellSilverPrice
      ) {
        let finalVal = newRupee;
        let grmCalcForSilver = finalVal / sellSilverPrice;

        if (grmCalcForSilver > 100) {

          setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
          setGramInComplete(grmCalcForSilver);
          setRupeeIn(fixDecimalDigit(newRupee, 2));
          setRupeeInComplete(newRupee);
          setCommonError("You can't gift more than 100 gm ");

        } else {

          setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
          setGramInComplete(grmCalcForSilver);
          setRupeeIn(fixDecimalDigit(newRupee, 2));
          setRupeeInComplete(newRupee);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");

        }
      } else if (
        userWallet &&
        isOn &&
        newRupee > userWallet.gold * sellGoldPrice
      ) {
        let finalVal = newRupee;
        let grmCalcForSilver = finalVal / sellSilverPrice;
        setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
        setGramInComplete(grmCalcForSilver);
        setRupeeIn(fixDecimalDigit(newRupee, 2));
        setRupeeInComplete(newRupee);
        // setGramIn("");
        // setGramInComplete("");
        // setRupeeError("You cant sell this much amount of gold")
        setCommonError("You can't gift this much amount of gold");
      } else if (
        userWallet &&
        isOn == false &&
        newRupee > userWallet.silver * sellSilverPrice
      ) {
        let finalVal = newRupee;
        let grmCalcForSilver = finalVal / sellSilverPrice;
        setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
        setGramInComplete(grmCalcForSilver);
        setRupeeIn(fixDecimalDigit(newRupee, 2));
        setRupeeInComplete(newRupee);
        // setGramIn("");
        // setGramInComplete("");
        setCommonError("You can't gift this much amount of Silver");
        // setRupeeError("You cant sell this much amount of Silver")
      }
    } else {
      let newGram = +gramIn + +newVal;
      if (isOn && newGram > 5) {
        let rupeeCalcForGold = newGram * sellGoldPrice;
        let finalRupeeCalcForGold = rupeeCalcForGold;
        setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
        setRupeeInComplete(finalRupeeCalcForGold);
        setGramIn(fixDecimalDigit(newGram, 4));
        setGramInComplete(newGram);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
        // setRupeeIn("");
        // setRupeeInComplete("");
        // setGramErrorr(`You can't Sell More then ${userWallet.gold} g`);
        setCommonError(`You can't gift more than 5 gm `);
      } else if (isOn == false && newGram > 100) {
        let rupeeCalcFor = +val * +sellSilverPrice;
        let grmCalcForSilver = newGram * sellSilverPrice;
        let finalRupeeCalcForSilver = grmCalcForSilver;
        setGramIn(fixDecimalDigit(newGram, 4));
        setGramInComplete(newGram);
        setRupeeIn(fixDecimalDigit(finalRupeeCalcForSilver, 2));
        setRupeeInComplete(finalRupeeCalcForSilver);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
        // setRupeeIn("");
        // setRupeeInComplete("");
        // setGramErrorr(`You can't Sell More then ${userWallet.gold} g`);
        setCommonError(`You can't gift more than 100 gm `);
      } else if (userWallet && isOn && newGram < userWallet.gold) {
        let rupeeCalcForGold = newGram * sellGoldPrice;
        let finalRupeeCalcForGold = rupeeCalcForGold;
        setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
        setRupeeInComplete(finalRupeeCalcForGold);
        setGramIn(fixDecimalDigit(newGram, 4));
        setGramInComplete(newGram);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      } else if (userWallet && isOn == false && newGram < userWallet.silver) {
        let grmCalcForSilver = newGram * sellSilverPrice;
        let finalRupeeCalcForSilver = grmCalcForSilver;
        setGramIn(fixDecimalDigit(newGram, 4));
        setGramInComplete(newGram);
        setRupeeIn(fixDecimalDigit(finalRupeeCalcForSilver, 2));
        setRupeeInComplete(finalRupeeCalcForSilver);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      } else if (userWallet && isOn && newGram > userWallet.gold) {
        let rupeeCalcForGold = newGram * sellGoldPrice;
        let finalRupeeCalcForGold = rupeeCalcForGold;
        setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
        setRupeeInComplete(finalRupeeCalcForGold);
        setGramIn(fixDecimalDigit(newGram, 4));
        setGramInComplete(newGram);
        // setRupeeIn("");
        // setRupeeInComplete("");
        // setGramErrorr(`You can't Sell More then ${userWallet.gold} g`);
        setCommonError(`You can't gift more than ${userWallet.gold} g`);
      } else if (userWallet && isOn == false && newGram > userWallet.silver) {
        let rupeeCalcForGold = newGram * sellGoldPrice;
        let finalRupeeCalcForGold = rupeeCalcForGold;
        setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
        setRupeeInComplete(finalRupeeCalcForGold);
        setGramIn(fixDecimalDigit(newGram, 4));
        setGramInComplete(newGram);
        // setRupeeIn("");
        // setRupeeInComplete("");
        setCommonError(`You can't gift more than ${userWallet.silver} g`);
        // setGramErrorr(`You can't Sell More then ${userWallet.silver} g`);
      }
    }
  };


  return (
    <div>
      <Modal show={otpModalShow}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered


      >
        <div className="coupons_modal">
          <Modal.Body>
            <div className="maincomponent">

              <div className={styleotp.align_login_data}>
                <div className={styleotp.enter_otp}>Enter OTP</div>
                <div className="close" onClick={() => setOtpModalShow(false)} >
                  <IoMdClose style={{ color: "#fff" }} />
                </div>
                <form onSubmit={onSubmitVerify}>
                  <div className={styleotp.login_form}>
                    <div className={styleotp.user_mobile_no}>
                      <div className={styleotp.otp_box}>
                        <OTPInput
                          name="otp"
                          onChange={handleOTPChange}
                          value={otp}
                          inputStyle="inputStyle"
                          inputType="tel"
                          shouldAutoFocus={true}
                          numInputs={6}
                          isInputNum={true}
                          separator={<span></span>}
                          renderInput={(props) => <input type="tel" {...props} />}
                        />
                      </div>
                    </div>
                    <span
                      style={{
                        display: "flex",
                        position: "absolute",
                        marginTop: 5,
                        marginLeft:60,
                        fontWeight:"bolder",
                        color: "#ab0000",
                        fontSize: 13,
                      }}
                    >
                      {otpError}
                    </span>
                    <div className={`${styleotp.send_otp} mt-4  w-50 m-auto`}>
                      <button type="submit" disabled={isSubmitting} >
                        VERIFY
                      </button>
                    </div>

                  </div>
                </form>
              </div>

            </div>
          </Modal.Body>
          <style>{`
        .modal-content{
          background: linear-gradient(0.69deg, #154C6D 0.62%, #12242E 101.27%);
        }
        .resend{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0px;
        }
          .close{
            position: absolute;
          right: 14px;
          top: 17px;
          font-size: 24px;
          }

            `}</style>
        </div>
      </Modal>

      <div className="container">
        <div className={`${style.gifting_bg}`}>

          <div className={style.gifting_data}>
            <div className="col-12 col-md-6">
              <div className={style.gifting_left_data}>
                <Image
                  src={"/images/gift_gold_web.png"}
                  height={450}
                  width={350}
                  alt="gifting"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className={style.gifting_right_data}>
                <div className={style.wallet}>
                  <div className="">
                    <Image src={"/images/gold-bars.svg"} height={25} width={25} alt="goldBars"></Image>
                  </div>
                  <div className={style.gold}>Gold : {fixDecimalDigit(userWallet.gold, 4)} gm</div>
                  <div className={style.line}></div>
                  <div className="">
                    <Image src={"/images/silverBars.png"} height={25} width={25} alt="silverBars"></Image>
                  </div>
                  <div className={style.silver}>Silver : {fixDecimalDigit(userWallet.silver, 4)}  gm</div>
                </div>
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
                      <div className={style.gift_money}>
                        <label>Gift</label>
                        <br />
                        <select
                          name="gift"
                          id="gift"
                          onChange={handleValue}
                          style={{ cursor: "pointer" }}
                        >
                          <option value="">Please choose an option</option>
                          <option
                            selected={handelItemValue == "GOLD" ? true : false}
                            value="GOLD"
                          >
                            GOLD
                          </option>
                          <option
                            selected={handelItemValue == "SILVER" ? true : false}
                            value="SILVER"
                          >
                            SILVER
                          </option>
                        </select>
                        <span className="text-danger">
                          {handelItemValueError}
                        </span>
                      </div>
                      <div className={style.gift_money}>
                        <label>Gift</label> <br />
                        <div
                          className={`d-flex justify-content-between ${style.input_type}`}
                        >
                          <div className={style.rupees}>
                            <input
                              type="tel"
                              className={style.from_field}
                              maxLength={8}
                              value={rupeeIn}
                              onChange={enterRupeeHandlerForSell}
                              placeholder="Enter Rupees"
                            />
                            <div
                              className={`d-flex justify-content-between ${style.amount}`}
                            >
                              <div
                                onClick={() =>
                                  rsAndGrmBtnClickHandlerForSell(50, "rupee")
                                }
                                className={style.amount_price}
                              >
                                +₹50
                              </div>
                              <div
                                onClick={() =>
                                  rsAndGrmBtnClickHandlerForSell(100, "rupee")
                                }
                                className={style.amount_price}
                              >
                                +₹100
                              </div>
                            </div>
                          </div>
                          <div className={style.gram}>
                            <input
                              type="tel"
                              className={style.from_field}
                              maxLength={8}
                              value={gramIn}
                              onChange={enterGramHandlerForSell}
                              placeholder="Enter Grams"
                            />
                            <div
                              className={`d-flex justify-content-between ${style.amount}`}
                            >
                              <div
                                onClick={() =>
                                  rsAndGrmBtnClickHandlerForSell("0.5", "gram")
                                }
                                className={style.amount_price}
                              >
                                +0.5 gm
                              </div>
                              <div
                                onClick={() =>
                                  rsAndGrmBtnClickHandlerForSell("1", "gram")
                                }
                                className={style.amount_price}
                              >
                                +1.0 gm
                              </div>
                            </div>
                          </div>
                        </div>
                        {commonError && (
                          <div className="text-center mt-2">
                            <span className="text-danger">{commonError}</span>
                          </div>
                        )}
                      </div>
                      <div className={`${style.gift_money} mt-4`}>
                        <label>Send To</label>
                        <br />
                        <input
                          name="giftedUsers"
                          type="tel"
                          minLength="10"
                          maxLength="10"
                          placeholder="Enter Mobile Number"
                          value={values.giftedUsers}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(/[^0-9]/g, "");
                            setFieldValue("giftedUsers", updatedValue);
                            setMobile(updatedValue);
                          }}
                        />
                        <ErrorMessage
                          name="giftedUsers"
                          component="div"
                          className="error text-danger"
                        />
                        {/* <span className='text-danger'>{giftedUserError}</span> */}
                      </div>
                      <div className={style.send_gift}>
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
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
    </div>
  );
};
export default Gifting;
