"use client";
import { ArrowUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectActualAmount,
  SelectEnteredAmount,
  SelectGst,
  SelectMetalQuantity,
  SelectMetalType,
  SelectPurchaseType,
  SelectTotalAmount,
  SelectTransactionType,
  selectMetalPricePerGram,
  setEnteredAmount,
  setMetalPrice,
  setMetalType,
  setPurchaseType,
  setTransactionType,
} from "@/redux/shopSlice";
import {
  clearCoupon,
  isCouponApplied,
  selectAppliedCouponCode,
  setCouponError,
} from "@/redux/couponSlice";
import Timer from "../globalTimer";
import {
  ParseFloat,
  funForAesEncrypt,
  funcForDecrypt,
} from "../helperFunctions";
import Modal from "../modals/modal";
import axios from "axios";
import Swal from "sweetalert2";
import { selectUser } from "@/redux/userDetailsSlice";
import ModalCoupon from "../modals/modalcoupon";
import Notiflix from "notiflix";
import { setLiveGoldPrice, setLiveSilverPrice } from "@/redux/cartSlice";
import LoginAside from "../authSection/loginAside";
import { SelectGoldData, SelectSilverData } from "@/redux/metalSlice";
import { selectIsloggedIn, setShowProfileForm } from "@/redux/authSlice";
import { useSpring, animated } from 'react-spring';
import ShowVaultBuySell from "./showVaultBuySell";
import { useRouter } from "next/navigation";
import UpiModal from "../myAccount/payoutOptions/addNewUpiId";
import NextImage from "../nextImage";
import LivePrice from '../../../public/lottie/LivePrice.gif'
import coupon from '../../../public/coupon.png';

