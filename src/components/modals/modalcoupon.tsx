"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectError,
  SelectExtraGold,
  SelectExtraGoldOfRuppess,
  SelectSelectedCoupon,
  applyCoupon,
  clearCoupon,
  isCouponApplied,
  selectAppliedCouponCode,
} from "@/redux/couponSlice";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useFetchCoupons } from "@/hooks/useFetchCoupons";
import ProgressBar from "../progressBar";
import Lottie from "lottie-react";
import partyPopper from "../../../public/lottie/Party Poppers.json";
import { SelectGoldData, SelectSilverData } from "@/redux/metalSlice";
import {
  SelectGst,
  SelectMetalType,
  SelectTransactionType,
  SelectPurchaseType,
  SelectEnteredAmount,
  SelectActualAmount,
  SelectTotalAmount,
  SelectMetalQuantity,
  selectMetalPricePerGram,
} from "@/redux/shopSlice";

export default function ModalCoupon({ isOpen, onClose }: any) {
  const cancelButtonRef = useRef(null);
  const [couponLottie, setCouponLottie] = useState<boolean>(false);
  const coupons = useFetchCoupons();
  const error = useSelector(SelectError);
  const dispatch = useDispatch();
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
  const extraGoldOfRuppess = useSelector(SelectExtraGoldOfRuppess);
  const extraGold = useSelector(SelectExtraGold);
  const selectedCoupon = useSelector(SelectSelectedCoupon);

  const handleApplyCoupon = (coupon: any, amount: number) => {
    dispatch(
      applyCoupon({
        coupon,
        amount,
        goldPrice: goldData.totalPrice,
        metalType,
        transactionType,
      })
    );
  };

  useEffect(() => {
    // Assuming `error` is null when there's no error, and contains a string when there is an error
    if (error === null && isAnyCouponApplied) {
      setCouponLottie(true);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } else {
      setCouponLottie(false);
    }
  }, [error, isAnyCouponApplied]);

  const handleClearCoupon = () => {
    dispatch(clearCoupon());
  };

  const closeModal = () => {
    onClose(false);
  };


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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-theme px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className=" pb-4 pt-5 sm:p-6 sm:pb-4 relative">
                  <p className="text-white text-center text-3xl sm:text-5xl extrabold mb-6">
                    Coupons
                  </p>
                  {couponLottie && (
                    <Lottie
                      loop={false}
                      animationData={partyPopper}
                      className=" absolute h-auto top-0 left-0"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}

                  {coupons?.map((coupon: any) => (
                    <div key={coupon._id} className="pb-6">
                      <div className="grid grid-cols-9">
                        <div className="col-span-3">
                          <img
                            className="cursor-pointer"
                            src="/coupon 499.png"
                            alt={`Coupon ${coupon.code}`}
                          />
                        </div>
                        <div className="col-span-6 bg-white pr-1 sm:pr-3 rounded-tr-lg rounded-br-lg flex items-center">
                          <div className="w-full">
                            {/* Splitting description into two parts */}
                            {coupon.description && (
                              <>
                                {/* Extracting first part from description */}
                                <p className="couponText text-lg sm:text-3xl w-24 sm:w-40 leading-5 extrabold my-2">
                                  {coupon.description.split(",")[0]}
                                </p>
                                {/* Extracting remaining part from description */}
                                <div className=" flex justify-between gap-2">
                                  <div>
                                    <p className="text-gary-200 text-xxs sm:text-xs">
                                      {coupon.description
                                        .split(",")
                                        .slice(1)
                                        .join(",")}
                                    </p>
                                    <p className="text-7x sm:text-xxs">
                                      *T&C Applied
                                    </p>
                                  </div>
                                  <div>
                                    {isAnyCouponApplied &&
                                      coupon.code === appliedCouponCode ? (
                                      // Render "Remove Coupon" button when a coupon is applied
                                      <button
                                        className="bg-yellow-400 border-2 border-yellow-500 text-[7px] sm:text-xs w-[4.6rem] sm:w-[6.7rem] rounded cursor-pointer text-black p-2"
                                        onClick={() => handleClearCoupon()}
                                      >
                                        Remove Coupon
                                      </button>
                                    ) : (
                                      // Render "Apply Coupon" button when no coupon is applied or a different coupon is applied
                                      <button
                                        className="bg-yellow-400 border-2 border-yellow-500 text-[7px] sm:text-xs w-[4.1rem] sm:w-[6rem] rounded cursor-pointer text-black p-2"
                                        onClick={() => {
                                          handleApplyCoupon(
                                            coupon,
                                            enteredAmount
                                          );
                                        }}
                                      >
                                        Apply Coupon
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                </div>
                <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className=" absolute top-5 right-5 mt-3 inline-flex justify-center bg-themeLight text-white rounded-full px-2 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300  sm:mt-0 sm:w-auto"
                    ref={cancelButtonRef}
                    onClick={() => closeModal()}
                  >
                    <XMarkIcon className="h-4" />
                  </button>
                </div>
                <div className="w-full">
                  <ProgressBar
                    fromCart={true}
                    metalTypeForProgressBar={metalType.toLowerCase()}
                    displayMetalType={metalType}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
