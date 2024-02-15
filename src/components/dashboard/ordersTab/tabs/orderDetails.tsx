import { formatString } from "@/components/helperFunctions";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React from "react";

const OrderDetails = (props: any) => {
  // console.log('props', props);
  return (
    <>
      <div className="coins_background rounded-lg shadow-black shadow-xl p-3 mb-3">
        <p className="text-xl">Transaction Status</p>
        <div className="grid grid-cols-3  justify-between pb-3">
          <div className="flex items-center col-span-2">
            <div>
              {props?.orderDetails?.status === "SUCCESS" ||
              props?.orderDetails?.status === "COMPLETED" ? (
                <img src="/check.png" alt="" className="" width={40} />
              ) : props?.orderDetails?.status === "PENDING" ? (
                <img src="/question-mark.png" alt="" className="" width={30} />
              ) : (
                <img src="/close.png" alt="" className="" width={40} />
              )}
            </div>
            <p className="px-2 col-span-1 text-sm sm:text-base">
              {props?.orderDetails?.orderType === "PRODUCT" && (
                <p>Coin Purchase</p>
              )}
              {props?.orderDetails?.orderType === "CART" && (
                <p>Cart</p>
              )}
              {props?.orderDetails?.orderType === "REWARD" &&
                "Promotional " + formatString(props?.orderDetails?.itemType)}
              {props?.orderDetails?.orderType === "BUY" && <p>Purchase</p>}
              {props?.orderDetails?.orderType === "SELL" && <p>Sold</p>}
              {props?.orderDetails?.orderType === "GIFT" &&
                props?.orderDetails?.rewardsType === "SEND" && <p>Gift Sent</p>}
              {props?.orderDetails?.orderType === "GIFT" &&
                props?.orderDetails?.rewardsType === "RECEIVED" && (
                  <p>Gift Received</p>
                )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm sm:text-base">
              {new Date(props.orderDetails?.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
            <p className="text-sm sm:text-base">
              {new Date(props.orderDetails?.createdAt).toLocaleTimeString(
                "en-IN",
                {
                  hour: "numeric",
                  minute: "numeric",
                }
              )}
            </p>
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-3  justify-between pb-3">
            <div className="flex items-center col-span-2">
              <div className="">
                {props?.orderDetails?.status === "SUCCESS" ||
                props?.orderDetails?.status === "COMPLETED" ? (
                  <img src="/check.png" alt="" className="" width={40} />
                ) : props?.orderDetails?.status === "PENDING" ? (
                  <img
                    src="/question-mark.png"
                    alt=""
                    className=""
                    width={30}
                  />
                ) : (
                  <img src="" alt="/close.png" className="" width={40} />
                )}
              </div>
              <p className="px-2 col-span-1 text-sm sm:text-base">
                {props?.orderDetails?.orderType === "PRODUCT" &&
                  formatString(props?.orderDetails?.itemType) +
                    " Coin Purchase"}
                {props?.orderDetails?.orderType === "REWARD" &&
                  "Promotional " +
                    formatString(props?.orderDetails?.itemType) +
                    " Received"}
                {props?.orderDetails?.orderType === "BUY" &&
                  formatString(props?.orderDetails?.itemType) + " Purchase"}
                {props?.orderDetails?.orderType === "SELL" && <p>Sold</p>}
                {props?.orderDetails?.orderType === "GIFT" &&
                  props?.orderDetails?.rewardsType === "SEND" &&
                  formatString(`${props?.orderDetails?.itemType}`) +
                    " Gift Sent"}
                {props?.orderDetails?.orderType === "GIFT" &&
                  props?.orderDetails?.rewardsType === "RECEIVED" &&
                  formatString(`${props?.orderDetails?.itemType}`) +
                    " Gift Received"}
              </p>
            </div>
            <div className=" text-right">
              <p className="text-sm sm:text-base">
                {new Date(props.orderDetails?.updatedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>
              <p className="text-sm sm:text-base">
                {new Date(props.orderDetails?.updatedAt).toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "numeric",
                    minute: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-between ">
            <div>Order Id</div>
            <p>{props?.orderDetails?.order_id}</p>
          </div>
        </div>
        <div className="flex justify-center">
          {props?.orderDetails?.status == "SUCCESS" &&
            props?.orderDetails?.challanUrl && (
              <Link
                target="_blank"
                className=""
                href={props?.orderDetails?.challanUrl}
              >
                <div className="text-center m-2 pb-3 flex justify-around">
                  <button className="border-2 border-yellow-500 py-2 px-4 rounded-2xl mt-4 flex text-yellow-400">
                    Download Challan
                    <ArrowDownIcon className="h-5 ml-2 text-yellow-300" />
                  </button>
                </div>
              </Link>
            )}
          {props?.orderDetails?.status == "SUCCESS" &&
            props?.orderDetails?.invoiceUrl && (
              <Link
                target="_blank"
                className=""
                href={props?.orderDetails?.invoiceUrl}
              >
                <div className="text-center m-2 pb-3 flex justify-around">
                  <button className="border-2 border-yellow-500 py-2 px-4 rounded-2xl mt-4 flex text-yellow-400">
                    Download Invoice
                    <ArrowDownIcon className="h-5 ml-2 text-yellow-300" />
                  </button>
                </div>
              </Link>
            )}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
