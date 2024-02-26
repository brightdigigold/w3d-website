import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import ProgressBar from "../progressBar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGoldVaultBalance,
  selectSilverVaultBalance,
} from "@/redux/vaultSlice";
import {
  calculateFinalAmount,
  calculatePurchasedGoldWeight,
  calculatePurchasedSilverWeight,
  setUseVaultBalanceGold,
  setUseVaultBalanceSilver,
} from "@/redux/cartSlice";
import { RootState } from "@/redux/store";

export default function ConvertMetalModal({
  openConvertMetalModal,
  closeModalOfCoin,
  metalTypeToConvert,
}: any) {
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);
  const goldVaultBalance = useSelector(selectGoldVaultBalance);
  const silverVaultBalance = useSelector(selectSilverVaultBalance);
  const [useWallet, setUseWallet] = useState(false);
  let fromCart: boolean = true;
  const [showLottie, setShowLottie] = useState(false);
  const isGoldVault = useSelector((state: RootState) => state.cart.useVaultBalanceGold);
  const isSilverVault = useSelector((state: RootState) => state.cart.useVaultBalanceSilver);

  const handleSelectConvertFromVaultGold = (e: any) => {
    dispatch(setUseVaultBalanceGold(!isGoldVault));
    dispatch(calculatePurchasedGoldWeight());
    dispatch(calculateFinalAmount());
    setUseWallet(e.target.checked);
    // closeModalOfCoin();
  };

  const handleSelectConvertFromVaultSilver = (e: any) => {
    dispatch(setUseVaultBalanceSilver(!isSilverVault));
    dispatch(calculatePurchasedSilverWeight());
    dispatch(calculateFinalAmount())
    setUseWallet(e.target.checked);;
    // closeModalOfCoin();
  };

  useEffect(() => {
    let timer;
    if (useWallet) {
      setShowLottie(true);
      timer = setTimeout(() => {
        setShowLottie(false);
        closeModalOfCoin();

      }, 5000);
    } else if (useWallet) {
      setShowLottie(true);
      timer = setTimeout(() => {
        setShowLottie(false);
        closeModalOfCoin();
        // 
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [useWallet]);

  return (
    <Transition.Root show={!openConvertMetalModal} as={Fragment}>
      <Dialog
        as="div"
        className="z-[110] fixed inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => {
          return false;
          closeModalOfCoin();
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
                    className="h-6 w-6 text-white text-lg cursor-pointer font-bold"
                    onClick={() => {
                      closeModalOfCoin();
                    }}
                  />
                </div>
                <div className="transition-height duration-500 ease-in-out overflow-hidden h-auto">
                  <div
                    className={`px-4 pb-4 pt-5 sm:p-6 sm:pb-4 transition-opacity ease-out delay-1000`}
                  >
                    <div className="flex items-start">
                      <div className="w-full  mt-0 text-left">
                        <Dialog.Title
                          as="h2"
                          className="text-xl text-white font-semibold leading-6 tracking-[.1em]"
                        >
                          Convert From Vault
                        </Dialog.Title>
                        <div className="items-center w-full bg-[17455F] border-2 border-yellow-400 rounded-xl my-8  p-3">
                          <div>
                            <div className="flex justify-between gap-4 items-center">
                              <div className="mt-2 mb-2">
                                <div className="text-sm sm:text-base w-full tracking-[.1em] font-semibold text-white">
                                  Available Vault Balance :
                                </div>
                                <div className="flex items-center mt-2 font-semibold text-white ">
                                  <label className="font-medium dark:text-gray-300 text-sm sm:text-base">
                                    Convert All
                                  </label>
                                  {metalTypeToConvert === "GOLD" ? (
                                    <input
                                      id="default-checkbox"
                                      type="checkbox"
                                      checked={isGoldVault}
                                      className={`w-5 h-5 cursor-pointer rounded-lg text-blue-600 bg-black ml-2 focus:bg-bg-theme dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${goldVaultBalance === 0 ||
                                        silverVaultBalance === 0
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                        }`}
                                      disabled={
                                        goldVaultBalance === 0 &&
                                        silverVaultBalance === 0
                                      }
                                      onChange={
                                        handleSelectConvertFromVaultGold
                                      }
                                    />
                                  ) : (
                                    <input
                                      id="default-checkbox"
                                      type="checkbox"
                                      checked={isSilverVault}
                                      className={`w-5 h-5 cursor-pointer rounded-lg text-blue-600 bg-black ml-2 focus:bg-bg-theme dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${goldVaultBalance === 0 ||
                                        silverVaultBalance === 0
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                        }`}
                                      disabled={
                                        goldVaultBalance === 0 &&
                                        silverVaultBalance === 0
                                      }
                                      onChange={
                                        handleSelectConvertFromVaultSilver
                                      }
                                    />
                                  )}
                                  {showLottie &&
                                    metalTypeToConvert === "GOLD" && (
                                      <div className="absolute z-[100] top-0 w-full left-0 h-full justify-center flex items-center coins_backgroun">
                                        <img
                                          src="/lottie/Conversion.gif"
                                          alt="Conversion Gold"
                                          className="h-60"
                                        />
                                      </div>
                                    )}
                                  {showLottie &&
                                    metalTypeToConvert === "SILVER" && (
                                      <div className="absolute z-[100] top-0 w-full left-0 h-full justify-center flex items-center coins_backgroun">
                                        <img
                                          src="/lottie/Conversion silver.gif"
                                          alt="Conversion Silver"
                                          className="h-60"
                                        />
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="flex items-center bg-themeBlue rounded-xl h-fit py-2">
                                <div className="">
                                  <img
                                    src={"../../images/vault.png"}
                                    alt="digital gold bar"
                                    className={`px-1 py-2 h-12 w-16 sm:h-16 cursor-pointer`}
                                  />
                                </div>
                                <div className="px-2">
                                  <div className="text-xs sm:text-base font-bold text-black">
                                    {metalTypeToConvert}
                                  </div>
                                  <div className="text-yellow-600 font-bold text-xxs sm:text-base">
                                    {metalTypeToConvert === "GOLD"
                                      ? `${goldVaultBalance}`
                                      : `${silverVaultBalance}`}{" "}
                                    GM
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <ProgressBar
                    fromCart={fromCart}
                    metalTypeForProgressBar={metalTypeToConvert}
                    displayMetalType={metalTypeToConvert}
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
