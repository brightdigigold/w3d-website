"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  AesDecrypt,
  funForAesEncrypt,
  funcForDecrypt,
} from "../helperFunctions";
import axios from "axios";
import Swal from "sweetalert2";
import { fetchAllUPI } from "@/api/DashboardServices";
import { fetchWalletData } from "@/redux/vaultSlice";
import { useDispatch } from "react-redux";
import ProgressBar from "../progressBar";

export default function SelectUpiModalForPayout({
  isOpen,
  onClose,
  transactionId,
}: any) {
  const dispatch = useDispatch();
  const metalType = useSelector((state: RootState) => state.shop.metalType);
  const purchaseType = useSelector((state: RootState) => state.shop.purchaseType);
  const actualAmount = useSelector((state: RootState) => state.shop.actualAmount);
  const metalQuantity = useSelector((state: RootState) => state.shop.metalQuantity);
  const [upiList, setUpiList] = useState([]);
  const [allUpiList, setAllUpiList] = useState([]);
  const [allBankList, setAllBankList] = useState<any[]>([]);
  const [upiId, setUpiId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectUpiHandler = (e: any) => {
    setUpiId(e.target.value);
    setErrorMessage("");
  };

  const fetchBankAndUPIDetails = async () => {
    try {
      const { UpiList, BankList, decryptedDataList } = await fetchAllUPI();
      setAllUpiList(UpiList);
      setUpiList(upiList);
      setAllBankList(decryptedDataList);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchBankAndUPIDetails();
  }, []);


  const cancelButtonRef = useRef(null);

  const closeModal = () => {
    onClose(false);
  };
  const token = localStorage.getItem("token");

  const validate = () => {
    if (upiId) {
      return true;
    } else {
      return false;
    }
  };

  const sellHandler = () => {
    if (validate()) {
      sellReqApiHandler();
    } else {
      setErrorMessage("Please select a withdraw option.");
    }
  };

  const sellReqApiHandler = async () => {
    const dataToBeDecrypt = {
      purpose:
        purchaseType === "sell" && metalType === "gold"
          ? "SELL_GOLD"
          : "SELL_SILVER",
      unit: "AMOUNT",
      gram: metalQuantity,
      amount: actualAmount,
      order_preview_id: transactionId,
      amountWithoutTax: actualAmount,
      totalAmount: actualAmount,
      paymentMode: upiId,
      itemMode: "DIGITAL",
      fromApp: false,
    };

    const resAfterEncryptData = await funForAesEncrypt(dataToBeDecrypt);

    const payloadToSend = {
      payload: resAfterEncryptData,
    };
    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `${process.env.baseUrl}/user/sale/order/request`,
        payloadToSend,
        configHeaders
      )
      .then(async (resAfterSellReq) => {
        const decryptedData = await funcForDecrypt(
          resAfterSellReq.data.payload
        );

        if (JSON.parse(decryptedData).status) {
          Swal.fire({
            html: `<img src="/lottie/Successfully Done.gif" class="swal2-image-custom" alt="Successfully Done">`,
            titleText: `${JSON.parse(decryptedData).message}`,
            timer: 1500,
          });
          closeModal();
          dispatch(fetchWalletData() as any);
        }
      })
      .catch(async (errInBuyReq) => {
        const decryptedData = await funcForDecrypt(
          errInBuyReq.response.data.payload
        );
        let decryptPayload = JSON.parse(decryptedData);
        Swal.fire({
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          title: "Oops...",
          titleText: decryptPayload.message,
        });
      });
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg coins_backgroun text-left shadow-xl transition-all w-full sm:max-w-sm">
                <p className="bold text-md text-center mt-3 sm:mt-2 tracking-wide text-white">Select Your Withdrawl Method</p>
                <div className="px-4 my-4">
                  <div>
                    {allUpiList.map(({ value, _id }: any, key: number) => {
                      return (
                        <div
                          key={key}
                          className="flex items-center border border-gray-500 shadow-black shadow-sm rounded-md cursor-pointer my-3 p-2 py-3"
                          onClick={() => selectUpiHandler({ target: { value: _id } })}
                        >
                          <input
                            className="w-4 h-4 cursor-pointer accent-green-800 focus:accent-green-600"
                            type="checkbox"
                            id={_id}
                            name="fav_language"
                            value={_id}
                            checked={upiId === _id}
                            onChange={selectUpiHandler}
                          />
                          <div className="text-gray-300 pl-2 tracking-wider">
                            {AesDecrypt(value)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {allBankList?.map((item, key) => {
                      return (
                        <div
                          key={key}
                          onClick={() => selectUpiHandler({ target: { value: item._id } })}
                        >
                          {item.documentType === "BANKACCOUNT" ? (
                            <div className="flex justify-between items-center shadow-black shadow-sm border border-gray-500 rounded-md cursor-pointer my-2 p-2 text-white">
                              <div className="flex items-center">
                                <input
                                  className="w-4 h-4 cursor-pointer accent-green-800 focus:accent-green-700"
                                  type="checkbox"
                                  onChange={selectUpiHandler}
                                  id="html"
                                  checked={upiId === item._id}
                                  name="fav_language"
                                  value={item._id}
                                />
                                <div className="ml-2">Bank</div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center text-gray-300">
                                  <div>
                                    <div>
                                      {AesDecrypt(item.bankData.bankName)}
                                    </div>
                                    {AesDecrypt(item.bankData.accountNumber)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {errorMessage && (
                  <p className="text-red-600 text-md text-center my-2">
                    {errorMessage}
                  </p>
                )}
                <ProgressBar
                  fromCart={true}
                  metalTypeForProgressBar={"both"}
                  displayMetalType={metalType}
                />
                <div className="flex justify-end gap-4 coins_backgroun p-2">
                  <button
                    type="button"
                    className="rounded-md bg-themeBlue px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-100 sm:mt-0 sm:w-auto"
                    ref={cancelButtonRef}
                    onClick={() => closeModal()}
                  >
                    CANCEL
                  </button>
                  {purchaseType === "sell" && (
                    <button
                      type="button"
                      className="rounded-md bg-themeBlue px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-100 sm:mt-0 sm:w-auto"
                      ref={cancelButtonRef}
                      onClick={() => sellHandler()}
                    >
                      NEXT
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
