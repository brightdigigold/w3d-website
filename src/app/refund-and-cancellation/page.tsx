
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="text-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-16 pt-32">
        <div className="container">
          <div className="row pt-5 pb-5">
            <div className=" sm:flex justify-between items-center text-center sm:text-left">
              <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white">
                Refund & <br />
                Cancellations
              </h1>
              <img src="/lottie/Refund Policy.gif" className="" />
            </div>

            <div className="col-12">
              <div className="pl-2 text-lg">
                <p className="leading-8">
                  Buying and Selling of the Digital Gold and Silver through
                  Bright DiGi Gold platform are governed by the standard refund
                  and cancellation policy as under:
                </p>
              </div>
              <div className=" text-lg">
                <ol>
                  <li className="p-2 list-decimal">
                    When a transaction for the buying and selling of digital
                    gold and silver has been completed on our platform, refunds
                    and cancellations are not permitted. Once an order has been
                    placed, it is considered to be final.
                  </li>
                  <li className="p-2 list-decimal">
                    After the successful completion of the buy transaction,
                    there is a lock-in period of 48 hours and the customer can
                    initiate the sale after 48 hours. Please note that all
                    inclusive charges will be applicable on each of these
                    transactions.
                  </li>
                  <li className="p-2 list-decimal">
                    If any amount deducted from the customer's account that was
                    unsuccessfully processed as a result of technical
                    difficulties on our end will be returned (to the customer's
                    bank account) in 4 to 5 working days. The customer is
                    responsible for handling any technical issues that might
                    happen and impact the transaction.
                  </li>
                  <li className="p-2 list-decimal">
                    Customers whose accounts have been debited due to fraudulent
                    transactions must file a complaint with the cyber cell and
                    share a copy of that complaint with us at{" "}
                    <Link href='mailto: support@brightdigigold.com'>
                      <span style={{ color: "#0d6efd" }}>
                        support@brightdigigold.com
                      </span>
                    </Link>
                    within 48 hours of the transaction. The company has no
                    responsibility for any losses incurred, and in the event
                    that a refund is necessary, it will be processed based on
                    the Selling Price displayed on our App and Web. Please note
                    that the refund process may require 10 to 15 working days.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
export const metadata: Metadata = {
  title: "Refund & cancellation - Bright DiGi Gold   ",
  description:
    "Buying and Selling of Digital Gold through Bright DiGi Gold are governed by the standard refund and cancellation policy.  ",
};
