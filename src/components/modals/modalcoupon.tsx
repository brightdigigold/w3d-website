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
import { Coupon } from "@/types";

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
  const [enteredCouponCode, setEnteredCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string>()

  // console.log("coupons", coupons)

  const handleApplyCoupon = (coupon: any, amount: number) => {
    setCouponError('')
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

  useEffect(() => {
    // When the modal opens, set the enteredCouponCode to the appliedCouponCode if it exists
    if (isOpen) {
      setEnteredCouponCode(appliedCouponCode == "GIIFT24XONEW" ? appliedCouponCode : ''); // Set to applied coupon code or clear if no coupon is applied
    }
  }, [isOpen, appliedCouponCode]);

  const handleClearCoupon = () => {
    dispatch(clearCoupon());
  };

  const closeModal = () => {
    onClose(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredCouponCode((event.target.value).toUpperCase());
    setCouponError('');
  };

  const handleButtonClick = () => {
    const couponToApply = coupons?.find(
      (coupon: Coupon) => coupon.code === enteredCouponCode
    );

    if (couponToApply) {
      handleApplyCoupon(couponToApply, enteredAmount);
      setEnteredCouponCode(couponToApply.code);
    } else {
      if (!enteredCouponCode) {
        setCouponError('Please enter a coupon code');
      } else {
        setCouponError('Please enter a valid coupon code');
      }
    }
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-theme  text-left shadow-xl transition-all w-full sm:w-full sm:max-w-lg pb-4">
                <div className="p-3">
                  <p className="text-white text-center text-3xl sm:text-5xl extrabold mb-6">
                    Coupons
                  </p>
                  {coupons?.some((coupon: any) => coupon.isVisible) && (
                    <div className="rounded-md bg-themeLight px-4 py-2 relative">
                      <input
                        name="couponCode"
                        type="text"
                        className="text-white bg-transparent w-full focus:outline-none h-8"
                        placeholder="Enter Coupon Code"
                        autoComplete="off"
                        value={enteredCouponCode}
                        onChange={handleInputChange} 
                      />
                      <button
                        className="absolute right-3 rounded-md text-yellow-400 border border-yellow-400 px-5 py-1"
                        onClick={handleButtonClick}
                      >
                        {isAnyCouponApplied && appliedCouponCode === enteredCouponCode ? "Applied" : "Apply"}
                      </button>
                      {/* {couponError && <div className="text-red-600 text-sm sm:text-lg text-left">{couponError}</div>} */}
                    </div>
                  )}
                  {couponError && <div className="text-red-600 text-sm sm:text-lg text-left">{couponError}</div>}
                  {couponLottie && (
                    <Lottie
                      loop={false}
                      animationData={partyPopper}
                      className="absolute h-auto top-0 left-0"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                  {coupons
                    ?.filter((coupon: any) => coupon.isVisible) // Filter only visible coupons
                    .map((coupon: any) => (
                      <div key={coupon._id} className="p-2">
                        <div className="grid grid-cols-4">
                          <div className="col-span-1">
                            <img
                              className="cursor-pointer"
                              src="/coupon 499.png"
                              alt={`Coupon ${coupon.code}`}
                            />
                          </div>
                          <div className="col-span-3 bg-white pr-1 sm:pr-3 rounded-tr-lg rounded-br-lg flex items-center">
                            <div className="w-full">
                              {/* Splitting description into two parts */}
                              {coupon.description && (
                                <>
                                  {/* Extracting first part from description */}
                                  <p className="couponText text-lg sm:text-xl w-24 sm:w-40 leading-4 sm:leading-5 extrabold my-1">
                                    {coupon.description.split(",")[0]}
                                  </p>
                                  {/* Extracting remaining part from description */}
                                  <div className="flex justify-between gap-2">
                                    <div>
                                      <p className=" text-xxs sm:text-xs text-black">
                                        {coupon.description.split(",").slice(1).join(",")}
                                      </p>
                                      <p className="text-7x sm:text-xxs">*T&C Applied</p>
                                    </div>
                                    <div>
                                      {isAnyCouponApplied && coupon.code === appliedCouponCode ? (
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
                                            handleApplyCoupon(coupon, enteredAmount);
                                            setEnteredCouponCode('')
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
                  {error && <div className="text-red-600 text-sm sm:text-lg text-center">{error}</div>}
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className=" absolute top-0 sm:top-3 right-4 mt-3 inline-flex justify-center bg-themeLight text-white rounded-full px-2 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300  sm:mt-0 sm:w-auto"
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
                    purchaseType={purchaseType}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child >
          </div >
        </div >
      </Dialog >
    </Transition.Root >
  );
}


//  {coupons?.map((coupon: any) => (
//   <div key={coupon._id} className="p-2">
//     <div className="grid grid-cols-4">
//       <div className="col-span-1">
//         <img
//           className="cursor-pointer"
//           src="/coupon 499.png"
//           alt={`Coupon ${coupon.code}`}
//         />
//       </div>
//       <div className="col-span-3 bg-white pr-1 sm:pr-3 rounded-tr-lg rounded-br-lg flex items-center">
//         <div className="w-full">
//           {/* Splitting description into two parts */}
//           {coupon.description && (
//             <>
//               {/* Extracting first part from description */}
//               <p className="couponText text-lg sm:text-xl w-24 sm:w-40 leading-4 sm:leading-5 extrabold my-1 ">
//                 {coupon.description.split(",")[0]}
//               </p>
//               {/* Extracting remaining part from description */}
//               <div className=" flex justify-between gap-2">
//                 <div>
//                   <p className="text-gary-200 text-xxs sm:text-xs">
//                     {coupon.description
//                       .split(",")
//                       .slice(1)
//                       .join(",")}
//                   </p>
//                   <p className="text-7x sm:text-xxs">
//                     *T&C Applied
//                   </p>
//                 </div>
//                 <div>
//                   {isAnyCouponApplied &&
//                     coupon.code === appliedCouponCode ? (
//                     // Render "Remove Coupon" button when a coupon is applied
//                     <button
//                       className="bg-yellow-400 border-2 border-yellow-500 text-[7px] sm:text-xs w-[4.6rem] sm:w-[6.7rem] rounded cursor-pointer text-black p-2"
//                       onClick={() => handleClearCoupon()}
//                     >
//                       Remove Coupon
//                     </button>
//                   ) : (
//                     // Render "Apply Coupon" button when no coupon is applied or a different coupon is applied
//                     <button
//                       className="bg-yellow-400 border-2 border-yellow-500 text-[7px] sm:text-xs w-[4.1rem] sm:w-[6rem] rounded cursor-pointer text-black p-2"
//                       onClick={() => {
//                         handleApplyCoupon(
//                           coupon,
//                           enteredAmount
//                         );
//                       }}
//                     >
//                       Apply Coupon
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//   </div>
// </div>
//           ))} 
