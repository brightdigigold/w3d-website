import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import CustomButton from "../customButton";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import {
  AesDecrypt,
  AesEncrypt,
  ParseFloat,
  funForAesEncrypt,
  funcForDecrypt,
  renderPriceBreakdownItem,
} from "../helperFunctions";
import ProgressBar from "../progressBar";
import { useSelector } from "react-redux";
import {
  selectGoldVaultBalance,
  selectSilverVaultBalance,
} from "@/redux/vaultSlice";
import SelectAddress from "./selectAddressModal";
import axios from "axios";
import Swal from "sweetalert2";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { selectUser } from "@/redux/userDetailsSlice";
import clsx from "clsx";
interface CoinModalProps {
  openModalOfCoin: boolean;
  closeModalOfCoin: () => void;
  productsDetailById: any;
  totalCoins: number;
  applyDiwaliOffer: boolean;
}

export default function CoinModal({
  applyDiwaliOffer,
  openModalOfCoin,
  closeModalOfCoin,
  productsDetailById,
  totalCoins,
}: CoinModalProps) {
  const [showAdditionalContent, setShowAdditionalContent] = useState(true);
  const cancelButtonRef = useRef(null);
  const [openAddressModal, setopenAddressModal] = useState<boolean>(false);
  const metalTypeForProgressBar = productsDetailById.iteamtype;
  const fromCart = true;
  const goldVaultBalance = useSelector(selectGoldVaultBalance);
  const silverVaultBalance = useSelector(selectSilverVaultBalance);
  const liveGoldPrice = useSelector((state: RootState) => state.cart.liveGoldPrice);
  const liveSilverPrice = useSelector((state: RootState) => state.cart.liveSilverPrice);
  const [useWallet, setUseWallet] = useState(false);
  const goldData = useSelector((state: RootState) => state.gold);
  const silverData = useSelector((state: RootState) => state.silver);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [transactionId, setTransactionId] = useState("");
  const [amountWithoutTax, setAmountWithoutTax] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLottie, setShowLottie] = useState(false);
  const user = useSelector(selectUser);
  const router = useRouter();

  const getKeysToShow = () => {
    if (useWallet) {
      return [
        "Coin",
        "Coin Type",
        "Total Weight",
        "Coin Weight",
        "Coin Quantity",
        "Purchase Weight",
        "Vault Used",
        "Remaining Vault Weight",
        // "Total GOLD",
        "Coin Value (Incl. 3% GST)",
        "Making Charges (Incl. 18% GST)",
      ];
    } else {
      return [
        "Coin",
        "Coin Type",
        "Coin Weight",
        "Total Weight",
        "Coin Quantity",
        // "Total GOLD",
        "Coin Value (Incl. 3% GST)",
        "Making Charges (Incl. 18% GST)",
      ];
    }
  };
  const keysToShow = getKeysToShow();
  const filteredPreviewData = previewData.filter((item) =>
    keysToShow.includes(item.key)
  );


  const totalAmountItem = previewData.find(
    (item) => item.key === "Total Amount"
  );

  const totalAmountValue = totalAmountItem ? totalAmountItem.value : null;

  useEffect(() => {
    previewModal();
  }, [useWallet]);


  const handleSelectConvertFromVault = (e: any) => {
    setUseWallet(e.target.checked);
  };

  const previewModal = async () => {
    setLoading(true);

    try {
      const dataToBeDecrypt = {
        orderType: "PRODUCT",
        itemType: productsDetailById.iteamtype === "GOLD" ? "GOLD" : "SILVER",
        amount: ParseFloat(((productsDetailById.makingcharges) * totalCoins), 2),
        gram: (productsDetailById.weight * totalCoins),
        isVault: useWallet,
        currentMatelPrice:
          productsDetailById.iteamtype == "GOLD"
            ? liveGoldPrice
            : liveSilverPrice,
        fromApp: false,
        couponCode: applyDiwaliOffer ? "DIWALIOFFER" : null,
        // couponCode: null,
        product_quantity: totalCoins,
        product_id: productsDetailById._id,
      };
      const resAfterEncryptData = AesEncrypt(dataToBeDecrypt);
      const payloadToSend = { payload: resAfterEncryptData };
      const token = localStorage.getItem("token");
      const configHeaders = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const resAfterPreview = await axios.post(
        `${process.env.baseUrl}/user/order/preview`,
        payloadToSend,
        configHeaders
      );
      const decryptedData = AesDecrypt(resAfterPreview.data.payload);
      // console.log(JSON.parse(decryptedData).data.preview)
      setPreviewData(JSON.parse(decryptedData).data.preview);
      setTransactionId(JSON.parse(decryptedData).data.transactionCache._id);

      setAmountWithoutTax(
        ParseFloat(JSON.parse(decryptedData).data.amountwithoutTax, 2)
      );
    } catch (errInPreview: any) {
      if (!errInPreview?.response?.data?.payload) {
        return;
      }
      // Check if response and payload exist before attempting to decrypt
      if (errInPreview?.response?.data?.payload) {
        try {
          const decryptedData = AesDecrypt(errInPreview.response.data.payload);
          console.log("Decrypted Datat", decryptedData)
          // Ensure decryptedData is valid before parsing
          if (decryptedData) {
            const errorMessage = JSON.parse(decryptedData).message;
            closeModalOfCoin();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: errorMessage,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Decryption Error",
              text: "An error occurred during decryption.",
            });
          }
        } catch (decryptionError) {
          Swal.fire({
            icon: "error",
            title: "Decryption Error",
            text: "An error occurred while decrypting the data.",
          });
        }
      } else {
        console.error("No payload found in error response:", errInPreview);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAdditionalContent = () => {
    setShowAdditionalContent(!showAdditionalContent);
  };

  const openAddressModalHandler = () => {

    if (useWallet) {
      if (!user?.data?.isKycDone) {
        Swal.fire({
          title: "Oops...!",
          titleText: "It seems your KYC is pending. Please complete your KYC first.",
          padding: "2em",
          html: `<img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          showCancelButton: true,
          confirmButtonText: "Complete Your KYC",
          denyButtonText: `Don't save`,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/myAccount");
          }
        });
        return;
      } else {
        setopenAddressModal(true);
      }
    }
    if (!useWallet) {
      setopenAddressModal(true);
      return;
    }
  };


  const closeAddressModalHandler = () => {
    setopenAddressModal(false);
  };

  useEffect(() => {
    let timer;
    if (useWallet) {
      setShowLottie(true);
      timer = setTimeout(() => {
        setShowLottie(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [useWallet]);

  const isDisabled = (applyDiwaliOffer) || (metalTypeForProgressBar === 'GOLD' && goldVaultBalance === 0) ||
    (metalTypeForProgressBar === 'SILVER' && silverVaultBalance === 0);

  return (
    <Transition.Root show={openModalOfCoin} as={Fragment}>
      <Dialog
        as="div"
        className="z-[110] fixed inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => {
          closeModalOfCoin();
          return false;
        }}
        data-keyboard="false"
        data-backdrop="static"
      >
        {openAddressModal && (
          <SelectAddress
            applyDiwaliOffer={applyDiwaliOffer}
            totalAmountValue={totalAmountValue}
            transactionId={transactionId}
            previewData={previewData}
            openAddressModal={openAddressModal}
            closeAddressModal={closeAddressModalHandler}
            productsDetailById={productsDetailById}
            metalTypeForProgressBar={metalTypeForProgressBar}
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
              enter="ease-out duration-500"
              enterFrom="opacity-0 transform translate-y-10"
              enterTo="opacity-100 transform translate-y-0"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 transform translate-y-0"
              leaveTo="opacity-0 transform translate-y-10"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg coins_backgroun text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute top-3 right-4 border-2 border-1 rounded-full p-2">
                  <XMarkIcon
                    className="h-6 w-6 text-white text-lg cursor-pointer bold"
                    onClick={() => {
                      closeModalOfCoin();
                    }}
                  />
                </div>
                <div className="transition-height duration-500 ease-in-out overflow-hidden h-auto">
                  {showAdditionalContent ? (
                    <div
                      className={`px-4 pb-4 pt-5 sm:p-6 sm:pb-4 transition-opacity ease-out delay-1000`}
                    >
                      <div className="flex items-start">
                        <div className="w-full  mt-0 text-left">
                          <Dialog.Title
                            as="h2"
                            className="text-xl text-white bold leading-6 tracking-[.1em]"
                          >
                            Convert From Vault
                          </Dialog.Title>
                          {/* {applyDiwaliOffer && <><p className="text-red-600 mt-8 text-sm sm:text-md">You can't convert from vault as you applied DIWALI OFFER</p>
                            <p className="text-green-600 text-sm sm:text-md">You will receive {productsDetailById?.name === "10 Gram Gold Coin" ? "10-Gram-Silver-Coin/s" : "5-Gram-Silver/s"} for free!!!</p>
                          </>
                          } */}

                          {applyDiwaliOffer &&
                            <p className="text-green-600 text-sm sm:text-md mt-8">You will receive {productsDetailById?.name === "10 Gram Gold Coin" ? "10-Gram-Silver-Coin/s" : "5-Gram-Silver/s"} for free!!!</p>
                          }
                          <div className={clsx(applyDiwaliOffer ? 'items-center w-full bg-[17455F] border-2 border-yellow-400 rounded-xl p-3' : 'items-center w-full bg-[17455F] border-2 border-yellow-400 rounded-xl p-3 my-8')}>
                            <div>
                              <div className="flex justify-between gap-4">
                                <div className="mt-2 mb-2">
                                  <div className="text-xs sm:text-base w-full tracking-[.1em] bold text-white">
                                    Available Vault Balance :
                                  </div>
                                  <div className="flex items-center mt-2 bold text-white ">
                                    <label className="semibold dark:text-gray-300 text-sm sm:text-base">
                                      Convert All
                                    </label>
                                    <input
                                      id="default-checkbox"
                                      type="checkbox"
                                      value=""
                                      className={`w-5 h-5 cursor-pointer rounded-lg text-blue-600 bg-black ml-2 focus:bg-bg-theme dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 
                                      ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                                      disabled={isDisabled}
                                      onChange={handleSelectConvertFromVault}
                                    />
                                  </div>

                                  {showLottie &&
                                    metalTypeForProgressBar === "GOLD" && (
                                      <div className="absolute z-[100] top-0 w-full left-0 h-full justify-center flex items-center coins_backgroun">
                                        <img
                                          src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/Conversion.gif"
                                          alt="Conversion Gold"
                                          className="h-60"
                                        />
                                      </div>
                                    )}
                                  {showLottie &&
                                    metalTypeForProgressBar === "SILVER" && (
                                      <div className="absolute z-[100] top-0 w-full left-0 h-full justify-center flex items-center coins_backgroun">
                                        <img
                                          src="https://brightdigigold.s3.ap-south-1.amazonaws.com/banner/Conversion+silver.gif"
                                          alt="Conversion Silver"
                                          className="h-60"
                                        />
                                      </div>
                                    )}
                                </div>
                                <div className="flex items-center bg-themeBlue rounded-xl">
                                  <div className="">
                                    <img
                                      src={"../../images/vault.png"}
                                      alt="digital gold bar"
                                      className={`px-1 py-2 h-14 w-16 sm:h-16  cursor-pointer`}
                                    />
                                  </div>
                                  <div className="px-2">
                                    <div className="text-sm sm:text-base bold text-black">
                                      {productsDetailById.iteamtype}
                                    </div>
                                    <div className="text-yellow-600 bold  text-xs sm:text-base">
                                      {productsDetailById.iteamtype === "GOLD"
                                        ? `${goldVaultBalance}`
                                        : `${silverVaultBalance}`}{" "}
                                      GM
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {applyDiwaliOffer && <><p className="text-red-600 text-xs sm:text-md mt-1">You can't convert from vault as you applied DIWALI OFFER</p></>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`px-4 text-gray-300 pb-4 pt-5 sm:p-6 sm:pb-4 text-lg transition-opacity ease-in delay-1000`}
                    >
                      <div className="flex items-center">
                        <div>
                          {productsDetailById.iteamtype === "GOLD" ? (
                            <img
                              src={"/coin1.png"}
                              alt="digital gold bar"
                              className={`px-2 py-2 h-16 cursor-pointer`}
                            />
                          ) : (
                            <img
                              src={"/Rectangle.png"}
                              alt="digital gold bar"
                              className={`px-2 py-2 h-12 cursor-pointer`}
                            />
                          )}
                        </div>
                        <div className="text-white text-2xl bold">
                          Price Breakdown{" "}
                        </div>
                      </div>
                      <div className="mt-2">


                        {filteredPreviewData.map((item, index) =>
                          renderPriceBreakdownItem({
                            label: item.key,
                            value: item.value,
                            index,
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <ProgressBar
                  fromCart={fromCart}
                  metalTypeForProgressBar={metalTypeForProgressBar.toLowerCase()}
                  displayMetalType={metalTypeForProgressBar.toLowerCase()}
                  purchaseType="buy"
                />
                <div className="justify-between px-4 py-3 flex flex-row-reverse sm:px-6">
                  <CustomButton
                    btnType="button"
                    title="PROCEED"
                    containerStyles="mt-3  justify-center rounded-xl bg-themeBlue px-5 py-2 text-sm sm:text-lg bold text-black ring-1 ring-inset sm:mt-0 sm:w-auto"
                    handleClick={() => {
                      openAddressModalHandler();
                    }}
                  />
                  <div>
                    <div className="text-[#cde8f1] text-xl sm:text-2xl bold">
                      {totalAmountValue}
                      <span className="text-gray-300 text-xs sm:text-sm ml-1">
                        Incl GST
                      </span>
                    </div>
                    <div className="text-yellow-400 flex items-center mt-1">
                      <div
                        className="mr-2 text-sm sm:text-base cursor-pointer"
                        onClick={toggleAdditionalContent}
                      >
                        {showAdditionalContent
                          ? "View BreakUp "
                          : "Hide BreakUp"}
                      </div>
                      <div className="">
                        {showAdditionalContent ? (
                          <FaChevronCircleDown
                            className="h-5 w-5 cursor-pointer"
                            aria-hidden="true"
                            onClick={toggleAdditionalContent}
                          />
                        ) : (
                          <FaChevronCircleUp
                            className="h-5 w-5 cursor-pointer"
                            aria-hidden="true"
                            onClick={toggleAdditionalContent}
                          />
                        )}
                      </div>
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
