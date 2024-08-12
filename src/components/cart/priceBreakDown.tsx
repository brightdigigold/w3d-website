import { AiOutlineShoppingCart } from "react-icons/ai";
import CustomButton from "../customButton";
import ProgressBar from "../progressBar";

const PriceBreakdown = ({ goldPayload, silverPayload, totalGoldCoins, totalSilverCoins, totalGoldWeight, totalSilverWeight, amountWithTaxGold, amountWithTaxSilver, totalMakingCharges, finalAmount, isGoldVault, goldVaultWeightUsed, purchasedGoldWeight, isSilverVault, silverVaultWeightUsed, purchasedSilverWeight, loading, checkoutCart }) => (
    <div className="text-white col-span-3 xl:col-span-1 bg-themeLight p-3 h-fit rounded-xl hidden lg:block">
        <div className="flex items-center text-xl extrabold tracking-widest sm:tracking-wider">
            <AiOutlineShoppingCart className="text-yellow-400" size={28} />
            <p className="pl-3 ">Price Breakdown</p>
        </div>
        {(goldPayload.length > 0 || silverPayload.length > 0) && (
            <div className="mt-3 text-xs sm:text-sm">
                <PriceBreakdownItemList
                    payload={goldPayload}
                    coins={totalGoldCoins}
                    weight={totalGoldWeight}
                    amountWithTax={amountWithTaxGold}
                    vaultUsed={goldVaultWeightUsed}
                    purchasedWeight={purchasedGoldWeight}
                    isVault={isGoldVault}
                    metalType="GOLD"
                />
                <PriceBreakdownItemList
                    payload={silverPayload}
                    coins={totalSilverCoins}
                    weight={totalSilverWeight}
                    amountWithTax={amountWithTaxSilver}
                    vaultUsed={silverVaultWeightUsed}
                    purchasedWeight={purchasedSilverWeight}
                    isVault={isSilverVault}
                    metalType="SILVER"
                />
                <PriceBreakdownItem label='Total Making Charges (Incl. 18% GST)' value={"₹ " + totalMakingCharges} />
            </div>
        )}
        <div className="my-8">
            <ProgressBar fromCart={true} metalTypeForProgressBar={"both"} displayMetalType={"both"} />
        </div>
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
    </div>
);

const PriceBreakdownItemList = ({ payload, coins, weight, amountWithTax, vaultUsed, purchasedWeight, isVault, metalType }) => (
    <>
        {payload.length > 0 && (
            <>
                <PriceBreakdownItem imageUrl={`/${metalType === 'GOLD' ? 'coin1.png' : 'Rectangle.png'}`} label={`Total ${metalType} Coins`} value={coins} />
                <PriceBreakdownItem label={`Total ${metalType} Weight`} value={`${weight} gms`} />
                {isVault && <PriceBreakdownItem label={`${metalType} Vault Used`} value={`${vaultUsed} gms`} />}
                {isVault && <PriceBreakdownItem label={`Total Purchasing ${metalType} Weight`} value={`${purchasedWeight} gms`} />}
                <PriceBreakdownItem label={`Total ${metalType} Coin Price (Incl. 3% GST)`} value={`₹ ${amountWithTax}`} />
            </>
        )}
    </>
);

const PriceBreakdownItem = ({ label, value, imageUrl }: { label: any; value: any; imageUrl?: string }) => (
    <div className="py-1">
        <div className="justify-between flex items-center">
            <div className="mb-1 flex items-center">
                {imageUrl && <img src={imageUrl} alt={label} className="w-10 h-10 mr-1" />}
                <span className="tracking-wide text-gray-300">{label}</span>
            </div>
            <span className="text-blue-100 tracking-wide bold">{value.toLocaleString("en-IN")}</span>
        </div>
        <hr className="my-0 border-t border-gray-400 mt-1" style={{ backgroundImage: "linear-gradient(to right, #d2d6dc 50%, transparent 50%)", backgroundSize: "0.4rem 2px", backgroundRepeat: "repeat-x", border: "none", height: "1px" }} />
    </div>
);

export default PriceBreakdown