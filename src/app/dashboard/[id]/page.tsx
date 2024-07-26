import { AesEncrypt, funcForDecrypt } from "@/components/helperFunctions";
import NextImage from "@/components/nextImage";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import mixpanel from "mixpanel-browser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import React, { useEffect, useState } from "react";

interface TransactionData {
  data: {
    transactionStatus: string;
    message: string;
    createdAt: string;
    initializeTransactionData: {};
    order_id: {
      orderType: string;
      itemType: string;
      invoiceUrl: string;
      gram: number;
    };
    transactionData: {
      payment_status: string;
    };
    amount: number;
  };
}

async function fetchTransactionData(id: string, token: string) {
  const configHeaders = {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const data = {
    id,
  };

  const resAfterEncrypt = await AesEncrypt(data);

  const body = {
    payload: resAfterEncrypt,
  };

  try {
    const response = await axios.post(`${process.env.baseUrl}/user/order/detailsById?`, body, configHeaders);
    const decryptedData = await funcForDecrypt(response.data.payload);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Error fetching transaction data", error);
    return null;
  }
}

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const Page: React.FC<PageProps> = async ({ params }) => {
  // const [dataOfTransaction, setDataOfTransaction] = useState<TransactionData | null>(null);
  const router = useRouter();
  // const [remainingTime, setRemainingTime] = useState(5);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem("token")
  //     const data = await fetchTransactionData(params.id, token!);
  //     setDataOfTransaction(data);
  //   };

  //   fetchData();
  // }, [params.id]);

  const token = localStorage.getItem("token")

  const data = await fetchTransactionData(params.id, token!);

  console.log('data: ====>', data);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setRemainingTime((prevTime) => prevTime - 1);
  //   }, 1000);

  //   const timeout = setTimeout(() => {
  //     clearInterval(interval);
  //     router.push("/dashboard");
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //     clearTimeout(timeout);
  //   };
  // }, [router]);

  // useEffect(() => {
  //   if (dataOfTransaction?.data?.transactionStatus === "SUCCESS") {
  //     mixpanel.track('Order Success', {
  //       order_id: params.id,
  //       item_type: dataOfTransaction.data.order_id.itemType,
  //       order_type: dataOfTransaction.data.order_id.orderType,
  //       amount: dataOfTransaction.data.amount,
  //     });
  //   }
  // }, [dataOfTransaction, params.id]);

  // console.log('dataOfTransaction===>', dataOfTransaction)

  return (
    <>
    <div className="px-4">
      <div className="min-h-screen flex items-center justify-center">
        <Image
          className="absolute -bottom-12 -left-20 opacity-30"
          src="/bdgwhite.png"
          alt="Bright Digi Gold"
          width={500}
          height={500}
        />
        <div className="w-[580px] z-[20]">
          <div className="coins_background shadow-md rounded-md mb-100 text-center text-white py-12 relative">
            <div className="flex justify-center">
              {/* {dataOfTransaction?.data?.transactionStatus === "SUCCESS" ? (
                <img
                  src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Successfully+Done.gif"
                  className="absolute h-36 -top-16"
                />
              ) : (
                <img
                  src="https://brightdigigold.s3.ap-south-1.amazonaws.com/oops.gif"
                  className="absolute h-36 -top-16"
                />
              )}
            </div> */}
            {/* {dataOfTransaction?.data?.order_id?.orderType === "BUY" &&
              dataOfTransaction.data.order_id.itemType === "GOLD" && (
                <p className="text-2xl italic pt-16">
                  24k <span className="text-gold01">Gold</span> Purchase
                  <br />
                  <span className="text-3xl">{dataOfTransaction.data.transactionData.payment_status}</span>
                </p>
              )}
            {dataOfTransaction?.data?.order_id?.orderType === "BUY" &&
              dataOfTransaction.data.order_id.itemType === "SILVER" && (
                <p className="text-2xl italic pt-16">
                  99.99% <span className="text-gold01">Silver</span> Purchase
                  <br />
                  <span className="text-3xl">{dataOfTransaction.data.transactionData.payment_status}</span>
                </p>
              )}
            {dataOfTransaction?.data?.order_id?.orderType === "PRODUCT" &&
              dataOfTransaction.data.order_id.itemType === "GOLD" && (
                <p className="text-2xl italic pt-16">
                  24k <span className="text-gold01">Gold Coin</span> Purchase
                  <br />
                  <span className="text-3xl">{dataOfTransaction.data.transactionData.payment_status}</span>
                </p>
              )}
            {dataOfTransaction?.data?.order_id?.orderType === "PRODUCT" &&
              dataOfTransaction.data.order_id.itemType === "SILVER" && (
                <p className="text-2xl italic pt-16">
                  99.99% <span className="text-gold01">Silver Coin</span> Purchase
                  <br />
                  <span className="text-3xl">{dataOfTransaction.data.transactionData.payment_status}</span>
                </p>
              )}
            {dataOfTransaction?.data?.order_id?.orderType === "CART" && (
              <p className="text-2xl italic pt-16">
                Cart Purchase
                <br />
                <span className="text-3xl">{dataOfTransaction.data.transactionData.payment_status}</span>
              </p>
            )}
            <div className="divide-x divide-yellow-400 flex gap-3 justify-center mt-4 text-xl">
              <p>₹ {dataOfTransaction?.data?.amount}</p>
              <p className="pl-3">{dataOfTransaction?.data?.order_id?.gram} gm</p>
            </div>
          </div> */}
          {/* <div
            className={`p-4 mx-6 ${dataOfTransaction?.data?.transactionStatus === "SUCCESS"
              ? "bg-green-500"
              : dataOfTransaction?.data?.transactionStatus === "FAILED"
                ? "bg-red-500"
                : dataOfTransaction?.data?.transactionStatus === "PENDING"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              } rounded-bl-md rounded-br-md`}
          >
            {dataOfTransaction?.data?.transactionStatus === "SUCCESS" && (
              <Link target="_blank" href={`${dataOfTransaction?.data?.order_id?.invoiceUrl}`}>
                <button className="rounded-full px-4 py-2 text-white flex items-center bg-theme text-sm mx-auto">
                  Download Invoice
                  <ArrowDownIcon className="text-gold01 h-4 gap-2" />
                </button>
              </Link>
            )} */}
            <p className="text-blue-200">Redirecting to dashboard in 10 seconds...</p>
          {/* </div> */}
        </div>
      </div>
      </div>
      </div>

    </div>
    </>
  );
};

export default Page;
