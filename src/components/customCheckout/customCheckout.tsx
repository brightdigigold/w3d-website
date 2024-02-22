"use client";
import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "../progressBar";
import Swal from "sweetalert2";
import { funForAesEncrypt, funcForDecrypt } from "../helperFunctions";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Loading from "@/app/loading";

const CustomCheckout = ({ data }: any) => {
  const orderIdRef = useRef(null);
  const [payload, setpayload] = useState({});
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState<boolean>(true);
  const [finalAmount, setfinalAmount] = useState<number>(0);
  const [digitalPayment, setDigitalPayment] = useState<boolean>(false);
  const [physicalPayment, setPhysicalPayment] = useState<boolean>(false);
  const [cartPayment, setCartPayment] = useState<boolean>(false);
  const [PaymentMethodError, setPaymentMethodError] = useState<string>("");
  const UPI_PAYMENT = "upi";
  const DEBIT_CARD_PAYMENT = "dc";
  const NETBANKING_PAYMENT = "nb";
  const CREDIT_CARD_PAYMENT = "cc";
  let cashfree: any;
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const [selectedButton, setSelectedButton] = useState(
    finalAmount <= 100000 ? 1 : null
  );

  const handleButtonClick = (buttonIndex: any) => {
    // Select the clicked button
    setSelectedButton(buttonIndex);
  };

  useEffect(() => {
    setPaymentMethod((finalAmount <= 100000) ? UPI_PAYMENT : "")

    const fetchData = async () => {
      try {
        setLoading(true);
        const decryptedData = await funcForDecrypt(data);
        // console.log(
        //   "decryptedData from custom checkout",
        //   JSON.parse(decryptedData)
        // );
        setpayload({ ...JSON.parse(decryptedData) });
        // const { ...itemMode } = JSON.parse(decryptedData);
        const { itemMode, totalAmount } = JSON.parse(decryptedData);

        if (itemMode === "DIGITAL") {
          setfinalAmount(totalAmount);
          setDigitalPayment(true);
          setLoading(false);
        } else if (itemMode === "PHYSICAL") {
          setfinalAmount(totalAmount);
          setPhysicalPayment(true);
          setLoading(false);
        } else {
          setfinalAmount(totalAmount.finalAmount);
          setCartPayment(true);
          setLoading(false);
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data, finalAmount]);

  if (loading) {
    return <Loading />;
  }

  const initializeSDK = async () => {
    cashfree = await load({
      mode: "production",
      // mode: "sandbox",

    });
  };
  initializeSDK();

  const doPayment = async (sessionId: string) => {

    if (!finalAmount || finalAmount === 0) {
      // Display an error message to the user
      alert("Invalid amount. Cannot proceed with the payment.");
      return; // Exit the function early
    }

    const checkoutOptions = {
      paymentSessionId: sessionId,
      // redirectTarget: "_self",
      redirectTarget: "_blank",

    };
    cashfree.checkout(checkoutOptions);
  };

  const checkoutCart = async (data: any) => {
    const resAfterEncryptData = await funForAesEncrypt(data);
    const payloadToSend = {
      payload: resAfterEncryptData,
    };
    // console.log("====> ", data);
    const configHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `${process.env.baseUrl}/user/ecom/placecart/order`,
        payloadToSend,
        configHeaders
      )
      .then(async (resAfterBuyReq) => {
        const decryptedData = await funcForDecrypt(resAfterBuyReq.data.payload);

        if (JSON.parse(decryptedData).status) {
          orderIdRef.current = JSON.parse(decryptedData).data.order.order_id;
          let sessionId =
            JSON.parse(decryptedData).data.paymentRequest.data
              .payment_session_id;
          doPayment(sessionId);
        }
      })
      .catch((errInBuyReq) => {
        Swal.fire({
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          title: "Oops...",
          titleText: errInBuyReq,
        });
      });
  };

  const buyDigitalGoldOrSilver = async (data: any) => {
    const resAfterEncryptData = await funForAesEncrypt(data);
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
        `${process.env.baseUrl}/user/order/request`,
        payloadToSend,
        configHeaders
      )
      .then(async (resAfterBuyReq) => {
        const decryptedData = await funcForDecrypt(resAfterBuyReq.data.payload);
        if (JSON.parse(decryptedData).status) {
          orderIdRef.current = JSON.parse(decryptedData).data.order.order_id;
          let sessionId =
            JSON.parse(decryptedData).data.paymentRequest.data
              .payment_session_id;
          doPayment(sessionId);
        }
      })
      .catch((errInBuyReq) => {
        Swal.fire({
          html: `<img src="/lottie/oops.gif" class="swal2-image-customs" alt="Successfully Done">`,
          title: "Oops...",
          titleText: "Something went wrong!",
        });
      });
  };

  const physicalModeCoins = async (data: any) => {
    const resAfterEncryptData = await funForAesEncrypt(data);
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
        `${process.env.baseUrl}/user/order/request`,
        payloadToSend,
        configHeaders
      )
      .then(async (resAfterBuyReq) => {
        const decryptedData = await funcForDecrypt(resAfterBuyReq.data.payload);

        if (JSON.parse(decryptedData).status) {
          orderIdRef.current = JSON.parse(decryptedData).data.order.order_id;
          let sessionId =
            JSON.parse(decryptedData).data.paymentRequest.data
              .payment_session_id;
          doPayment(sessionId);
        }
      })
      .catch((errInBuyReq) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  const paymentHandler = () => {
    if (!paymentMethod) {
      setPaymentMethodError("Please select a payment method");
      return;
    }
    if (digitalPayment) {
      buyDigitalGoldOrSilver({ ...payload, paymentInstrument: paymentMethod });
    } else if (physicalPayment) {
      physicalModeCoins({ ...payload, paymentInstrument: paymentMethod });
    } else if (cartPayment) {
      checkoutCart({ ...payload, paymentType: paymentMethod });
    }
  };

  return (
    <div className="bg-themeLight01 shadow-md rounded-md w-[580px] mb-100 z-10 relative">
      <div className="mb-6 mt-4 px-2 sm:px-0">
        <ProgressBar
          fromCart={true}
          metalTypeForProgressBar={"both"}
          displayMetalType={"both"}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 sm:gap-4 items-center">
        <div className="px-8">
          <h1 className="text-white text-lg mb-4">Choose Payment Method</h1>
          <div className="grid grid-cols-1 gap-4 mb-6 ">
            <>
              {finalAmount <= 100000 && (
                <button
                  onClick={() => {
                    setPaymentMethod(UPI_PAYMENT);
                    handleButtonClick(1);
                    setPaymentMethodError("");
                  }}
                  className={`flex bg-themeLight01 border-2 border-[bg-themeLightBlue] ${selectedButton === 1 ? "border-2 border-yellow-600" : ""
                    }  items-center p-2 sm:p-4 rounded`}
                >
                  <img src="/upi.png" className="h-8 w-13 pr-4" />
                  <span className={styles.p0}>UPI</span>
                </button>
              )}
              <button
                onClick={() => {
                  setPaymentMethod(DEBIT_CARD_PAYMENT);
                  handleButtonClick(2);
                  setPaymentMethodError("");
                  // buyDigitalGoldOrSilver({ ...payload, paymentType: 'dc', })
                }}
                className={`flex bg-themeLight01 border-2 border-[bg-themeLightBlue]${selectedButton === 2 ? "border-2 border-yellow-600" : ""
                  }  items-center p-2 sm:p-4 rounded`}
              >
                <img src="/images/Debit Card.png" className="h-12 w-20 pr-4" />
                <span className={styles.p0}>Debit Card</span>
              </button>
              <button
                onClick={() => {
                  setPaymentMethod(NETBANKING_PAYMENT);
                  setPaymentMethodError("");
                  handleButtonClick(3);
                  // checkoutCart({ ...payload, paymentType: 'nb', })
                }}
                className={`flex bg-themeLight01 border-2 border-[bg-themeLightBlue]${selectedButton === 3 ? "border-2 border-yellow-600" : ""
                  }  items-center p-2 sm:p-4 rounded`}
              >
                <img src="/images/Net Banking.png" className="h-12 w-20 pr-4" />
                <span className={styles.p0}>Netbanking</span>
              </button>
              <button
                onClick={() => {
                  setPaymentMethod(CREDIT_CARD_PAYMENT);
                  setPaymentMethodError("");
                  handleButtonClick(4);
                  // checkoutCart({ ...payload, paymentType: 'cc', })
                }}
                className={`flex bg-themeLight01 border-2 border-[bg-themeLightBlue]${selectedButton === 4 ? "border-2 border-yellow-600" : ""
                  }  items-center p-2 sm:p-4 rounded`}
              >
                <img src="/images/Credit Card.png" className="h-12 w-20 pr-4" />
                <span className={styles.p0}>Credit Card</span>
              </button>
            </>
          </div>
        </div>

        {finalAmount && finalAmount > 100000 ? (
          <>
            <div className={`px-8 pb-6 sm:px-0 sm:pb-0 `}>
              <div>
                {PaymentMethodError && (
                  <p className="text-red-400 text-lg">{PaymentMethodError}</p>
                )}
                <div>
                  <p
                    className={`text-white text-sm pb-2 ${!paymentMethod && paymentMethod == '' ? "filter blur-sm" : ""
                      }`}
                  >
                    Payment fulfilled via
                  </p>
                  <img
                    src="/Cashfree_Payments_Logo.png"
                    className={`h-10 w-40 pr-4 mb-2 ${!paymentMethod && paymentMethod == '' ? "filter blur-sm" : ""
                      }`}
                    alt="Razorpay"
                  />
                </div>
              </div>

              <div
                className={`cursor-pointer ${!paymentMethod || paymentMethod == '' ? "filter blur-sm" : ""
                  }`}
              >
                <button
                  onClick={() => {
                    paymentHandler();
                  }}
                  className="bg-themeBlue  text-black font-bold py-2 px-4 rounded mb-4"
                  disabled={!paymentMethod}
                >
                  Purchase for ₹{finalAmount}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={`px-8 pb-6 sm:px-0 sm:pb-0 `}>
            <div>
              {PaymentMethodError && (
                <p className="text-red-400 text-lg">{PaymentMethodError}</p>
              )}

              <div>
                <p className={`text-white text-sm pb-2 `}>
                  Payment fulfilled via
                </p>
                <img
                  src="/Cashfree_Payments_Logo.png"
                  className={`h-10 w-40 pr-4 mb-2 `}
                  alt="Razorpay"
                />
              </div>
            </div>

            <div className={`cursor-pointer `}>
              <button
                onClick={() => {
                  // if (finalAmount <= 100000) {
                  //   setPaymentMethod(UPI_PAYMENT)
                  // }
                  if (digitalPayment) {
                    buyDigitalGoldOrSilver({
                      ...payload,
                      paymentInstrument: paymentMethod,
                    });
                  } else if (physicalPayment) {
                    physicalModeCoins({
                      ...payload,
                      paymentInstrument: paymentMethod,
                    });
                  } else if (cartPayment) {
                    checkoutCart({ ...payload, paymentType: paymentMethod });
                  }
                }}
                className="bg-themeBlue  text-black font-bold py-2 px-4 rounded mb-4"
              // disabled={!paymentMethod}
              >
                Purchase for ₹{finalAmount}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  p0: "text-gray-100 bold sm:text-lg",
};

export default CustomCheckout;