const BuySell = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isgold, setIsGold] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const [isModalCouponOpen, setModalCouponOpen] = useState<boolean>(false);
  const [activeTabPurchase, setActiveTabPurchase] = useState<string>("rupees");
  const [activeTab, setActiveTab] = useState<string>("buy");
  const [transactionId, setTransactionId] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const goldData = useSelector(SelectGoldData);
  const silverData = useSelector(SelectSilverData);
  const gst = useSelector(SelectGst);
  const metalType = useSelector(SelectMetalType);
  const transactionType = useSelector(SelectTransactionType);
  const purchaseType = useSelector(SelectPurchaseType);
  const enteredAmount = useSelector(SelectEnteredAmount);
  const actualAmount = useSelector(SelectActualAmount);
  const totalAmount = useSelector(SelectTotalAmount);
  const metalQuantity = useSelector(SelectMetalQuantity);
  const metalPricePerGram = useSelector(selectMetalPricePerGram);
  const isAnyCouponApplied = useSelector(isCouponApplied);
  const appliedCouponCode = useSelector(selectAppliedCouponCode);
  const isloggedIn = useSelector(selectIsloggedIn);
  const [previewData, setPreviewData] = useState<[]>([]);
  const [OpenUpiModal, setOpenUpiModal] = useState<boolean>(false);

  const toggleOpenUpiModal = () => {
    setOpenUpiModal(prev => !prev)
  }

  const previewModal = async () => {

    Notiflix.Loading.custom({
      svgSize: "180px",
      customSvgCode:
        '<object type="image/svg+xml" data="/svg/pageloader.svg">svg-animation</object>',
    });
    const dataToBeDecrypt: {
      orderType: string;
      itemType: string;
      unit: string;
      gram: number;
      amount: number;
      currentMatelPrice: number;
      fromApp: boolean;
      couponCode?: string;
    } = {
      orderType: purchaseType.toUpperCase(),
      itemType: metalType.toUpperCase(),
      unit: "GRAMS",
      gram: metalQuantity,
      amount: totalAmount,
      currentMatelPrice: metalPricePerGram,
      fromApp: false,
    };
    if (isAnyCouponApplied) {
      dataToBeDecrypt.couponCode = appliedCouponCode ? appliedCouponCode : "";
    }
    const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt);
    const payloadToSend = {
      payload: resAfterEncryptData,
    };
    const token = localStorage.getItem("token");
    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        // onUploadProgress: Notiflix.Loading.circle()
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
        setPreviewData(JSON.parse(decryptedData).data.preview);
        setTransactionId(JSON.parse(decryptedData).data.transactionCache._id);
        if (JSON.parse(decryptedData).statusCode == 200) {
          Notiflix.Loading.remove();
          setModalOpen(true);
        }
      })
      .catch(async (errInPreview) => {
        Notiflix.Loading.remove();
        const decryptedData = await funcForDecrypt(
          errInPreview.response.data.payload
        );
        let response = JSON.parse(decryptedData);
        if (response.messageCode == "TECHNICAL_ERROR") {
          Swal.fire({
            html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
            titleText: "Session Expired",
          });
        } else if (response.messageCode == "KYC_PENDING") {
          Swal.fire({
            title: "Oops...!",
            titleText: response.message,
            padding: "2em",
            html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
            showCancelButton: true,
            confirmButtonText: "Add Your Kyc",
            denyButtonText: `Don't save`
          }).then((result) => {
            if (result.isConfirmed) {
              router.push('/myAccount')
            }
          });

        } else if (response.messageCode == "SESSION_EXPIRED") {
          // setKycError(response.message);
        } else if (response.messageCode == "SESSION_EXPIRED") {
          Swal.fire({
            html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
            title: "Oops...",
            titleText: "Session Expired",
          });
        } else if (response.message == "Please add Bank/UPI details.") {
          Swal.fire({
            title: "Oops...!",
            titleText: response.message,
            padding: "2em",
            html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
            showCancelButton: true,
            confirmButtonText: "Add Your Bank/UPI Details",
            denyButtonText: `Don't save`
          }).then((result) => {
            if (result.isConfirmed && !OpenUpiModal) {
              toggleOpenUpiModal();
            }
          });
        } else {
          Swal.fire({
            html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
            title: "Oops...",
            titleText: response.message,
          });
        }
      });
  };

  useEffect(() => {
    dispatch(setMetalType("gold"));
    dispatch(setEnteredAmount(500));
    dispatch(setCouponError(""));
    dispatch(setPurchaseType("buy"));
    dispatch(setTransactionType("rupees"));
    dispatch(clearCoupon());
    dispatch(setLiveGoldPrice(goldData.totalPrice));
    dispatch(setLiveSilverPrice(silverData.totalPrice));
  }, []);

  const toggleMetal = () => {
    setIsGold(!isgold);
    dispatch(setMetalType(!isgold ? "gold" : "silver"));
    dispatch(setEnteredAmount(0));
    setValidationError("");
    dispatch(clearCoupon());
  };
  // const toggleCoupon = () => {
  //   setShowCoupon(!showCoupon);
  //   dispatch(setCouponError(""));
  // };
  const handleTabBuyAndSell = (tab: "buy" | "sell") => {
    setActiveTab(tab);
    dispatch(setEnteredAmount(0));
    dispatch(setPurchaseType(tab));
    setValidationError("");
    dispatch(clearCoupon());
    setEnteredAmount(100);
  };

  const handleTabRupeesAndGrams = (tab: "rupees" | "grams") => {
    dispatch(clearCoupon());
    setActiveTabPurchase(tab);
    dispatch(setTransactionType(tab));
    dispatch(setEnteredAmount(tab === "rupees" ? totalAmount : ParseFloat(metalQuantity, 4)));
    setValidationError("");
  };

  let goldPriceWithGST = ParseFloat(
    `${goldData.totalPrice * 0.03 + goldData.totalPrice}`,
    2
  );

  let silverPriceWithGST = ParseFloat(
    `${silverData.totalPrice * 0.03 + silverData.totalPrice}`,
    2
  );

  const metalPriceWithGst =
    metalType == "gold" ? goldPriceWithGST : silverPriceWithGST;
  const actualPurchasingInGm = ParseFloat(
    200000 / ParseFloat(metalPriceWithGst, 2),
    3
  );

  const handleEnteredAmountChange = (e: any) => {
    // e.preventDefault();
    dispatch(clearCoupon());
    setActiveTabPurchase('rupees')
    dispatch(setTransactionType('rupees'))
    const enteredValue = ParseFloat(e.target.value, 4);
    if (activeTabPurchase === 'rupees' && e.target.value.includes('.')) {
      setValidationError("Decimal values are not allowed for rupees");
      return; // Exit the function early
    }
    if (isAnyCouponApplied) {
      if (enteredValue < 500) {
        dispatch(clearCoupon());
      }
    }
    if (!enteredAmount) {
      setValidationError("Please enter amount");
    } else if (actualAmount < 10) {
      setValidationError("Minimum purchase amount is Rs.10");
    }
    setValidationError("");

    if (enteredValue > 200000) {
      setValidationError(
        `We appreciate your trust to buy  ${metalType} on our platform, but our current limit is ₹2 lakhs only. Please change the amount.`
      );
      return;
    } else {
      dispatch(setEnteredAmount(+enteredValue));
    }
  };

  const handleEnteredAmountChangeGrams = (e: any) => {
    dispatch(clearCoupon());
    setActiveTabPurchase('grams')
    dispatch(setTransactionType('grams'));

    const enteredValue = ParseFloat(e.target.value, 4);

    dispatch(clearCoupon());
    if (!enteredAmount) {
      setValidationError("Please enter amount");
    } else if (actualAmount < 10) {
      setValidationError("Minimum purchase amount is Rs.10");
    }
    setValidationError("");


    if (Number(e.target.value) > ParseFloat(actualPurchasingInGm, 4)) {
      setValidationError(
        `We appreciate your trust to buy  ${metalType} on our platform, but our current limit is ₹2 lakhs only. Please change the amount.`
      );
      return;
    } else {
      dispatch(setEnteredAmount(+enteredValue));
    }
  };

  const handleBuyClick = (e: any) => {

    setValidationError("");
    if (!isloggedIn) {
      setOpenLoginAside(true);
      return;
    }

    if (!user.data.isBasicDetailsCompleted) {
      dispatch(setShowProfileForm(true));
      return;
    }

    if (!enteredAmount) {
      setValidationError("Please enter amount");
      return;
    } else if (totalAmount !== undefined && totalAmount < 10) {
      setValidationError("Minimum Purchase amount is Rs.10");
      return;
    }
    setValidationError("");
    previewModal();
  };


  const minimumSellInGramsGold = ParseFloat(100 / goldData.salePrice, 4)
  const minimumSellInGramsSilver = ParseFloat(100 / silverData.salePrice, 4)


  const handleSellClick = (e: any) => {
    setValidationError("");
    if (!isloggedIn) {
      setOpenLoginAside(true);
      return;
    }

    if (!enteredAmount) {
      setValidationError("Please enter amount");
      return;
    }

    const minimumSellAmountInRupees = 100;

    const minimumSellAmount = activeTabPurchase === 'grams'
      ? (metalType === "gold" ? minimumSellInGramsGold : minimumSellInGramsSilver)
      : minimumSellAmountInRupees;

    if (enteredAmount < minimumSellAmount) {
      setValidationError(`Minimum Sell amount is ${minimumSellAmount}`);
      return;
    }


    if (!user.data.isKycDone) {
      Swal.fire({
        title: "Oops...!",
        titleText: "It seems your KYC is pending. Please complete your KYC first.",
        padding: "2em",
        html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
        showCancelButton: true,
        confirmButtonText: "Add Your Kyc",
        denyButtonText: `Don't save`
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/myAccount')
        }
      });
      return;
    }
    setValidationError("");
    previewModal();
  };

  const QuickBuySellButtons = ({ amounts, unit, onClickHandler }: any) => (
    <div className={`mt-4 flex justify-between ${amounts == 500 ? 'pb-2' : ''}`}>
      {amounts.map((amount: any) => (
        <button
          key={amount}
          onClick={() => {
            if (isAnyCouponApplied) {
              if (amount < 500) {
                dispatch(clearCoupon());
              }
            }
            setValidationError("");
            dispatch(setEnteredAmount(amount));
          }}
          className="bg-themeLight001 border bold border-blue-200 rounded-md py-1 px-2 sm:px-4 text-white text-sm relative" // Added relative positioning
        >
          {unit === "rupees" ? `₹${amount}` : `${amount}gm`}
          {purchaseType === "buy" && amount === 500 && ( // Conditional rendering for the "POPULAR" tag
            <span className="absolute bottom-[-16px] left-0 bg-themeBlue text-black semibold px-0.5 sm:px-1 py-0 sm:py-0.5 text-xxs sm:text-xs rounded">
              POPULAR
            </span>
          )}
        </button>
      ))}
    </div>
  );



  useEffect(() => {
    if (isgold && activeTab == "buy") {
      dispatch(setMetalPrice(goldData.totalPrice));
    } else if (isgold && activeTab == "sell") {
      dispatch(setMetalPrice(goldData.salePrice));
    } else if (!isgold && activeTab == "buy") {
      dispatch(setMetalPrice(silverData.totalPrice));
    } else {
      dispatch(setMetalPrice(silverData.salePrice));
    }
  }, [isgold, activeTab, toggleMetal]);


  const openModal = () => {
    if (!isloggedIn) {
      setOpenLoginAside(true);
      return;
    }
    if (!enteredAmount) {
      setValidationError("Please enter amount");
      return;
    }
    dispatch(setCouponError(""))
    setModalCouponOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalCouponOpen(false);
  };


  const [style, api] = useSpring(() => ({
    opacity: 0,
    transform: 'translateX(100%)',
    config: { duration: 2000 },
  }));

  useEffect(() => {
    api.start({
      opacity: 1,
      transform: `translateX(${isgold && purchaseType === 'buy' ? '0%' : '100%'})`,
    });
  }, [isgold, purchaseType, api]);

  const toggleUPImodal = "toggleUPImodal"
  const [upiUpdated, setupiUpdated] = useState(false);

  return (
    <>
      <div className="">
        {openLoginAside && (
          <LoginAside
            isOpen={openLoginAside}
            onClose={() => setOpenLoginAside(false)}
          />
        )}
        {OpenUpiModal && (
          <UpiModal
            toggled={OpenUpiModal}
            toggleUPImodal={toggleUPImodal}
            upiUpdated={upiUpdated}
            setupiUpdated={setupiUpdated}
            onClose={toggleOpenUpiModal}
          />
        )}
        <div className="block xl:pl-24 ">
          <div className="tab-bg  rounded-lg  relative">
            <div className="grid grid-cols-2">
              <div
                className={`text-center py-3 border-r-2 border-slate-500 extrabold cursor-pointer ${activeTab === "buy"
                  ? "bg-themeLight text-white active"
                  : "bg-themeLight01 text-sky-600"
                  }`}
                onClick={() => {
                  handleTabBuyAndSell("buy");
                }}
              >
                BUY
              </div>
              <div
                className={`text-center py-3 cursor-pointer ${activeTab === "sell"
                  ? "bg-themeLight text-white active"
                  : "bg-themeLight01 text-sky-600"
                  }`}
                onClick={() => {
                  if (!isloggedIn) {
                    setOpenLoginAside(true);
                    return;
                  } else {
                    handleTabBuyAndSell("sell")
                  }
                }}
              >
                SELL
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 items-end">
              <div className="w-full ">
                <div
                  className="toggle_button_spacing pl-1 mt-4"
                  onChange={toggleMetal}
                >
                  <label className="toggle-button">
                    <input type="checkbox" />
                    <div className="slider"></div>
                    <div className="text-gold text-gold1">Silver</div>
                    <div className="text-silver text-silver1">Gold</div>
                  </label>
                </div>
                <div>
                  <div className="text-white pl-4 mt-2">
                    <NextImage src={LivePrice} alt="Live Price" className="inline-block" style={{ width: "30px", height: "auto" }} priority={true} />
                    <span className="pl-1 bold">
                      {metalType === "gold" ? "GOLD PRICE" : "SILVER PRICE"}
                    </span>
                  </div>
                  <div className="text-shine text-base sm:text-xl bold pt-0 py-2 pl-4 items-center  flex">
                    <span className="text-2xl pr-0.5">₹</span>
                    {isgold ? (
                      <>
                        {activeTab === "buy" ? (
                          <span className="">{goldData.totalPrice}</span>
                        ) : (
                          <span>{goldData.salePrice}</span>
                        )}
                      </>
                    ) : (
                      <>
                        {activeTab === "buy" ? (
                          <div> {silverData.totalPrice}</div>
                        ) : (
                          <div>{silverData.salePrice}</div>
                        )}
                      </>
                    )}
                    /gm
                    <div className="text-xs">
                      {purchaseType === "buy" ? <span className="pl-1 text-xxs sm:text-xs mt-1">+3% GST</span> : ""}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 pl-4">
                    {metalType == "gold" ? "24k 99.9% Pure Gold" : "99.99% Pure Silver"}
                  </p>
                  <span className="text-xxs sm:text-xs font-base pl-4 flex">
                    {isgold ? (
                      <div
                        className={`${goldData.percentage >= 0
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {goldData.percentage >= 0 ? (
                          <ArrowUpIcon className="h-4 inline-block text-green-500" />
                        ) : (
                          <ChevronDownIcon className="h-4 inline-block text-red-500" />
                        )}
                        {goldData.percentage} %
                      </div>
                    ) : (
                      <div
                        className={`${silverData.percentage >= 0
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {silverData.percentage >= 0 ? (
                          <ArrowUpIcon className="h-4 inline-block" />
                        ) : (
                          <ChevronDownIcon className="h-4 inline-block" />
                        )}
                        {silverData.percentage} %
                      </div>
                    )}
                    <span className="text-7x sm:text-xs text-white ml-2 inline-block">
                      Since Yesterday
                    </span>
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-4 w-full 2xl:w-4/5 float-left " style={{ backgroundImage: "url('/lottie/Happy.gif')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="flex justify-end 2xl:justify-center pr-4 sm:pr-12 2xl:pr-4"
                >
                  {metalType === "gold" ? (
                    <>
                      <NextImage src="/lottie/Gold Stack Animation.gif" alt="Gold Bar Animation" className="h-24 sm:h-32" sizes="100vw" style={{ width: '100%', height: 'auto', }} width={0} height={0} priority={true} />
                    </>


                  ) : (
                    <NextImage src="/lottie/Silver Stacks animation.gif" alt="Silver Bar Animation" className="h-20 sm:h-32" sizes="100vw" style={{ width: '100%', height: 'auto', }} width={0} height={0} priority={true} />
                  )}
                </div>
                <Timer />
              </div>
            </div>
            <ShowVaultBuySell />
            <div className="px-4 pb-4 sm:px-4 sm:p-3 z-20">
              <div className="flex justify-around px-1 py-1 mx-auto w-3/4">
                <div
                  className={`mt-3 mb-1 text-center border-2 text-sm w-1/2 sm:text-sm px-2 sm:px-9 py-2 rounded-tl-lg rounded-bl-lg  cursor-pointer ${activeTabPurchase === "rupees"
                    ? "bg-transparent text-black bg-themeBlue active extrabold"
                    : "text-white"
                    }`}
                  onClick={() => handleTabRupeesAndGrams("rupees")}
                >
                  {purchaseType === "buy" ? " In Rupees" : " In Rupees"}
                </div>
                <div
                  className={`mt-3 mb-1 text-center border-2  text-sm w-1/2 sm:text-sm px-2 sm:px-9 py-2 rounded-tr-lg rounded-br-lg  cursor-pointer ${activeTabPurchase === "grams"
                    ? "bg-transparent text-black  bg-themeBlue active extrabold"
                    : "text-white"
                    }`}
                  onClick={() => handleTabRupeesAndGrams("grams")}
                >
                  {purchaseType === "buy" ? "In Grams" : "In Grams"}
                </div>
              </div>
              <div className="pt-2 mt-2 grid grid-cols-2 items-center gap-6 border-1 extrabold p-1 rounded-lg">
                <div className="relative rounded-md shadow-sm">
                  <div
                    className={`pointer-events-none absolute text-gray-400  inset-y-0 left-0 flex items-center ${activeTabPurchase === "rupees" ? " text-2xl sm:text-4xl" : "text-xl sm:text-3xl"}`}                  >
                    ₹
                  </div>

                  <input
                    type="number"
                    inputMode="numeric"
                    className={`bg-transparent pl-7 py-1 focus:outline-none text-gray-100 w-full ${activeTabPurchase === "rupees" ? " text-2xl sm:text-3xl" : "text-sm sm:text-xl"}`}
                    placeholder="0000"
                    onClick={() => handleTabRupeesAndGrams("rupees")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleEnteredAmountChange(e) }}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.preventDefault() }}
                    onScroll={(e: React.UIEvent<HTMLElement>) => { e.preventDefault() }}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) => { e.preventDefault() }}
                    step="0.0001"
                    value={
                      activeTabPurchase === "rupees"
                        ? enteredAmount === 0
                          ? ""
                          : enteredAmount
                        : totalAmount
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      // Prevent the input of a decimal point if purchase type is rupees
                      if (activeTabPurchase === "rupees" && e.key === ".") {
                        e.preventDefault();
                      }
                      // Prevent entering negative values
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault(); // Prevent the default action
                      }
                    }}
                  />
                </div>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    placeholder="0.0000"
                    onClick={() => handleTabRupeesAndGrams("grams")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEnteredAmountChangeGrams(e)}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.preventDefault() }}
                    onScroll={(e: React.UIEvent<HTMLElement>) => { e.preventDefault() }}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) => { e.preventDefault() }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault(); // Prevent the default action
                      }
                    }}
                    className={`bg-transparent w-full pr-8 sm:pr-14 py-1  focus:outline-none text-gray-100 text-right ${activeTabPurchase === "grams" ? "text-2xl sm:text-3xl" : "text-sm sm:text-xl"}`}
                    value={
                      activeTabPurchase === "grams"
                        ? enteredAmount
                        : ParseFloat(metalQuantity, 4)
                    }
                  // readOnly
                  />
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 ${activeTabPurchase === "grams" ? "text-sm sm:text-2xl" : "text-xs sm:text-xl"}`}>
                    gm
                  </div>
                </div>
              </div>
              {validationError ? (
                <span className="text-red-500 text-sm">{validationError}</span>
              ) : (
                ""
              )}
              <div className="text-white text-md mt-4">
                {purchaseType === "buy" ? "Quick Buy" : "Quick Sell"}
              </div>
              {transactionType === "rupees" ? (
                <QuickBuySellButtons
                  amounts={[100, 200, 500, 1000]}
                  unit="rupees"
                />
              ) : (
                <QuickBuySellButtons amounts={[0.1, 0.5, 1, 2]} unit="gm" />
              )}
              {/* <img
                      src="/lottie/Holi Celebration.gif"
                      className="h-14"
                      alt="google play button"
                    /> */}
              {/* <span className="text-center text-xxs sm:text-xs flex justify-center items-center mt-6 text-gray-400">
                Your Assets will be Saved in Safe & Secured Vault
                <img
                  className="h-5 ml-2"
                  src={new URL(
                    "../../../public/secure.png",
                    import.meta.url
                  ).toString()}
                  alt="Secure"
                />
              </span>
              <img src="/brink.png" className="h-4 sm:h-7 mt-2 mx-auto" alt="Brinks" /> */}
              <div className="flex flex-col items-center mt-6">
                <div className="flex items-center">
                  <img src="/lottie/Holi Celebration.gif" className="h-10" alt="Holi Celebration" />
                  <span className="text-center text-xxs sm:text-xs  flex justify-center items-center mt-6 text-gray-400">
                    Your Assets will be Saved in Safe & Secured Vault
                    <img
                      className="h-5 ml-2"
                      src={new URL("../../../public/secure.png", import.meta.url).toString()}
                      alt="Secure"
                    />
                  </span>
                </div>
                <img src="/brink.png" className="h-4 sm:h-7 mt-2" alt="Brinks" />
              </div>

              <div>
                <animated.div style={style}>
                  {isgold && purchaseType === 'buy' && (
                    <>
                      <div className="flex justify-between mt-6"></div>
                      <div className="py-2 px-4 rounded-lg bg-themeLight flex items-center justify-between">
                        <div className="flex items-center">
                          <NextImage src={coupon} alt="Benefits" style={{ width: "35px", height: "35px" }} />
                          <span className="text-white text-lg leading-4 ml-2">
                            {isAnyCouponApplied ? `Coupon Applied ${appliedCouponCode}` : "Apply Coupon"}
                          </span>
                        </div>
                        <button className="text-white rounded-full border-2">
                          <ChevronDownIcon onClick={openModal} className="h-8" />
                        </button>
                      </div>
                    </>
                  )}
                </animated.div>
              </div>

              <div className="mt-8" >
                {purchaseType === "buy" && (
                  <button
                    onClick={(event) => {
                      handleBuyClick(event)
                    }}
                    className="w-full bg-themeBlue rounded-lg py-2 uppercase extrabold"
                  >
                    <span className="text-xl">Start Savings</span>
                  </button>
                )}
                {purchaseType === "sell" && (
                  <button
                    onClick={handleSellClick}
                    className="w-full bg-themeBlue rounded-lg py-2 uppercase extrabold"
                  >
                    <span>Sell Now</span>
                  </button>
                )}
                {isModalOpen && (
                  <Modal
                    previewData={previewData}
                    transactionId={transactionId}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                  />
                )}
                {isModalCouponOpen && (
                  <ModalCoupon
                    isOpen={isModalCouponOpen}
                    onClose={closeModal}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BuySell;
