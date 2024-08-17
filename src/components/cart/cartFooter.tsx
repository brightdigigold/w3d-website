import React from "react";
import CustomButton from "@/components/customButton";
import ProgressBar from "@/components/progressBar";
import { FaChevronCircleDown } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface CartFooterProps {
  finalAmount: number;
  loading: boolean;
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  checkoutCart: () => void;
  goldPayload: any[];
  silverPayload: any[];
  totalGoldCoins: number;
  totalSilverCoins: number;
  totalGoldWeight: number;
  totalSilverWeight: number;
  isGoldVault: boolean;
  goldVaultWeightUsed: number;
  purchasedGoldWeight: number;
  amountWithTaxGold: number;
  isSilverVault: boolean;
  silverVaultWeightUsed: number;
  purchasedSilverWeight: number;
  amountWithTaxSilver: number;
  totalMakingCharges: number;
}

const CartFooter: React.FC<CartFooterProps> = ({
  finalAmount,
  loading,
  isOpened,
  setIsOpened,
  checkoutCart,
  goldPayload,
  silverPayload,
  totalGoldCoins,
  totalSilverCoins,
  totalGoldWeight,
  totalSilverWeight,
  isGoldVault,
  goldVaultWeightUsed,
  purchasedGoldWeight,
  amountWithTaxGold,
  isSilverVault,
  silverVaultWeightUsed,
  purchasedSilverWeight,
  amountWithTaxSilver,
  totalMakingCharges,
}) => {
  const toggleViewBreakUp = () => {
    setIsOpened((prevState) => !prevState);
  };

  const renderPriceBreakdownItemCart = ({
    label,
    value,
    imageUrl,
  }: {
    label: string;
    value: string | number;
    imageUrl?: string;
  }) => (
    <div className="py-1">
      <div className="justify-between flex items-center">
        <div className="mb-1 flex items-center">
          {imageUrl && (
            <div className="mr-1">
              <img src={imageUrl} alt={label} className="w-10 h-10" />
            </div>
          )}
          <span className="tracking-wide text-gray-300">{label}</span>
        </div>
        <div>
          <span className="text-blue-100 tracking-wide bold">
            {value.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      <hr
        className="my-0 border-t border-gray-400 mt-1"
        style={{
          backgroundImage:
            "linear-gradient(to right, #d2d6dc 50%, transparent 50%)",
          backgroundSize: "0.4rem 2px",
          backgroundRepeat: "repeat-x",
          border: "none",
          height: "1px",
        }}
      />
    </div>
  );

  return (
    <div className="text-white col-span-3 xl:col-span-1 coins_background w-full p-3 fixed left-0 bottom-0 block lg:hidden z-[48] rounded-t-lg">
      {isOpened && (
        <div className="overflow-y-scroll">
          <div className="flex items-center text-xl extrabold tracking-widest sm:tracking-wider">
            <AiOutlineShoppingCart className="text-yellow-400" size={28} />
            <p className="px-2">Price Breakdown</p>
          </div>
          {(goldPayload.length > 0 || silverPayload.length > 0) && (
            <div className="mt-3 text-xs sm:text-base">
              {goldPayload.length > 0 && (
                <>
                  {renderPriceBreakdownItemCart({
                    imageUrl: "/coin1.png",
                    label: "Total Gold Coins",
                    value: totalGoldCoins,
                  })}
                  {renderPriceBreakdownItemCart({
                    label: "Total Gold Weight",
                    value: `${totalGoldWeight} gm`,
                  })}
                  {isGoldVault &&
                    renderPriceBreakdownItemCart({
                      label: "Gold Vault Used",
                      value: `${goldVaultWeightUsed} gm`,
                    })}
                  {isGoldVault &&
                    renderPriceBreakdownItemCart({
                      label: "Total Purchasing Gold Weight",
                      value: `${purchasedGoldWeight} gm`,
                    })}
                  {renderPriceBreakdownItemCart({
                    label: "Total Gold Coin Price (Incl. 3% GST)",
                    value: `₹ ${amountWithTaxGold.toLocaleString("en-IN")}`,
                  })}
                </>
              )}
              <div className="mt-3">
                {silverPayload.length > 0 && (
                  <>
                    {renderPriceBreakdownItemCart({
                      imageUrl: "/Rectangle.png",
                      label: "Total Silver Coins",
                      value: totalSilverCoins,
                    })}
                    {renderPriceBreakdownItemCart({
                      label: "Total Silver Weight",
                      value: `${totalSilverWeight} gm`,
                    })}
                    {isSilverVault &&
                      renderPriceBreakdownItemCart({
                        label: "Silver Vault Used",
                        value: `${silverVaultWeightUsed} gm`,
                      })}
                    {isSilverVault &&
                      renderPriceBreakdownItemCart({
                        label: "Total Purchasing Silver Weight",
                        value: `${purchasedSilverWeight} gm`,
                      })}
                    {renderPriceBreakdownItemCart({
                      label: "Total Silver Coin Price (Incl. 3% GST)",
                      value: `₹ ${amountWithTaxSilver.toLocaleString("en-IN")}`,
                    })}
                    {renderPriceBreakdownItemCart({
                      label: "Total Making Charges (Incl. 18% GST)",
                      value: `₹ ${totalMakingCharges.toLocaleString("en-IN")}`,
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="my-5">
        <ProgressBar
          fromCart={true}
          metalTypeForProgressBar={"both"}
          displayMetalType={"both"}
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-100 text-xl sm:text-2xl extrabold tracking-wide">
            ₹ {finalAmount.toLocaleString("en-IN")}
            <span className="text-gray-400 text-sm ml-1 font-thin tracking-tighter">
              Incl. (GST)
            </span>
          </p>
          <p
            onClick={toggleViewBreakUp}
            className="underline cursor-pointer text-gold01 text-base flex items-center gap-2"
          >
            View Breakup <FaChevronCircleDown className="h-4" />
          </p>
        </div>
        <div>
          <CustomButton
            btnType="button"
            title="PROCEED"
            loading={loading}
            containerStyles="inline-flex w-full justify-center rounded-xl bg-themeBlue px-5 py-3 text-base extrabold text-black ring-1 ring-inset sm:mt-0 sm:w-auto"
            handleClick={checkoutCart}
          />
        </div>
      </div>
    </div>
  );
};

export default CartFooter;
