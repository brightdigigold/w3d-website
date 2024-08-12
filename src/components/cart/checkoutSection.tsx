import CustomButton from "../customButton";

const CheckoutSection = ({ finalAmount, loading, checkoutCart }) => (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-100 text-md">Total Amount</p>
        <p className="text-gray-100 text-xl sm:text-2xl extrabold tracking-wide">
          {finalAmount.toLocaleString("en-IN")}
          <span className="text-gray-400 text-sm ml-1 font-thin tracking-tighter">Incl. (GST)</span>
        </p>
      </div>
      <CustomButton title="PROCEED" loading={loading} containerStyles="inline-flex justify-center rounded-xl bg-themeBlue px-5 py-4 text-base bold text-black ring-1 ring-inset sm:mt-0 sm:w-auto" handleClick={checkoutCart} />
    </div>
  );

  export default CheckoutSection
  