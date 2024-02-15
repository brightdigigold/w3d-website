import React from "react";

const SuccessInvestment = () => {
  return (
    <div className="bg-theme">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16 grid grid-cols-2 gap-20 place-items-center">
        <div>
          <h1 className="text-3xl extrabold text-white mb-12">
            Succession Of Gold
            <br /> Investment In Years
          </h1>
          <p className="text-white text-md">
            Over The Years, Gold Has Proven To Be A Stable Investment, And It
            Has Shown Stable Consistency And Growth In Value. While There Have
            Been Fluctuations In Gold Prices, Its Long-Term Trend Has Always
            Been Upwards.
            <br />
            <br />
            With Bright DiGi Gold, Investing In Gold Has Been Considered As A
            Smart Investment Choice For Those Looking To Diversify Their
            Investment Portfolio And Protect Their Wealth.
          </p>
        </div>

        <div className="flex justify-center">
          <object
            className="h-96"
            type="image/svg+xml"
            data="/images/growth_v1.svg"
          >
            svg-animation
          </object>
        </div>
      </div>
    </div>
  );
};

export default SuccessInvestment;
