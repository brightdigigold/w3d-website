
import RefundAndCancellation from "@/components/refundAndCancellation/refundAndCancellation";
import { Metadata } from "next";

const page = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 pb-28 xl:pb-8 pt-32">
      <div className="container">
        <div className="row pt-5 pb-5">
          <div className=" sm:flex justify-between items-center text-center sm:text-left">
            <h1 className="text-2xl sm:text-7xl mb-4 extrabold text-white">
              Refund & <br />
              Cancellations
            </h1>
            <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Refund+Policy.gif" className="" />
          </div>
          <RefundAndCancellation />
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
