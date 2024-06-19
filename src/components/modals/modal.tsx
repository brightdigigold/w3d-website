"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ParseFloat, funForAesEncrypt } from "../helperFunctions";
import {
  clearCoupon,
  isCouponApplied,
  selectAppliedCouponCode,
} from "@/redux/couponSlice";
import SelectUpiModalForPayout from "./sellSelectUpiModal";
import ProgressBar from "../progressBar";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import {
  SelectTransactionType,
  SelectActualAmount,
  SelectEnteredAmount,
  SelectMetalQuantity,
  SelectTotalAmount,
  SelectPurchaseType,
} from "@/redux/shopSlice";
import mixpanel from "mixpanel-browser";

export default function Modal({ isOpen, onClose, transactionId, previewData }: any) {
  const dispatch = useDispatch();
  const gst = useSelector((state: RootState) => state.shop.gst);
  const metalType = useSelector((state: RootState) => state.shop.metalType);
  const [encryptedPayload, setEncryptedPayload] = useState<string>("");
  const transactionType = useSelector(SelectTransactionType);
  const purchaseType = useSelector(SelectPurchaseType);
  const enteredAmount = useSelector(SelectEnteredAmount);
  const actualAmount = useSelector(SelectActualAmount);
  const totalAmount = useSelector(SelectTotalAmount);
  const metalQuantity = useSelector(SelectMetalQuantity);
  const isAnyCouponApplied = useSelector(isCouponApplied);
  const appliedCouponCode = useSelector(selectAppliedCouponCode);
  const extraGoldOfRuppess = useSelector((state: RootState) => state.coupon.extraGoldOfRuppess);
  const extraGold = useSelector((state: RootState) => state.coupon.extraGold);
  const [isModalOpen, setModalOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const welcomeGold = previewData.find((item: any) => item.key === 'Welcome GOLD')?.value.replace(/ gm/g, '');

  console.log("previewData", previewData);

  useEffect(() => {
    if (welcomeGold) {
      dispatch(clearCoupon());
    }

    if (purchaseType === "buy") {
      mixpanel.track('Buy Modal(web) ', {
        "transaction_Type": transactionType,
        "order_type": purchaseType,
        "metal_Type": metalType,
        "metal_Quantity": metalQuantity,
        "amount": totalAmount,
        "applied_Coupon_Code": isAnyCouponApplied ? appliedCouponCode : 'not applied',
      });
    }
    else {
      mixpanel.track('Sell Modal(web)', {
        "transaction_Type": transactionType,
        "order_type": purchaseType,
        "metal_Type": metalType,
        "metal_Quantity": metalQuantity,
        "amount": totalAmount,
      });
    }
  }, [])

  const openModalPayout = async () => {
    setModalOpen(true);
  };

  const closeModalPayout = () => {
    setModalOpen(false);
    closeModal();
  };

  const closeModal = () => {
    onClose(false);
  };

  const dataToEncrept = {
    orderType: purchaseType.toUpperCase(),
    item: metalType.toUpperCase(),
    unit: "GRAMS",
    gram: metalQuantity,
    amount: totalAmount,
    order_preview_id: transactionId,
    amountWithoutTax: actualAmount,
    tax: "3",
    totalAmount: totalAmount,
    couponCode: appliedCouponCode ? appliedCouponCode : "",
    itemMode: "DIGITAL",
    gst_number: "",
    fromApp: false,
    payment_mode: "cashfree",
  };

  useEffect(() => {
    const fetchData = async () => {
      const resAfterEncryptData = await funForAesEncrypt(dataToEncrept);
      setEncryptedPayload(resAfterEncryptData);
    };

    fetchData();
  }, [dataToEncrept]);


  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="z-[110] fixed inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => {
          return false;
        }}
        data-keyboard="false"
        data-backdrop="static"
      >
        {isModalOpen && (
          <SelectUpiModalForPayout
            isOpen={isModalOpen}
            onClose={closeModalPayout}
            transactionId={transactionId}
          />
        )}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="text-white relative transform overflow-hidden rounded-lg coins_backgroun  text-left shadow-xl transition-all sm:my-8 w-full sm:w-full sm:max-w-lg ">
                <div className="coins_backgroun px-4 pb-4 pt-5 sm:p-4 sm:pb-4">
                  <div className=" flex items-center gap-4 mb-4 pt-4">
                    {metalType == "gold" ? <img src="/Goldbarbanner.png" className="h-5" /> : <img src="/Silverbar.png" className="h-5" />}
                    <p className="text-base sm:text-xl ">
                      {purchaseType === "buy" ? "Price" : "Sell"} Breakdown
                    </p>
                  </div>

                  <ul>
                    {previewData.map((item, index) => (
                      <li key={index}>
                        <div className="flex justify-between py-1 border-b border-dashed border-gray-400">
                          <div className="">{item.key}</div>
                          <div className="text-sm sm:text-base bold text-blue-100">{item.value}</div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* <div className=" flex py-1 justify-between items-center border-b border-dashed border-gray-400">
                    <p className=" text-sm sm:text-base">
                      {purchaseType === "buy" ? "Purchasing" : "Sell"}{" "}
                      {metalType === "gold" ? "Gold" : "Silver"} Weight{" "}
                    </p>
                    <p className="text-sm sm:text-base bold text-blue-100">{ParseFloat(metalQuantity, 4)} gm</p>
                  </div> */}
                  {/* 
                  {purchaseType === "buy" && (
                    <div className="py-1 flex justify-between items-center border-b border-dashed border-gray-400">
                      <p className=" text-sm sm:text-base">
                        {metalType === "gold" ? "Gold" : "Silver"} Value{" "}
                      </p>
                      <p className=" text-sm sm:text-base bold text-blue-100">₹  {actualAmount} </p>
                    </div>
                  )}

                  {metalType === "gold" && purchaseType === "buy" && (
                    <div className="py-1 flex justify-between items-center border-b border-dashed border-gray-400">
                      <p className=" text-sm sm:text-base">
                        {welcomeGold ? "Welcome Gold" : "Promotional Silver"}
                      </p>
                      <p className=" text-sm sm:text-base bold text-blue-100"> {welcomeGold ? welcomeGold : ParseFloat(metalQuantity, 4)} {welcomeGold ? "" : "gm"}</p>
                    </div>
                  )}

                  {isAnyCouponApplied && (
                    <div className="py-1 flex justify-between items-center border-b border-dashed border-gray-400">
                      <p className=" text-sm sm:text-base">
                        Promotional Gold({appliedCouponCode})
                      </p>{" "}
                      <p className=" text-sm sm:text-base bold text-blue-100">
                        ₹ {extraGoldOfRuppess}
                      </p>
                    </div>
                  )}

                  {welcomeGold ? (
                    <div className="py-1 flex justify-between items-center border-b border-dashed border-gray-400">
                      <p className=" text-sm sm:text-base">Total Gold Weight </p>
                      <p className=" text-sm sm:text-base bold text-blue-100"> {ParseFloat((metalQuantity ?? 0) + (+welcomeGold), 4)} gm</p>
                    </div>
                  ) : metalType === "gold" && isAnyCouponApplied && (
                    <div className="py-1 flex justify-between items-center border-b border-dashed border-gray-400">
                      <p className=" text-sm sm:text-base">Total Gold Weight </p>
                      <p className=" text-sm sm:text-base bold text-blue-100"> {ParseFloat((metalQuantity ?? 0) + extraGold, 4)} gm</p>
                    </div>
                  )}

                  {purchaseType === "buy" && (
                    <div className="py-1 flex justify-between items-center border-b border-dashed border-gray-400">
                      <p className=" text-sm sm:text-base">GST ( +3% )</p>{" "}
                      <p className=" text-sm sm:text-base bold text-blue-100">₹  {gst} </p>
                    </div>
                  )}
                  <div className="py-1 flex justify-between items-center border-b border-dashed border-gray-400">
                    <p className=" text-sm sm:text-base">Total Amount  </p>
                    <p className=" text-sm sm:text-base bold text-blue-100">₹
                      {transactionType === "grams"
                        ? totalAmount
                        : enteredAmount}
                    </p>
                  </div> */}
                </div>
                <div className="pt-4 pb-2">
                  <ProgressBar
                    purchaseType={purchaseType}
                    fromCart={true}
                    metalTypeForProgressBar={metalType}
                    displayMetalType={metalType}
                  />
                </div>
                <div className="text-yellow-400 px-4 m-2 py-1 pb-2 flex justify-center sm:px-6">
                  <button
                    type="button"
                    className=" absolute top-3 right-3  justify-center rounded-full coins_backgroun p-2 sm:p-1 text-sm bold shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-themeBlue sm:mt-0 sm:w-auto"
                    ref={cancelButtonRef}
                    onClick={() => closeModal()}
                  >
                    <XMarkIcon className="h-3 sm:h-5" />
                  </button>

                  <div className="flex justify-between items-center tracking-widest sm:tracking-wider w-full"> {/* Ensure full width */}
                    <div className="flex-1"> {/* This ensures the element takes up space but allows for pushing others away */}
                      <p className="text-blue-100 text-md">Total Amount</p>
                      <p className="text-blue-100 text-xl sm:text-2xl font-extrabold tracking-wide">
                        ₹ {transactionType === "grams" ? totalAmount : enteredAmount}
                        <span className="text-gray-400 text-sm ml-1 font-thin tracking-tighter">
                          {purchaseType === "buy" && ("Incl. GST")}
                        </span>
                      </p>
                    </div>
                    <div className="flex-1 text-right"> {/* Adjust text alignment and ensure spacing */}
                      {purchaseType === "buy" && (
                        <Link href={`/checkout?data=${encryptedPayload}`}>
                          <button
                            type="button"
                            className="mt-3 text-black inline-flex w-full justify-center rounded-md bg-themeBlue px-3 py-2 text-sm sm:text-xl bold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-themeBlue sm:mt-0 sm:w-auto"
                            ref={cancelButtonRef}
                          // onClick={() => buyReqApiHandler()}
                          >
                            Buy Now
                          </button>
                        </Link>
                      )}
                      {purchaseType === "sell" && (
                        <button
                          type="button"
                          className="mt-3 text-black inline-flex w-full ml-2 justify-center rounded-md bg-themeBlue px-3 py-2 text-sm font-semibold shadow-sm  sm:mt-0 sm:w-auto"
                          ref={cancelButtonRef}
                          onClick={() => openModalPayout()}
                        >
                          Proceed to Sell
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
