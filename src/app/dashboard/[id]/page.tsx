'use client'
import Image from "next/image";
import Link from "next/link";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import RedirectTimer from "@/components/redirectTimer";
import { fetchTransactionData } from "@/api/DashboardServices";
interface PageProps {
  params: { id: string };
}

const Page = async ({ params }: PageProps) => {
  const token = localStorage.getItem("token"); 
  const data = await fetchTransactionData(params.id, token!);

  console.log("data===>------->", data);

  return (
    <div className="px-4">
      <div className="min-h-screen flex items-center justify-center">
        <Image
          className="absolute -bottom-12 -left-20 opacity-30"
          src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgwhite5.webp"
          alt="Bright Digi Gold"
          width={500}
          height={500}
        />
        <div className="w-[580px] z-[20]">
          <div className="coins_background shadow-md rounded-md mb-100 text-center text-white py-12 relative">
            <div className="flex justify-center">
              {data?.data?.transactionStatus === "SUCCESS" ? (
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
            </div>
            {data?.data?.order_id?.orderType === "BUY" &&
              data?.data?.order_id.itemType === "GOLD" && (
                <p className="text-2xl italic pt-16">
                  24k <span className="text-gold01">Gold</span> Purchase
                  <br />
                  <span className="text-3xl">{data?.data?.transactionData.payment_status}</span>
                </p>
              )}
            {data?.data?.order_id?.orderType === "BUY" &&
              data?.data?.order_id.itemType === "SILVER" && (
                <p className="text-2xl italic pt-16">
                  99.99% <span className="text-gold01">Silver</span> Purchase
                  <br />
                  <span className="text-3xl">{data?.data?.transactionData.payment_status}</span>
                </p>
              )}
            {data?.data?.order_id?.orderType === "PRODUCT" &&
              data?.data?.order_id.itemType === "GOLD" && (
                <p className="text-2xl italic pt-16">
                  24k <span className="text-gold01">Gold Coin</span> Purchase
                  <br />
                  <span className="text-3xl">{data?.data?.transactionData.payment_status}</span>
                </p>
              )}
            {data?.data?.order_id?.orderType === "PRODUCT" &&
              data?.data?.order_id.itemType === "SILVER" && (
                <p className="text-2xl italic pt-16">
                  99.99% <span className="text-gold01">Silver Coin</span> Purchase
                  <br />
                  <span className="text-3xl">{data?.data?.transactionData.payment_status}</span>
                </p>
              )}
            {data?.data?.order_id?.orderType === "CART" && (
              <p className="text-2xl italic pt-16">
                Cart Purchase
                <br />
                <span className="text-3xl">{data?.data?.transactionData.payment_status}</span>
              </p>
            )}
            <div className="divide-x divide-yellow-400 flex gap-3 justify-center mt-4 text-xl">
              <p>₹ {data?.data?.amount}</p>
              <p className="pl-3">{data?.data?.order_id?.gram} gm</p>
            </div>
          </div>
          <div
            className={`p-4 mx-6 ${data?.data?.transactionStatus === "SUCCESS"
              ? "bg-green-500"
              : data?.data?.transactionStatus === "FAILED"
                ? "bg-red-500"
                : data?.data?.transactionStatus === "PENDING"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              } rounded-bl-md rounded-br-md`}
          >
            {data?.data?.transactionStatus === "SUCCESS" && (
              <Link target="_blank" href={`${data?.data?.order_id?.invoiceUrl}`}>
                <button className="rounded-full px-4 py-2 text-white flex items-center bg-theme text-sm mx-auto">
                  Download Invoice
                  <ArrowDownIcon className="text-gold01 h-4 gap-2" />
                </button>
              </Link>
            )}
            <RedirectTimer /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
