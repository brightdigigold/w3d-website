import React, { useEffect, useState, useRef } from "react";
import style from "./sellAndBuy.module.css";
import Image from "next/image";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { AesEncrypt, AesDecrypt, fixDecimalDigit } from "../middleware";
import axios from "axios";
import CouponsModal from "../coupons";
import CountDown from "../countdown";
import BuyModal from "../buyModal";
import SellModal from "../sellModal";
import LoginAside from "../loginAside/loginAside";
import Notiflix from "notiflix";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import { VscVerifiedFilled } from "react-icons/vsc";
import CouponAppliedPopup from "../couponAppliedPopup";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { doShowLoginAside } from "../../store/index";
import { log } from "../logger";

const SellAndBuy = ({ type }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOn, setIsOn] = useState(true);
  const countDownTime = [0, 5, 0];
  const [[hours, minutes, seconds], setTimer] = useState(countDownTime);
  const countdownRef = useRef();
  const [activeTabClick, setActiveTabClick] = useState("BUY");
  const [isShow, setIsShow] = useState("BUY");
  const [couponsShow, setCouponsShow] = useState(false);
  const [buyModalShow, setBuyModalShow] = useState(false);
  const [sellModalShow, setSellModalShow] = useState(false);
  const [showAside, setShowAside] = useState(false);
  const [toggleHeader, setToggleHeader] = useState(false);
  const [sellEnabled, setSellEnabled] = useState(false);
  const [kycError, setKycError] = useState("");
  const handleShowAside = () => setShowAside(true);
  const [firstCoupon, setFirstCoupon] = useState({});
  const [rupeeIn, setRupeeIn] = useState("");
  const [rupeeInComplete, setRupeeInComplete] = useState("");
  const [gramIn, setGramIn] = useState("");
  const [gramInComplete, setGramInComplete] = useState("");
  const [commonError, setCommonError] = useState("");
  const [rupeeError, setRupeeError] = useState("");
  const [gramError, setGramErrorr] = useState("");

  const reduxData = useSelector((state) => {
    return state.auth;
  });
  // log("reduxData in selandbuy : ",reduxData)

  useEffect(() => {
    log("Running again");
    if (router.query.type == "sell") {
      handleClick("SELL");
    }
  }, [router.query]);
  const handleCloseAside = () => setShowAside(false);
  const handleClick = (activeTab, type = null) => {
    if (type == null) {
      log("type in handleClick if cond  : ", type);
      setGramIn("");
      setGramInComplete("");
      setRupeeIn("");
      setRupeeInComplete("");
      setCommonError("");
    }
    setGramErrorr("");
    setRupeeError("");
    setCommonError("");
    setActiveTabClick(activeTab);
    const token = localStorage.getItem("token");
    if (token) {
      setIsShow(activeTab);
      if (activeTab == "SELL") {
        log("activeTab : ", activeTab);
        updateMetalPrice();
        IsKycDone();
      }
      reset();
    } else {
      if (activeTab == "SELL") {
        setShowAside(true);
      } else {
        setIsShow(activeTab);
      }
    }
  };
  const handleToggle = () => {
    setIsOn(!isOn);
    setGramIn("");
    setGramInComplete("");
    setRupeeIn("");
    setRupeeInComplete("");
    validateWallet(!isOn);
  };

  const redirectData = (response) => {
    // if(response.data == 'SELL'){
    //     handleClick(activeTabClick);
    // }
    handleClick(activeTabClick, "NOTCLEAR");
  };

  const [trustedAndSecured, setTrustedAndSecured] = useState([]);
  const [goldPrice, setGoldPrice] = useState(0);
  const [sellGoldPrice, setSellGoldPrice] = useState(0);
  const [silverPrice, setSilverPrice] = useState(0);
  const [sellSilverPrice, setSellSilverPrice] = useState(0);
  const [walletSellGold, setWalletSellGold] = useState(0);
  const [walletSellSilver, setWalletSellSilver] = useState(0);
  const [couponCode, setCouponsCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isGstVerified, setIsGstVerified] = useState(false);
  const [goldData, setGoldData] = useState({});
  const [silverData, setSilverData] = useState({});
  const [userMetalGram, setUserMetalGram] = useState("1.6");
  const [couponsList, setCouponsList] = useState([]);
  const [showAppliedPopup, setShowAppliedPopup] = useState(false);

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
  const rateOfSilverOrGold = () => { };

  const reset = () => {
    setGramIn('');
    setGramInComplete('');
    setRupeeIn('');
    setRupeeInComplete('');
    updateMetalPrice();
    setTimer(countDownTime);
  };

  const updateMetalPrice = () => {
    fetch(`${process.env.baseUrl}/public/metal/price`, {
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);
        setGoldData(JSON.parse(decryptedData).data.gold[0]);
        setSilverData(JSON.parse(decryptedData).data.silver[0]);
        log(
          "BuyGoldPrice",
          JSON.parse(decryptedData).data.gold[0].totalPrice
        );
        log(
          "SellGoldPrice",
          JSON.parse(decryptedData).data.gold[0].salePrice
        );
        log(
          "BuySilverPrice",
          JSON.parse(decryptedData).data.gold[0].totalPrice
        );
        log(
          "SellSilverPrice",
          JSON.parse(decryptedData).data.silver[0].salePrice
        );
        setGoldPrice(JSON.parse(decryptedData).data.gold[0].totalPrice);
        setSellGoldPrice(JSON.parse(decryptedData).data.gold[0].salePrice);
        setSilverPrice(JSON.parse(decryptedData).data.silver[0].totalPrice);
        setSellSilverPrice(JSON.parse(decryptedData).data.silver[0].salePrice);
        walletApiSell(
          JSON.parse(decryptedData).data.gold[0].salePrice,
          JSON.parse(decryptedData).data.silver[0].salePrice
        );
        activeTabClick == "BUY"
          ? setRupeeIn((rupeeIn) => {
            if (rupeeIn) {
              if (isOn) {
                let finalVal = rupeeIn / +"1.03";
                let grmCalcForGold =
                  finalVal /
                  JSON.parse(decryptedData).data.gold[0].totalPrice;
                setGramIn(fixDecimalDigit(grmCalcForGold, 4));
                setGramInComplete(grmCalcForGold);
                return rupeeIn;
              } else {
                let finalVal = rupeeIn / +"1.03";
                let grmCalcForSilver =
                  finalVal /
                  JSON.parse(decryptedData).data.silver[0].totalPrice;
                setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
                setGramInComplete(grmCalcForSilver);
                return rupeeIn;
              }
            }
          })
          : setRupeeIn((rupeeIn) => {
            if (rupeeIn) {
              if (isOn) {
                let finalVal = rupeeIn / +"1.03";
                let grmCalcForGold =
                  finalVal / JSON.parse(decryptedData).data.gold[0].salePrice;
                setGramIn(fixDecimalDigit(grmCalcForGold, 4));
                setGramInComplete(grmCalcForGold);
                return rupeeIn;
              } else {
                let finalVal = rupeeIn / +"1.03";
                let grmCalcForSilver =
                  finalVal /
                  JSON.parse(decryptedData).data.silver[0].salePrice;
                setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
                setGramInComplete(grmCalcForSilver);
                return rupeeIn;
              }
            }
          });
        activeTabClick == "BUY"
          ? setRupeeInComplete((rupeeIn) => {
            if (rupeeIn) {
              if (isOn) {
                let finalVal = rupeeIn / +"1.03";
                let grmCalcForGold =
                  finalVal /
                  JSON.parse(decryptedData).data.gold[0].totalPrice;
                setGramIn(fixDecimalDigit(grmCalcForGold, 4));
                setGramInComplete(grmCalcForGold);
                return rupeeIn;
              } else {
                let finalVal = rupeeIn / +"1.03";
                let grmCalcForSilver =
                  finalVal /
                  JSON.parse(decryptedData).data.silver[0].totalPrice;
                setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
                setGramInComplete(grmCalcForSilver);
                return rupeeIn;
              }
            }
          })
          : setRupeeInComplete((rupeeIn) => {
            if (rupeeIn) {
              if (isOn) {
                let finalVal = rupeeIn / +"1.03";
                let grmCalcForGold =
                  finalVal / JSON.parse(decryptedData).data.gold[0].salePrice;
                setGramIn(fixDecimalDigit(grmCalcForGold, 4));
                setGramInComplete(grmCalcForGold);
                return rupeeIn;
              } else {
                let finalVal = rupeeIn / +"1.03";
                let grmCalcForSilver =
                  finalVal /
                  JSON.parse(decryptedData).data.silver[0].salePrice;
                setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
                setGramInComplete(grmCalcForSilver);
                return rupeeIn;
              }
            }
          });
      })
      .catch((error) => console.error(error));
  };
  const data = useSelector((state) => {
    return state.auth;
  });

  useEffect(() => {
    updateMetalPrice();
    TrustedAndSecureBanner();
    IsKycDone();
    fetchCouponsApi();
  }, []);
  // useEffect for rate of gold and silver api below
  useEffect(() => {
    if (type == "BUY") {
      handleClick("BUY", "NOTCLEAR");
    } else if (type == "sell") {
      handleClick("SELL", "NOTCLEAR");
    }
    if (data.isAuthenticated) {
    } else {
      handleClick("BUY", "NOTCLEAR");
    }
  }, [data]);

  const fetchCouponsApi = () => {
    // const token = localStorage.getItem("token");
    const configHeaders = {
      headers: {
        // authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${process.env.baseUrl}/public/coupons`, configHeaders)
      .then((response) => response.json())
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.payload);
        if (JSON.parse(decryptedData).status) {
          setCouponsList(JSON.parse(decryptedData).data);
          setFirstCoupon(JSON.parse(decryptedData).data[0]);
        }
      })
      .catch((error) => console.error(error));
  };

  const TrustedAndSecureBanner = async () => {
    let dataToBeEncryptPayload = {
      type: "trusted_and_secure_banner",
    };
    const resAfterEncryptData = await funForAesEncrypt(dataToBeEncryptPayload);
    const payloadToSend = {
      payload: resAfterEncryptData,
    };
    axios
      .post(`${process.env.baseUrl}/data/banner/images`, payloadToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (data) => {
        const decryptedData = await funcForDecrypt(data.data.payload);
        //
        //
        setTrustedAndSecured(JSON.parse(decryptedData).data);
      })
      .catch((error) => console.error(error));
  };

  const enterRupeeHandler = (value) => {
    log("goldPrice", goldPrice);
    removeCoupon();
    if (value == "") {
      setGramIn("");
      setGramInComplete("");
      setRupeeIn("");
      setRupeeInComplete("");
      setRupeeError("");
      setCommonError("");
    } else {
      let val = value;
      if (!val || val.match(/^\d{1,}(\.\d{0,2})?$/)) {
        setRupeeIn(val);
        setRupeeInComplete(val);
        if (isOn && val > 9.99) {
          let finalVal = val / +"1.03";
          let grmCalcForGold = finalVal / goldPrice;
          log("grmCalcForGold in enter rs handler : ", grmCalcForGold);
          // if (grmCalcForGold < 25) {
          log("grmCalcForGold for if : ", grmCalcForGold);
          setGramIn(fixDecimalDigit(grmCalcForGold, 4));
          setGramInComplete(grmCalcForGold);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
          // } else {
          //   log("error in console")
          //   setGramErrorr("Can't purchase more than 25gm")
          // }
        } else if (isOn == false && val > 9.99) {
          let finalVal = val / +"1.03";
          let grmCalcForSilver = finalVal / silverPrice;
          log("grmCalcForSilver : ", grmCalcForSilver);
          // if (grmCalcForSilver < 25) {
          log("grmCalcForGold for if : ", grmCalcForSilver);
          setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
          setGramInComplete(grmCalcForSilver);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        } else if (val < 10) {
          setRupeeError("You cannot buy less than ₹10");
          setCommonError("Please Enter minimum amount of Rs.10");
          let finalVal = val / +"1.03";
          let grmCalcFor = 0;
          if (isOn) {
            grmCalcFor = finalVal / goldPrice;
          } else if (isOn == false) {
            grmCalcFor = finalVal / silverPrice;
          }
          log(
            "grmCalcFor in enter rs handler when val < 10 : ",
            grmCalcFor
          );
          setGramIn(fixDecimalDigit(grmCalcFor, 4));
          setGramInComplete(grmCalcFor);
        }
      }
    }
  };

  const enterGramHandler = (value) => {
    removeCoupon();
    let val = value;
    if (value == "") {
      setGramIn("");
      setGramInComplete("");
      setRupeeIn("");
      setRupeeInComplete("");
      setGramErrorr("");
      setRupeeError("");
      setCommonError("");
    } else {
      if (!val || val.match(/^\d{1,}(\.\d{0,4})?$/)) {
        setGramIn(val);
        setGramInComplete(val);
        if (isOn && val > 9.9 / goldPrice) {
          let rupeeCalcForGold = +val * +goldPrice;
          let finalRupeeCalcForGold = rupeeCalcForGold * +"1.03";
          log(
            "finalRupeeCalcForGold buy gold : ",
            finalRupeeCalcForGold
          );
          setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
          setRupeeInComplete(finalRupeeCalcForGold);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        } else if (isOn == false && val > 9.9 / silverPrice) {
          let grmCalcForSilver = +val * +silverPrice;
          let finalGrmCalcForSilver = grmCalcForSilver * +"1.03";
          log(
            "finalGrmCalcForSilver buy silver : ",
            finalGrmCalcForSilver
          );
          setRupeeIn(fixDecimalDigit(finalGrmCalcForSilver, 2));
          setRupeeInComplete(finalGrmCalcForSilver);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        } else if (val < 9.9 / goldPrice || val < 9.9 / silverPrice) {
          setGramErrorr("Please Add Gram Of Atleast 10 Rs");
          setCommonError("Please Add Gram Of Atleast 10 Rs");
          let rupeeCalcFor = 0;
          if (isOn) {
            rupeeCalcFor = +val * +goldPrice;
          } else if (isOn == false) {
            rupeeCalcFor = +val * +silverPrice;
          }
          let finalRupeeCalcForGold = rupeeCalcFor * +"1.03";
          log(
            "finalRupeeCalcForGold in enterGramHandler < 10 condition  : ",
            finalRupeeCalcForGold
          );
          if (finalRupeeCalcForGold < 10) {
            setGramErrorr("Please Add Gram Of Atleast 10 Rs");
            setCommonError("Please Add Gram Of Atleast 10 Rs");
          } else {
            setGramErrorr("");
            setCommonError("");
          }
          setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
          setRupeeInComplete(finalRupeeCalcForGold);
        }
      }
    }
  };

  const rsAndGrmBtnClickHandler = (newVal, type) => {
    removeCoupon();
    if (type == "rupee") {
      let newRupee = +(rupeeIn ? rupeeIn : "") + +newVal;
      if (isOn) {
        let finalVal = newRupee / +"1.03";
        let grmCalcForGold = finalVal / goldPrice;

        setGramIn(fixDecimalDigit(grmCalcForGold, 4));
        setGramInComplete(grmCalcForGold);
        setRupeeIn(newRupee);
        setRupeeInComplete(newRupee);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      } else {
        let finalVal = newRupee / +"1.03";
        let grmCalcForSilver = finalVal / silverPrice;
        log("grmCalcForSilver : ", grmCalcForSilver);
        setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
        setGramInComplete(grmCalcForSilver);
        setRupeeIn(newRupee);
        setRupeeInComplete(newRupee);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      }
    } else {
      let newGram = +(gramIn ? gramIn : 0) + +newVal;
      log("newGram", newGram);
      if (isOn) {
        let rupeeCalcForGold = newGram * goldPrice;
        let finalRupeeCalcForGold = rupeeCalcForGold * +"1.03";

        setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
        setRupeeInComplete(finalRupeeCalcForGold);
        setGramIn(newGram);
        setGramInComplete(newGram);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      } else {
        let grmCalcForSilver = newGram * silverPrice;
        let finalRupeeCalcForSilver = grmCalcForSilver * +"1.03";

        setGramIn(newGram);
        setGramInComplete(newGram);
        setRupeeIn(fixDecimalDigit(finalRupeeCalcForSilver, 2));
        setRupeeInComplete(finalRupeeCalcForSilver);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      }
    }
  };

  const [gstNum, setGstNum] = useState("");
  const [errorMess, setErrorMess] = useState("");

  const gstHandler = (e) => {
    setErrorMess("");
    setGstNum(e.target.value);
  };

  const validate = () => {
    //  Is Required

    let rupeeErroeMess = "";
    let gramErrorMess = "";

    if (!rupeeIn) {
      log("conditions 1");
      rupeeErroeMess = "Please enter the value in Rs. or Gm.";
      setCommonError(rupeeErroeMess);
      return false;
    }

    if (!gramIn) {
      log("conditions 2");
      gramErrorMess = "Please enter the value in Rs. or Gm.";
      setCommonError(gramErrorMess);
      return false;
    }

    if (gstNum.length > 0) {
      log("conditions 5");
      if (isGstVerified == false) {
        log("conditions 6");
        setErrorMess("Please verify Gst");
        return false;
      }
    }
    return true;
  };

  const buyHandler = async () => {
    const token = localStorage.getItem("token");
    if (gramError == "" && rupeeError == "") {
      if (validate()) {
        if (token && reduxData.isProfileFilled == true) {
          //
          previewModal();

          // axios.post(``)
        } else {
          dispatch(doShowLoginAside(true));
        }
      } else {
        log("feilds not validated");
      }
    } else {
      log("gramError or rupeeError is there");
    }
  };

  const SellHandler = async () => {
    if (gramError == "" && rupeeError == "") {
      if (validate()) {
        previewModal();
      } else {
        log("feilds not validated in sell handler");
      }
    } else {
      log("gramError or rupeeError is there");
    }
  };

  const removeCoupon = () => {
    setCouponsCode("");
    setCouponError("");
  };

  const [userWallet, setUserWallet] = useState({});

  const walletApiSell = (sellGoldPrice, sellSilverPrice) => {
    const token = localStorage.getItem("token");

    if (token) {

      fetch(`${process.env.baseUrl}/user/vault`, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          const decryptedData = await funcForDecrypt(data.payload);
          log("JSON.parse(decryptedData) : ", JSON.parse(decryptedData));
          let userWallet = JSON.parse(decryptedData).data;
          log(
            `userWallet.gold=${userWallet.gold} :: userWallet.silver=${userWallet.silver} :: sellGoldPrice=${sellGoldPrice} :: sellSilverPrice=${sellSilverPrice}`
          );
          let goldWallet = userWallet.gold * sellGoldPrice;
          let silverWallet = userWallet.silver * sellSilverPrice;
          if (isOn) {
            if (goldWallet && goldWallet > 0) {
              setSellEnabled(true);
            }else{
                setSellEnabled(false);
            }
          } else {
            if (silverWallet && silverWallet > 0) {
              setSellEnabled(true);
            }else{
               setSellEnabled(false);
            }
          }
          setUserWallet(userWallet);
          setWalletSellGold(goldWallet);
          setWalletSellSilver(silverWallet);
        })
        .catch((error) => console.error(error));

    }
  };

  const validateWallet = (val) => {
    if (val) {
       log('walletSellSilver1',walletSellSilver);
      if (walletSellGold && walletSellGold > 0) {
        setSellEnabled(true);
      }else{
         setSellEnabled(false);
      }
    } else {
      log('walletSellSilver',walletSellSilver);
      if (walletSellSilver && walletSellSilver > 0) {
        setSellEnabled(true);
      }else{
         setSellEnabled(false);
      }
    }
  };

  const enterRupeeHandlerForSell = (value) => {
    removeCoupon();
    setCommonError("");
    let val = value;
    if (value == "") {
      setGramIn("");
      setGramInComplete("");
      setRupeeIn("");
      setRupeeInComplete("");
      setRupeeError("");
      setGramErrorr("");
    } else {
      log("sellGoldPrice", sellGoldPrice);
      if (!val || val.match(/^\d{1,}(\.\d{0,2})?$/)) {
        setRupeeIn(val);
        setRupeeInComplete(val);
        let finalVal = val;
        //
        if (
          isOn &&
          userWallet &&
          val > 99.99 &&
          finalVal <= userWallet.gold * sellGoldPrice
        ) {
          let grmCalcForGold = finalVal / sellGoldPrice;
          setGramIn(fixDecimalDigit(grmCalcForGold, 4));
          setGramInComplete(grmCalcForGold);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        } else if (
          isOn == false &&
          val > 99.99 &&
          finalVal <= userWallet.silver * sellSilverPrice
        ) {
          // let finalVal = val / (+'1.03');
          let grmCalcForSilver = finalVal / sellSilverPrice;
          setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
          setGramInComplete(grmCalcForSilver);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        } else if (val < 100) {
          let grmCalcFor = 0;
          if (isOn) {
            grmCalcFor = finalVal / sellGoldPrice;
          } else {
            grmCalcFor = finalVal / sellSilverPrice;
          }
          setGramIn(fixDecimalDigit(grmCalcFor, 4));
          setGramInComplete(grmCalcFor);
          setRupeeError("Please Enter Atleast Amount 100");
          setCommonError("Please Enter Atleast Amount 100");
        } else if (
          isOn &&
          userWallet &&
          finalVal > userWallet.gold * sellGoldPrice
        ) {
          setGramIn("");
          setGramInComplete("");
          setRupeeError("Insufficient gold to sell. Please enter a lower value.");
          setCommonError("Insufficient gold to sell. Please enter a lower value.");
        } else if (
          isOn == false &&
          finalVal > userWallet.silver * sellSilverPrice
        ) {
          setGramIn("");
          setGramInComplete("");
          setRupeeError("Insufficient silver to sell. Please enter a lower value.");
          setCommonError("Insufficient silver to sell. Please enter a lower value.");
        }
      }
    }
  };

  const enterGramHandlerForSell = (value) => {
    removeCoupon();
    let val = value;
    if (value == "") {
      setGramIn("");
      setGramInComplete("");
      setRupeeIn("");
      setRupeeInComplete("");
      setRupeeError("");
      setGramErrorr("");
      setCommonError("");
    } else {
      log("sellGoldPrice", sellGoldPrice);
      log('val', val);
      if (!val || val.match(/^\d{1,}(\.\d{0,4})?$/)) {
        log('val1', val);
        log('userWallet.silver', userWallet.silver);
        setGramIn(val);
        setGramInComplete(val);
        if (isOn && val > 99.99 / sellGoldPrice && val <= userWallet.gold) {
          log('val2', val);
          let rupeeCalcForGold = +val * +sellGoldPrice;
          let finalRupeeCalcForGold = rupeeCalcForGold;
          setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
          setRupeeInComplete(finalRupeeCalcForGold);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        } else if (
          isOn == false &&
          val > 99.99 / sellSilverPrice &&
          val <= userWallet.silver
        ) {
          log('val3', val);
          let grmCalcForSilver = +val * +sellSilverPrice;
          let finalGrmCalcForSilver = grmCalcForSilver;
          log('sellSilverPrice', sellSilverPrice);
          log('Rs', val);
          log('finalGrmCalcForSilver', finalGrmCalcForSilver);
          setRupeeIn(fixDecimalDigit(finalGrmCalcForSilver, 2));
          setRupeeInComplete(finalGrmCalcForSilver);
          setGramErrorr("");
          setRupeeError("");
          setCommonError("");
        } else if (
          val < 99.99 / sellGoldPrice ||
          val < 99.99 / sellSilverPrice
        ) {
          log('val3', val);
          let rupeeCalcFor = 0;
          if (isOn) {
            rupeeCalcFor = +val * +sellGoldPrice;
          } else {
            rupeeCalcFor = +val * +sellSilverPrice;
          }
          log('sellSilverPrice2', sellSilverPrice);
          log('Rs2', val);
          log('rupeeCalcFor', rupeeCalcFor);
          setRupeeIn(fixDecimalDigit(rupeeCalcFor, 2));
          setRupeeInComplete(rupeeCalcFor);
          setGramErrorr("Please Add Gram Of Atleast 100 Rs");
          setCommonError("Please Add Gram Of Atleast 100 Rs");
        } else if (isOn && val > userWallet.gold) {
          if (userWallet.gold == 0) {
            setRupeeIn("");
            setRupeeInComplete("");
            setGramErrorr(`You vault balance is 0 gm`);
            setCommonError("You vault balance is 0 gm");
          } else {
            setRupeeIn("");
            setRupeeInComplete("");
            setGramErrorr(`You can't Sell More then ${userWallet.gold} g`);
            setCommonError(`You can't Sell More then ${userWallet.gold} g`);
          }
        } else if (isOn == false && val > userWallet.silver) {
          setRupeeIn("");
          setRupeeInComplete("");
          setGramErrorr(`You can't Sell More then ${userWallet.silver} g`);
          setCommonError(`You can't Sell More then ${userWallet.silver} g`);
        }
      }
    }
    // const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
    // if (floatRegExp.test(val)) {

    // }
  };

  const rsAndGrmBtnClickHandlerForSell = (newVal, type) => {
    removeCoupon();
    if (type == "rupee") {
      let val = +(rupeeIn ? rupeeIn : "") + +newVal;
      let finalVal = val;
      setRupeeIn(fixDecimalDigit(finalVal, 2));
      setRupeeInComplete(finalVal);
      if (
        isOn &&
        userWallet &&
        val > 99.99 &&
        finalVal < userWallet.gold * sellGoldPrice
      ) {
        let grmCalcForGold = finalVal / sellGoldPrice;
        setGramIn(fixDecimalDigit(grmCalcForGold, 4));
        setGramInComplete(grmCalcForGold);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      } else if (
        isOn == false &&
        val > 99.99 &&
        finalVal < userWallet.silver * sellSilverPrice
      ) {
        // let finalVal = val / (+'1.03');
        let grmCalcForSilver = finalVal / sellSilverPrice;
        setGramIn(fixDecimalDigit(grmCalcForSilver, 4));
        setGramInComplete(grmCalcForSilver);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      } else if (val < 100) {
        let grmCalcFor = 0;
        if (isOn) {
          grmCalcFor = finalVal / sellGoldPrice;
        } else {
          grmCalcFor = finalVal / sellSilverPrice;
        }
        setGramIn(fixDecimalDigit(grmCalcFor, 4));
        setGramInComplete(grmCalcFor);
        setRupeeError("Please Enter Atleast Amount 100");
        setCommonError("Please Enter Atleast Amount 100");
      } else if (
        isOn &&
        userWallet &&
        finalVal > userWallet.gold * sellGoldPrice
      ) {
        setGramIn("");
        setGramInComplete("");
        setRupeeError("You cant sell this much amount of gold");
        setCommonError("You cant sell this much amount of gold");
      } else if (
        isOn == false &&
        finalVal > userWallet.silver * sellSilverPrice
      ) {
        setGramIn("");
        setGramInComplete("");
        setRupeeError("You cant sell this much amount of silver");
        setCommonError("You cant sell this much amount of silver");
      }
    } else {
      let newGram = +gramIn + +newVal;
      let val = newGram;
      setGramIn(fixDecimalDigit(newGram, 4));
      setGramInComplete(newGram);
      if (isOn && val > 99.99 / sellGoldPrice && val < userWallet.gold) {
        let rupeeCalcForGold = +val * +sellGoldPrice;
        let finalRupeeCalcForGold = rupeeCalcForGold;
        setRupeeIn(fixDecimalDigit(finalRupeeCalcForGold, 2));
        setRupeeInComplete(finalRupeeCalcForGold);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      } else if (
        isOn == false &&
        val > 99.99 / sellSilverPrice &&
        val < userWallet.silver
      ) {
        let grmCalcForSilver = +val * +sellSilverPrice;
        let finalGrmCalcForSilver = grmCalcForSilver;
        setRupeeIn(fixDecimalDigit(finalGrmCalcForSilver, 2));
        setRupeeInComplete(finalGrmCalcForSilver);
        setGramErrorr("");
        setRupeeError("");
        setCommonError("");
      } else if (
        val < 99.99 / sellGoldPrice ||
        val < 99.99 / sellSilverPrice
      ) {
        let rupeeCalcFor = 0;
        if (isOn) {
          rupeeCalcFor = +val * +sellGoldPrice;
        } else {
          rupeeCalcFor = +val * +sellSilverPrice;
        }
        setRupeeIn(fixDecimalDigit(rupeeCalcFor, 2));
        setRupeeInComplete(rupeeCalcFor);
        setGramErrorr("Please Add Gram Of Atleast 100 Rs");
        setCommonError("Please Add Gram Of Atleast 100 Rs");
      } else if (isOn && val > userWallet.gold) {
        if (userWallet.gold == 0) {
          setRupeeIn("");
          setRupeeInComplete("");
          setGramErrorr(`You vault balance is 0 gm`);
          setCommonError("You vault balance is 0 gm");
        } else {
          setRupeeIn("");
          setRupeeInComplete("");
          setGramErrorr(`You can't Sell More then ${userWallet.gold} g`);
          setCommonError(`You can't Sell More then ${userWallet.gold} g`);
        }
      } else if (isOn == false && val > userWallet.silver) {
        setRupeeIn("");
        setRupeeInComplete("");
        setGramErrorr(`You can't Sell More then ${userWallet.silver} g`);
        setCommonError(`You can't Sell More then ${userWallet.silver} g`);
      }
    }
  };

  const [kycDetails, setKycDetails] = useState({});
  const IsKycDone = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.baseUrl}/auth/validate/token`, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          const decryptedData = await funcForDecrypt(data.payload);
          setKycDetails(JSON.parse(decryptedData).data);
          if (JSON.parse(decryptedData).data.gst_number) {
            setGstNum(JSON.parse(decryptedData).data.gst_number);
            setIsGstVerified(true);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const [previewData, setPreviewData] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const previewModal = async () => {
    Notiflix.Loading.custom({svgSize:'180px',customSvgCode: '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>'});
    const dataToBeDecrypt = {
      orderType: isShow,
      itemType: isOn ? "GOLD" : "SILVER",
      amount: rupeeInComplete,
      gram: gramInComplete,
      // gst_number: props.gstNum,
      // currentMatelPrice: 33.22,
      currentMatelPrice:
        activeTabClick == "BUY"
          ? isOn
            ? goldPrice
            : silverPrice
          : isOn
            ? sellGoldPrice
            : sellSilverPrice,
      fromApp: false,
    };
    log("dataToBeDecrypt", dataToBeDecrypt);
    if (couponCode) {
      dataToBeDecrypt.couponCode = couponCode;
    }

    const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt);
    //
    const payloadToSend = {
      payload: resAfterEncryptData,
    };
    const token = localStorage.getItem("token");

    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        onUploadProgress: Notiflix.Loading.circle()
      },
    };
    axios
      .post(
        `${process.env.baseUrl}/user/order/preview`,
        payloadToSend,
        configHeaders
      )
      .then(async (resAfterPreview) => {
        const decryptedData = await funcForDecrypt(
          resAfterPreview.data.payload
        );
        log("preview", JSON.parse(decryptedData).data);
        setPreviewData(JSON.parse(decryptedData).data.preview);
        setTransactionId(JSON.parse(decryptedData).data.transactionCache._id);
        if (JSON.parse(decryptedData).statusCode == 200) {
          Notiflix.Loading.remove();
          if (isShow == "BUY") {
            setBuyModalShow(true);
          } else {
            setSellModalShow(true);
          }
        }
      })
      .catch(async (errInPreview) => {
        Notiflix.Loading.remove();
        const decryptedData = await funcForDecrypt(
          errInPreview.response.data.payload
        );
        let response = JSON.parse(decryptedData);
        if (response.messageCode == "TECHNICAL_ERROR") {
          updateMetalPrice();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Session Expired",
          });
        } else if (response.messageCode == "KYC_PENDING") {
          setKycError(response.message);
        } else if (response.messageCode == "SESSION_EXPIRED") {
          updateMetalPrice();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Session Expired",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.message,
          });
        }
      });
  };

  const closeSellModal = () => {
    setSellModalShow(false);
    updateMetalPrice();
    setGramIn("");
    setGramInComplete("");
    setRupeeIn("");
    setRupeeInComplete("");
  };

  const verifyGst = async () => {
    const dataToBeDecrypt = {
      value: gstNum,
    };
    const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt);
    //
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
        if (JSON.parse(decryptedData).status) {
          setIsGstVerified(true);
          setErrorMess("");
        }
      })
      .catch(async (errInGst) => {
        const decryptedData = await funcForDecrypt(
          errInGst.response.data.payload
        );
        let response = JSON.parse(decryptedData);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.message,
        });
      });
  };

  const handleCoupons = async (item) => {
    // if (coupon === undefined) {
    //     setCouponError("");
    // } else {
    const data = {
      code: item.code,
      amount: rupeeInComplete,
      itemType: isOn ? "GOLD" : "SILVER",
    };

    try {
      const resAfterEncrypt = await AesEncrypt(data);

      const body = {
        payload: resAfterEncrypt,
      };
      const token = localStorage.getItem("token");
      const configHeaders = { headers: { "Content-Type": "application/json" } };
      const response = await axios.post(
        `${process.env.baseUrl}/user/coupons/validate`,
        body,
        configHeaders
      );
      //
      const decryptedData = await AesDecrypt(response.data.payload);

      const result = JSON.parse(decryptedData);

      setCouponsCode(item.code);
      setCouponError("");
      handleApplyCoupon();
    } catch (error) {
      setCouponError(`${item.code} is not applicable`);
      // Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: 'Coupon is not applicable',
      // })
    }
  };
  const handleApplyCoupon = () => {
    setCouponError('');
    setShowAppliedPopup(true);
    setTimeout(() => {
      setShowAppliedPopup(false);
      // props.onHide();
    }, 5000);
  };

  return (
    <>
    {showAppliedPopup && 
            <CouponAppliedPopup show={showAppliedPopup} />
      }
      <CouponsModal
        couponCode={couponCode}
        couponsList={couponsList}
        itemType={isOn ? "GOLD" : "SILVER"}
        setCouponsCode={setCouponsCode}
        amount={rupeeIn}
        show={couponsShow}
        handleApplyCoupon={handleApplyCoupon}
        onHide={() => setCouponsShow(false)}
      />
      {buyModalShow && (
        <BuyModal
          show={buyModalShow}
          transactionId={transactionId}
          previewData={previewData}
          couponCode={couponCode}
          isOn={isOn}
          isShow={isShow}
          gstNum={gstNum}
          goldPrice={fixDecimalDigit(goldPrice, 2)}
          reset={reset}
          silverPrice={fixDecimalDigit(silverPrice, 2)}
          rupeeIn={rupeeIn}
          gramIn={gramIn}
          onHide={() => setBuyModalShow(false)}
        />
      )}
      {sellModalShow && (
        <SellModal
          show={sellModalShow}
          transactionId={transactionId}
          previewData={previewData}
          isShow={isShow}
          gstNum={gstNum}
          isOn={isOn}
          reset={reset}
          goldPrice={fixDecimalDigit(sellGoldPrice, 2)}
          silverPrice={fixDecimalDigit(sellSilverPrice, 2)}
          rupeeIn={rupeeIn}
          gramIn={gramIn}
          onHide={closeSellModal}
        />
      )}
      <div className={style.buy_and_sell_bg}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12" style={{ marginBottom: "100px" }}>
              <div className={style.investment}>
                Invest Your Savings
                <br />
                Just a click away
              </div>
              <div className={style.gold_bars_with_text}>
                <div className={style.gold_bars}>
                  <Image
                    src="/images/gold-bars.svg"
                    height={50}
                    width={50}
                    alt="goldBars"
                  />
                </div>
                <div className={style.gold_bars_text}>
                  Invest or sell 24 karat Gold from the comfort of your home.
                </div>
              </div>
              <div className={style.digi_gold_content}>
                  We at Bright DiGi Gold encourage users to participate in seamless Gold/Silver transactions through Digital Buying and Selling, with a minimum transaction value of Rs.10/-. The aim is to promote hassle-free Gold/Silver transactions.
              </div>
              <div className={style.secured_with_Img}>
                <div className={style.secured}>Secured with</div>
                <div className={`${style.secured_img}`}>
                  <Image
                    src="/images/brinks.svg"
                    height={100}
                    width={130}
                    alt="secured_img"
                  />
                </div>
              </div>

              {/* <div className={style.download_application}>Download Our App</div> */}
              <div className={style.download_btn + ' flex-md-column flex-lg-row'}>
                <div className={style.google_play}>
                  <Link href="https://play.google.com/store/apps/details?id=com.brightdigigold.customer" target='_blank'>
                    <   Image src={"/images/playstore.svg"} height={150} width={400} alt='google_play' />
                  </Link>
                </div>
                <div className={style.apple_play}>
                  <Link href="https://apps.apple.com/in/app/bright-digi-gold-buy-24k-gold/id1640972173" target='_blank'>
                    <Image src={"/images/appstore.svg"} height={150} width={400} alt='apple_play' />
                  </Link>
                </div>
              </div>
              <div className={`${style.startupIndia}`}>
                    <Image src={"/images/Startup India.svg"} width={200} height={200} />
              </div>
            </div>
            <div className="col-md-6 col-12 sell_buy">
              <div className={style.sell_buy}>
                <div className="container">
                  <div className="row">
                    <div
                      className="col-6 text-center p-0 "
                      onClick={() => handleClick("BUY")}
                    >
                      <div
                        className={`${isShow === "BUY" ? "active" : "inactive"
                          }`}
                      >
                        Buy
                      </div>
                    </div>
                    <div
                      className="col-6 text-center p-0"
                      onClick={() => handleClick("SELL")}
                    >
                      <div
                        className={`${isShow === "SELL" ? "active" : "inactive"
                          }`}
                      >
                        Sell
                      </div>
                    </div>
                  </div>
                </div>

                <div className={style.sell_buy_content}>
                  <div className="">
                    <div className={style.toggle_bg}>
                      {isOn ? (
                        <label className={style.toggle}>
                          <input type="checkbox" id="checkbox" />
                          <span className={style.slider} onClick={handleToggle}>
                            {isOn ? (
                              <Image
                                className="gold"
                                src={"/images/off.png"}
                                height={50}
                                width={50}
                                alt="gold"
                              />
                            ) : (
                              <Image
                                className="silver"
                                src={"/images/on.png"}
                                height={50}
                                width={50}
                                alt="silver"
                              />
                            )}
                          </span>
                          <span
                            className={style.labels}
                            data-on="Silver | "
                            data-off="Gold | "
                            onClick={handleToggle}
                          >
                            {" "}
                          </span>
                        </label>
                      ) : (
                        <label className={style.toggle_silver}>
                          <input type="checkbox" id="goldcheckbox" />
                          <span className={style.slider} onClick={handleToggle}>
                            {isOn ? (
                              <Image
                                className="gold"
                                src={"/images/off.png"}
                                height={50}
                                width={50}
                                alt="gold"
                              />
                            ) : (
                              <Image
                                className="silver"
                                src={"/images/on.png"}
                                height={50}
                                width={50}
                                alt="silver"
                              />
                            )}
                          </span>
                          <span
                            className={style.labels}
                            data-on="Silver | "
                            data-off="Gold | "
                            onClick={handleToggle}
                          >
                            {" "}
                          </span>
                        </label>
                      )}
                    </div>
                    {isOn ? (
                      <div className={style.live_gold_content}>
                        {" "}
                        Live 24K 99.9% Gold Price
                      </div>
                    ) : (
                      <div className={style.live_gold_content}>
                        {" "}
                        Live 24K 99.99% Silver Price
                      </div>
                    )}
                    {isOn ? (
                      <div className={style.live_gold_price}>
                        {isShow === "BUY" ? (
                          <>
                            ₹{fixDecimalDigit(goldPrice, 2)}/gm{" "}
                            <span className={style.gst_percentage}>
                              {" "}
                              + 3% GST
                            </span>
                          </>
                        ) : (
                          <>₹{fixDecimalDigit(sellGoldPrice, 2)}/gm</>
                        )}{" "}
                      </div>
                    ) : (
                      <div className={style.live_silver_price}>
                        {isShow === "BUY" ? (
                          <>
                            ₹{fixDecimalDigit(silverPrice, 2)}/gm{" "}
                            <span className={style.gst_percentage}>
                              {" "}
                              + 3% GST
                            </span>
                          </>
                        ) : (
                          <>
                            ₹{fixDecimalDigit(sellSilverPrice, 2)}/gm{" "}
                            {/* <span className={style.gst_percentage}>
                              {" "}
                              + 3% GST
                            </span> */}
                          </>
                        )}
                      </div>
                    )}

                    <div className={style.gold_price_rise}>
                      <span className={style.up_arrow}>
                        {isOn ? (
                          <>
                            {" "}
                            {goldData.up ? (
                              <>
                                <AiOutlineArrowUp />
                              </>
                            ) : (
                              <>
                                <AiOutlineArrowDown style={{ color: "red" }} />
                              </>
                            )}{" "}
                          </>
                        ) : (
                          <>
                            {silverData.up ? (
                              <>
                                <AiOutlineArrowUp />
                              </>
                            ) : (
                              <>
                                <AiOutlineArrowDown style={{ color: "red" }} />
                              </>
                            )}
                          </>
                        )}
                        {isOn ? (
                          <>
                            <span style={{ color: goldData.up ? "" : "red" }}>
                              {goldData.percentage} %
                            </span>
                          </>
                        ) : (
                          <>
                            <span style={{ color: silverData.up ? "" : "red" }}>
                              {silverData.percentage} %
                            </span>
                          </>
                        )}
                      </span>
                      Since Yesterday
                    </div>
                    <div className={style.expire_bg}>
                      <div className={style.expire_content}>
                        {isOn ? 'Gold' : 'Silver'} rate expires in{" "}
                        <CountDown
                          timer={[hours, minutes, seconds]}
                          onRestart={reset}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <Image
                      src={
                        isOn ? "/images/Maskgold.svg" : "/images/Masksilver.svg"
                      }
                      height={80}
                      width={180}
                      alt="gold-img"
                    ></Image>
                  </div>
                </div>
                {isShow == "BUY" ? (
                  <>
                    <div className={style.input_type}>
                      <div className={style.rupees}>
                        <input
                          type="tel"
                          className={style.from_field}
                          value={rupeeIn}
                          maxLength={9}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(/[^0-9]/g, '');
                            enterRupeeHandler(updatedValue);
                          }}
                          placeholder="Enter Rupees"
                        />
                        <div className={style.amount}>
                          <div
                            onClick={() => rsAndGrmBtnClickHandler(50, "rupee")}
                            className={style.amount_price}
                          >
                            +₹50
                          </div>
                          <div
                            onClick={() =>
                              rsAndGrmBtnClickHandler(100, "rupee")
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
                          value={gramIn}
                          maxLength={9}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(/[^0-9.]/g, '');
                            enterGramHandler(updatedValue);
                          }}
                          placeholder="Enter Grams"
                        />
                        <div className={style.amount}>
                          <div
                            onClick={() =>
                              rsAndGrmBtnClickHandler("0.5", "gram")
                            }
                            className={style.amount_price}
                          >
                            +0.5 gm
                          </div>
                          <div
                            onClick={() => rsAndGrmBtnClickHandler("1", "gram")}
                            className={style.amount_price}
                          >
                            +1.0 gm
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* {rupeeError && (
                      <div
                        className="text-danger text-center"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {rupeeError}
                      </div>
                    )}
                    {gramError && (
                      <div
                        className="text-danger text-center"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {gramError}
                      </div>
                    )} */}
                    {commonError && (
                      <div
                        className="text-danger text-center"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {commonError}
                      </div>
                    )}
                  {couponsList.length > 0 && 
                  <>
                    <div className={style.coupons_all}>
                      <div className={style.coupons}>Coupons</div>
                      <div
                        className={style.view_all}
                        onClick={() => setCouponsShow(true)}
                      >
                        View All
                      </div>
                    </div>
                  
                    {couponCode.length == 0  &&
                    <div className="coupons_code_bg">
                      <div className="p-3">
                        <div className="row">
                          <div className="col-1 pe-0">
                            <div className="star">
                              <Image
                                src={"/images/sale.png"}
                                height={20}
                                width={20}
                                alt="sale"
                              />
                            </div>
                          </div>
                          <div className="col-9 px-0 pe-0">
                            <div className="coupons_code_text">
                              {firstCoupon.description}
                            </div>
                          </div>
                          <div className="col-2 px-0">
                            <div className="tap_to_apply">
                              {couponCode.length > 1 ? (
                                <button type="submit" onClick={() => removeCoupon()}>
                                  Remove
                                </button>
                              ) : (
                                <button
                                  type="submit"
                                  onClick={() => handleCoupons(firstCoupon)}
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                    }
                    <div className="text-danger text-center mt-2">
                      {couponError}
                    </div>

                    {couponCode.length > 1 ? (
                      <div className={style.code_apply}>
                        <div className={style.code}>{couponCode}</div>
                        <div onClick={removeCoupon} className={style.apply}>
                          Remove
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    </>
                  }

                    <div className={style.form}>
                      <div className={style.gst}>GST No. (Optional)</div>
                      <div className={style.gst_input}>
                        <input
                          type="text"
                          readonly={isGstVerified ? "readonly" : false}
                          value={gstNum}
                          onChange={gstHandler}
                          placeholder="Enter GST No."
                        />
                        {gstNum.length > 0 ? (
                          <>
                            {" "}
                            {isGstVerified ? (
                              <VscVerifiedFilled className="verified-icon" />
                            ) : (
                              <div
                                className="verified-text"
                                onClick={verifyGst}
                              >
                                <span>Verify</span>
                              </div>
                            )}{" "}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {/* {kycDetails.gst_number ? readonly={true} : ""} */}
                    {kycError ? (
                      <div className={style.complete_kyc_btn}>
                        <div className={style.kyc_btn}>
                          <button>
                            <Link href="/profile">{kycError}</Link>
                          </button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {errorMess && (
                      <div
                        className="text-danger text-center"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {errorMess}
                      </div>
                    )}
                    <div className={style.sell_buy_btn} onClick={buyHandler}>
                      <div className={style.buy_btn}>
                        <button className="button">BUY</button>
                      </div>
                    </div>
                  </>
                ) : isShow == "SELL" ? (
                  <>
                    <div className={style.sell_balance_weight_bg}>
                      <div className={style.balance_weight}>
                        <div className={style.wallet_balance}>
                          <Image
                            src={"/images/purse.svg"}
                            height={30}
                            width={30}
                            alt="purse"
                          ></Image>
                          <div>
                            <div className={style.sell_balance_weight_text}>
                              Balance
                            </div>
                            <div className={style.sell_balance_weight_text1}>
                              ₹{" "}
                              {log(
                                `isOn ki fixDecimalDigit(Number(walletSellGold),4)=${fixDecimalDigit(
                                  walletSellGold,
                                  2
                                )} :: fixDecimalDigit(Number(walletSellSilver),4)=${fixDecimalDigit(
                                  walletSellSilver,
                                  2
                                )} `
                              )}
                              {isOn ? (
                                <>
                                  {fixDecimalDigit(walletSellGold, 2)}
                                </>
                              ) : (
                                <>
                                  {fixDecimalDigit(walletSellSilver, 2)}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={style.weight}>
                          <div className={style.sell_balance_weight_text}>
                            Weight
                          </div>
                          <div className={style.sell_balance_weight_text1}>
                            {isOn ? (
                              <>{userWallet?.gold} g</>
                            ) : (
                              <>{userWallet?.silver} g</>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={style.input_type}>
                      <div className={style.rupees}>
                        <input
                          type="tel"
                          className={style.from_field}
                          value={rupeeIn}
                          maxLength={9}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(/[^0-9]/g, '');
                            enterRupeeHandlerForSell(updatedValue);
                          }}
                          placeholder="Enter Rupees"
                        />
                        <div className={style.amount}>
                          <div
                            onClick={() =>
                              rsAndGrmBtnClickHandlerForSell(100, "rupee")
                            }
                            className={style.amount_price}
                          >
                            +₹100
                          </div>
                          <div
                            onClick={() =>
                              rsAndGrmBtnClickHandlerForSell(200, "rupee")
                            }
                            className={style.amount_price}
                          >
                            +₹200
                          </div>
                        </div>
                      </div>
                      <div className={style.gram}>
                        <input
                          type="tel"
                          className={style.from_field}
                          value={gramIn}
                          maxLength={9}
                          onChange={(event) => {
                            const { name, value } = event.target;
                            const updatedValue = value.replace(/[^0-9.]/g, '');
                            enterGramHandlerForSell(updatedValue);
                          }}
                          placeholder="Enter Grams"
                        />
                        <div className={style.amount}>
                          <div
                            onClick={() =>
                              rsAndGrmBtnClickHandlerForSell("2.0", "gram")
                            }
                            className={style.amount_price}
                          >
                            +2.0 gm
                          </div>
                          <div
                            onClick={() =>
                              rsAndGrmBtnClickHandlerForSell("5.0", "gram")
                            }
                            className={style.amount_price}
                          >
                            +5.0 gm
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center d-flex justify-content-around">
                      {commonError && (
                        <div
                          className="text-danger text-center"
                          style={{ fontSize: "12px", marginTop: "5px" }}
                        >
                          {commonError}
                        </div>
                      )}
                      {/* <div className="text-danger pt-3">{rupeeError}</div>
                      <div className="text-danger pt-3">{gramError}</div> */}
                    </div>
                    {kycDetails?.isKycDone ? (
                      <>
                        {sellEnabled && (
                          <div className={style.sell_buy_btn}>
                            <div
                              onClick={SellHandler}
                              className={style.buy_btn}
                            >
                              <button className="button">SELL</button>
                            </div>
                          </div>
                        )}
                        {!sellEnabled && (
                          <div className={style.sell_buy_btn}>
                            <div className={style.kyc_btn}>
                              <button>Your do not have enough balance</button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className={style.complete_kyc_btn}>
                          <div className={style.kyc_btn}>
                            <button>
                              <Link href="/profile">
                                Complete Your KYC first
                              </Link>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {kycError ? (
                      <div className={style.complete_kyc_btn}>
                        <div className={style.kyc_btn}>
                          <button>
                            <Link href="/profile">{kycError}</Link>
                          </button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className={style.trusted_and_secured}>
        <div className="container">
          <div className={style.trusted_text}>Trusted and secured by</div>
          <div className={style.trusted_brand}>
            {trustedAndSecured.map((item, key) => {
              return (
                <>
                  <div>
                    <Image
                      src={item.value}
                      height={100}
                      width={100}
                      alt="trusted-images"
                    />
                  </div>
                </>
              );
            })}
          </div>

        </div>
      </div> */}
      <style>{`
                .gold{
                    position:absolute;
                    right:0px;
                    top:2px;
                }
                .silver{
                    position:absolute;
                    left:45px;
                    top:0px;
                }
                .sell_buy .active{
                padding:20px;
                background: rgba(44, 123, 172, 0.2);
                border-radius: 8px 0px 0px 0px;
                font-weight: 400;
                font-size: 18px;
                line-height: 100%;
                text-align: center;
                text-transform: capitalize;
                color: #FFFFFF;
                cursor:pointer;
                font-family: NunitoSans-Bold;
                }
                .coupons_code_bg{
                    margin-top:20px;
                    margin: 20px;
                    border-radius: 10px;
                    background: rgba(44, 123, 172, 0.20);

                }
                .coupons_code_text{
                  color: #FFF;
                  font-size: 14px;
                  line-height: 140%;
                  font-family: NunitoSans-Bold;
                }
                .tap_to_apply{
                  color: #FFD662;
                  text-align: center;
                  font-size: 14px;
                  font-family: DM Sans;
                  font-weight: 500;
                  line-height: 120%;
                  text-transform: capitalize;

                }
                .star{
                  margin-top:4px;
                  margin-right:2px;
                }
                .sell_buy .inactive{
                    padding:20px;
                    border-radius: 8px;
                    font-weight: 400;
                        font-size: 18px;
                        line-height: 100%;
                        text-align: center;
                        text-transform: capitalize;
                        color: #2C7BAC;
                        cursor:pointer;
                    }
                `}</style>
      <div
        className={`aside-backdrop ${showAside ? "show" : ""}`}
        onClick={handleCloseAside}
      />
      <LoginAside
        show={showAside}
        redirectData={redirectData}
        onHide={handleCloseAside}
        toggleHeader={toggleHeader}
        setToggleHeader={setToggleHeader}
      />

    </>
  );
};

export default SellAndBuy;
