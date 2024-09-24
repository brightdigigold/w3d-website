import { ArrowUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { FaChevronDown } from 'react-icons/fa';
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
import coupon from '../../../public/coupon.png';
import Link from "next/link";
import { isMobile } from 'react-device-detect';
import { GoogleTagManager } from "@next/third-parties/google";
import { RootState } from "@/redux/store";
import Image from "next/image";

const BuySell = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userType = useSelector((state: RootState) => state.auth.UserType);
  const devotee_isNewUser = useSelector((state: RootState) => state.auth.devotee_isNewUser);
  const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);
  const liveGoldPrice = useSelector((state: RootState) => state.cart.liveGoldPrice);
  const liveSilverPrice = useSelector((state: RootState) => state.cart.liveSilverPrice);
  const liveSilverPurchasePrice = useSelector((state: RootState) => state.cart.liveSilverPurchasePrice);
  const liveGoldPurchasePrice = useSelector((state: RootState) => state.cart.liveGoldPurchasePrice);
  const [isgold, setIsGold] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [openLoginAside, setOpenLoginAside] = useState<boolean>(false);
  const [isModalCouponOpen, setModalCouponOpen] = useState<boolean>(false);
  const [activeTabPurchase, setActiveTabPurchase] = useState<string>("rupees");
  const [transactionTypeForQuickBuySell, setTransactionTypeForQuickBuySell] = useState("rupees")
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
      activeLabel: string;
    } = {
      orderType: purchaseType.toUpperCase(),
      itemType: metalType.toUpperCase(),
      unit: "GRAMS",
      gram: ParseFloat(metalQuantity, 4),
      amount: totalAmount,
      currentMatelPrice: metalPricePerGram,
      fromApp: false,
      activeLabel: transactionType,
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
      },
      onUploadProgress: () => {
        Notiflix.Loading.circle();
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
        console.log("JSON.parse(decryptedData).data.preview", JSON.parse(decryptedData).data.preview)
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
        console.log("response: ", response)
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
    // console.log("userType", userType)
    dispatch(setMetalType("gold"));
    dispatch(setEnteredAmount(500));
    dispatch(setCouponError(""));
    dispatch(setPurchaseType("buy"));
    dispatch(setTransactionType("rupees"));
    dispatch(clearCoupon());
    dispatch(setLiveGoldPrice(userType == "corporate" ? goldData.c_totalPrice : goldData.totalPrice));
    dispatch(setLiveSilverPrice(userType == "corporate" ? silverData.c_totalPrice : silverData.totalPrice));
  }, [isloggedIn]);

  const toggleMetal = () => {
    setIsGold(!isgold);
    dispatch(setMetalType(!isgold ? "gold" : "silver"));
    dispatch(setEnteredAmount(0));
    setValidationError("");
    dispatch(clearCoupon());
  };

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
    setTransactionTypeForQuickBuySell(tab);
    setValidationError("");
  };

  let goldPriceWithGST = ParseFloat(
    `${liveGoldPrice * 0.03 + liveGoldPrice}`,
    2
  );

  let silverPriceWithGST = ParseFloat(
    `${liveSilverPrice * 0.03 + liveSilverPrice}`,
    2
  );

  const metalPriceWithGst =
    metalType == "gold" ? goldPriceWithGST : silverPriceWithGST;
  const actualPurchasingInGm = ParseFloat(
    200000 / ParseFloat(metalPriceWithGst, 2),
    3
  );

  const handleEnteredAmountChange = (e: any) => {
    dispatch(clearCoupon());
    setActiveTabPurchase('rupees')
    dispatch(setTransactionType('rupees'))
    const enteredValue = ParseFloat(e.target.value, 4);
    if (transactionType === 'rupees' && isNaN(enteredValue)) {
      setValidationError("Please enter numbers only.");
      return;
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

    const enteredValue = Math.abs(ParseFloat(e.target.value, 4));
    if (transactionType === 'grams' && isNaN(enteredValue)) {
      setValidationError("Please enter numbers only.");
      return;
    }

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

  const handleBuyClick = () => {
    if (isLoggedInForTempleReceipt && devotee_isNewUser) {
      dispatch(setShowProfileForm(true));
      return;
    }
    if (!isloggedIn) {
      setOpenLoginAside(!openLoginAside);
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

    if (totalAmount < 100) {
      setValidationError(`Minimum Sell amount is  Rs.${100}`);
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
            // @ts-ignore
            dispatch(setTransactionType(transactionTypeForQuickBuySell))
            if (isAnyCouponApplied) {
              if (amount < 500) {
                dispatch(clearCoupon());
              }
            }
            setValidationError("");
            dispatch(setTransactionType(unit));
            dispatch(setEnteredAmount(amount));
          }}
          className="bg-themeLight001 border bold border-blue-200 rounded-md py-1 px-2 sm:px-4 text-white text-sm relative"
        >
          {unit === "rupees" ? `₹${amount}` : `${amount}gm`}
          {purchaseType === "buy" && amount === 500 && (
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
      dispatch(setMetalPrice(liveGoldPrice));
    } else if (isgold && activeTab == "sell") {
      dispatch(setMetalPrice(liveGoldPurchasePrice));
    } else if (!isgold && activeTab == "buy") {
      dispatch(setMetalPrice(liveSilverPrice));
    } else {
      dispatch(setMetalPrice(liveSilverPurchasePrice));
    }
  }, [isgold, activeTab, toggleMetal]);

  const openModal = () => {
    if (isLoggedInForTempleReceipt && devotee_isNewUser) {
      dispatch(setShowProfileForm(true));
      return;
    }

    if (!isloggedIn) {
      setOpenLoginAside(!openLoginAside);
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
    config: { duration: 1200 },
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
        <GoogleTagManager gtmId="GTM-5JFBNN5" />
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

        <div className="block mx-auto xl:pl-24 2xl:pl-32 ">
          <div className="tab-bg rounded-lg relative ">
            <div className="grid grid-cols-2">
              <div
                className={`text-center py-3 border-r-2 border-slate-500 extrabold cursor-pointer ${activeTab === "buy"
                  ? "bg-themeLight text-white active"
                  : "bg-themeLight01 text-sky-500"
                  }`}
                onClick={() => {
                  handleTabBuyAndSell("buy");
                }}
              >
                BUY
              </div>
              <div
                className={`text-center py-3 cursor-pointer extrabold ${activeTab === "sell"
                  ? "bg-themeLight text-white active"
                  : "bg-themeLight01 text-sky-500"
                  }`}
                onClick={() => {
                  if (isLoggedInForTempleReceipt && devotee_isNewUser) {
                    dispatch(setShowProfileForm(true));
                  } else if (!isloggedIn) {
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
            <div className="grid grid-cols-2">
              <div className="pl-3">
                <div
                  className="mt-4 "
                  onChange={toggleMetal}
                >
                  <label className="toggle-button">
                    <input type="checkbox" />
                    <div className="slider"></div>
                    <div className="text-gold">Silver</div>
                    <div className="text-silver">Gold</div>
                  </label>
                </div>
                <div>
                  <div className="text-white mt-2 xl:mt-3 flex items-center">
                    <div>
                      <Image src="https://brightdigigold.s3.ap-south-1.amazonaws.com/LivePrice.webp" alt="Live Price" width={30} height={25} priority={true} layout="intrinsic" />
                    </div>
                    <div>
                      <span className="pl-1 xl:pl-2 bold text-md 2xl:text-lg">
                        {metalType === "gold" ? "GOLD PRICE" : "SILVER PRICE"}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-shine text-base sm:text-xl 2xl:text-2xl bold items-center 2xl:mt-2">
                    <span className="sm:text-2xl 2xl:text-3xl bold pr-0.5">₹</span>
                    {isgold ? (
                      <>
                        {activeTab === "buy" ? (
                          <span className="">{liveGoldPrice}</span>
                        ) : (
                          <span>{liveGoldPurchasePrice}</span>
                        )}
                      </>
                    ) : (
                      <>
                        {activeTab === "buy" ? (
                          <div> {liveSilverPrice}</div>
                        ) : (
                          <div>{liveSilverPurchasePrice}</div>
                        )}
                      </>
                    )}
                    /gm
                    {purchaseType === "buy" ? <span className="pl-1 text-xxs sm:text-xs mt-1 2xl:text-sm">+3% GST</span> : null}
                  </div>
                  <p className="text-xs text-gray-400 2xl:text-lg mt-1 2xl:mt-2">
                    {metalType == "gold" ? "24k 99.9% Pure Gold" : "99.99% Pure Silver"}
                  </p>
                  <span className="text-xxs sm:text-xs font-base flex mt-1 xl:mt-2">
                    {isgold ? (
                      <div
                        className={`flex items-center ${goldData.percentage >= 0
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {goldData.percentage >= 0 ? (
                          <ArrowUpIcon className="h-4 inline-block text-green-500" />
                        ) : (
                          <FaChevronDown className="h-4 xl: 2xl:w-6 inline-block text-red-500" />
                        )}
                        <div className="ml-1 2xl:text-lg">
                          {goldData.percentage} %
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`flex items-center ${silverData.percentage >= 0
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {silverData.percentage >= 0 ? (
                          <ArrowUpIcon className="h-4 inline-block text-green-500" />
                        ) : (
                          <FaChevronDown className="h-4 xl: 2xl:w-6 inline-block text-red-500" />
                        )}
                        <div className="ml-1 2xl:text-lg">
                          {silverData.percentage} %
                        </div>
                      </div>
                    )}
                    <span className="text-7x sm:text-xs 2xl:text-sm text-white ml-2">
                      Since Yesterday
                    </span>
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-4 w-full float-left">
                <div className="flex justify-center">
                  {metalType === "gold" ? (
                    <Image
                      src="https://brightdigigold.s3.ap-south-1.amazonaws.com/GoldStackAnimation.webp"
                      alt="Gold Bar Animation"
                      width={500}
                      height={300}
                      priority={true}
                      layout="intrinsic"
                    // sizes="(max-width: 500px) 100vw, 500px"
                    />
                  ) : (
                    <Image
                      src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/SilverStacksanimation.gif"
                      alt="Silver Bar Animation"
                      width={500}
                      height={300}
                      priority={true}
                      layout="intrinsic"
                      sizes="(max-width: 500px) 100vw, 500px"
                    />
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
                    type="text"
                    inputMode="numeric"
                    className={`bg-transparent pl-7 py-1 focus:outline-none text-gray-100 w-full ${activeTabPurchase === "rupees" ? " text-2xl sm:text-3xl" : "text-sm sm:text-xl"}`}
                    placeholder="0000"
                    onClick={() => handleTabRupeesAndGrams("rupees")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleEnteredAmountChange(e) }}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.preventDefault() }}
                    onScroll={(e: React.UIEvent<HTMLElement>) => { e.preventDefault() }}
                    value={
                      transactionType === "rupees"
                        ? enteredAmount === 0
                          ? ""
                          : enteredAmount
                        : totalAmount
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (activeTabPurchase === "rupees" && e.key === ".") {
                        e.preventDefault();
                      }
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
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
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                    }}
                    className={`bg-transparent w-full pr-8 sm:pr-14 py-1  focus:outline-none text-gray-100 text-right ${activeTabPurchase === "grams" ? "text-2xl sm:text-3xl" : "text-sm sm:text-xl"}`}
                    value={
                      transactionType === "grams"
                        ? (enteredAmount).toString()
                        : (ParseFloat(metalQuantity, 4)).toString()
                    }
                  />
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 ${activeTabPurchase === "grams" ? "text-sm sm:text-2xl" : "text-xs sm:text-xl"}`}>
                    gm
                  </div>
                </div>
              </div>
              {validationError ? (
                <span className="text-red-500 text-sm">{validationError}</span>
              ) : (
                null
              )}

              {userType !== "corporate" && purchaseType === 'buy' && metalType === 'gold' && totalAmount >= 10 && (
                <div className="flex justify-center items-center relative">
                  <span className="text-themeBlueLight mt-4 text-center rotating-text relative">
                    <span className="silver-shine poppins-regular text-sm">
                      Congratulations you will get {ParseFloat(metalQuantity, 4)}gm
                    </span>
                    <span className="text-white poppins-semibold"> Silver</span> for free.
                  </span>
                </div>
              )}

              {userType !== 'corporate' &&
                <>
                  <div className="text-white text-md mt-4">
                    {purchaseType === "buy" ? "Quick Buy" : "Quick Sell"}
                  </div>
                  {activeTabPurchase === "rupees" ? (
                    <QuickBuySellButtons
                      amounts={[100, 200, 500, 1000]}
                      unit={activeTabPurchase}
                    />
                  ) : (
                    <QuickBuySellButtons amounts={[0.1, 0.5, 1, 2]} unit={activeTabPurchase} />
                  )}
                </>}

              <span className="text-center text-xxs sm:text-xs flex justify-center items-center mt-6 text-gray-400">
                Your Assets will be Saved in Safe & Secured Vault
                <Image
                  className="h-5 ml-2"
                  src="/secure.png"
                  width={20}
                  height={20}
                  alt="Secure"
                />
              </span>
              <div className="flex items-center justify-center mt-2 gap-3">
                <p className="text-center text-white poppins-semibold text-xl tracking-wider">Secured With</p>
                <Image
                  src="/brinks.png"
                  alt="Brinks"
                  width={127}
                  height={28}
                  priority={true}
                  layout="intrinsic"
                  sizes="(max-width: 267px) 100vw, 267px"
                />
              </div>

              {userType !== 'corporate' && <div>
                <animated.div style={style}>
                  {isgold && purchaseType === 'buy' && (
                    <>
                      <div className="flex justify-between mt-6"></div>
                      <div className="py-2 px-4 rounded-lg bg-themeLight flex items-center justify-between">
                        <div className="flex items-center">
                          <Image src={coupon} alt="Benefits" style={{ width: "35px", height: "35px" }} />
                          <span className="text-white text-lg leading-4 ml-2">
                            {isAnyCouponApplied ? `Coupon Applied ${appliedCouponCode}` : "Apply Coupon"}
                          </span>
                        </div>
                        <div className="text-white rounded-full border-2 cursor-pointer">
                          <ChevronDownIcon onClick={openModal} className="h-8" />
                        </div>
                      </div>
                    </>
                  )}
                </animated.div>
              </div>}

              <div className="mt-8" >
                {purchaseType === "buy" && (
                  <button
                    onClick={() => {
                      handleBuyClick()
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
      <div className="flex gap-5 mt-8 relative justify-center sm:hidden">
        <Link target="_blank"
          href={isMobile ? 'https://brightdigigold.page.link/y1E4' : "https://play.google.com/store/apps/details?id=com.brightdigigold.customer"}
          className="cursor-pointer"
        >
          <Image
            src="https://brightdigigold.s3.ap-south-1.amazonaws.com/google-play-button.png"
            width={160}
            height={90}
            alt="google play button"
          />
        </Link>
        <Link target="_blank"
          href={isMobile ? 'https://brightdigigold.page.link/y1E4' : "https://play.google.com/store/apps/details?id=com.brightdigigold.customer"}
          className="cursor-pointer"
        >
          <Image
            src="https://brightdigigold.s3.ap-south-1.amazonaws.com/app-store-button+(2).png"
            width={160}
            height={90}
            alt="app store button"
          />
        </Link>
      </div>
    </>
  );
};

export default BuySell;
