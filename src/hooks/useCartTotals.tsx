import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setTotalGoldWeight,
  setTotalSilverWeight,
  setAmountWithTaxGold,
  setAmountWithTaxSilver,
  setTotalMakingCharges,
  setTotalMakingWithoutTax,
  setGoldVaultBalance,
  setSilverVaultBalance,
  setAmountWithoutTaxGold,
  setAmountWithoutTaxSilver,
  calculateFinalAmount,
  setTotalGoldCoins,
  setTotalSilverCoins,
  setTotalMakingChargesGold,
  setTotalMakingChargesSilver,
} from "@/redux/cartSlice";
import { ParseFloat } from "@/components/helperFunctions";

export const useCartTotals = () => {
  const dispatch = useDispatch();
  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const liveGoldPrice = useSelector((state: RootState) => state.cart.liveGoldPrice);
  const liveSilverPrice = useSelector((state: RootState) => state.cart.liveSilverPrice);
  const goldVaultBalance = useSelector((state: RootState) => state.cart.goldVaultBalance);
  const silverVaultBalance = useSelector((state: RootState) => state.cart.silverVaultBalance);

  useMemo(() => {
    let totalGoldWeight = 0;
    let totalSilverWeight = 0;
    let totalGoldMakingCharges = 0;
    let totalSilverMakingCharges = 0;
    let totalMakingCharges = 0;
    let totalMakingWithoutTax = 0;
    let silverGstForCart = 0;
    let amountWithTaxSilver = 0;
    let amountWithoutTaxSilver = 0;
    let goldGstForCart = 0;
    let amountWithTaxGold = 0;
    let amountWithoutTaxGold = 0;
    let totalGoldCoins = 0;
    let totalSilverCoins = 0;
    let totalGstForMakingCharges = 0;

    cartProducts.forEach((item) => {
      const itemWeight = item?.product?.count * item?.product?.weight;
      const itemMakingCharges = +item?.product?.makingcharges;

      if (item?.product?.iteamtype === "GOLD") {
        totalGoldWeight += itemWeight;
        totalGoldMakingCharges += itemMakingCharges;
        totalGoldCoins += item?.product?.count;
      } else if (item?.product?.iteamtype === "SILVER") {
        totalSilverWeight += itemWeight;
        totalSilverMakingCharges += itemMakingCharges;
        totalSilverCoins += item?.product?.count;
      }

      totalMakingCharges += itemMakingCharges * item?.product?.count;
    });

    totalGstForMakingCharges = ParseFloat((totalMakingCharges * 0.18), 2);
    totalMakingWithoutTax = ParseFloat(totalMakingCharges - totalGstForMakingCharges, 2);
    amountWithoutTaxSilver = ParseFloat(liveSilverPrice * totalSilverWeight, 2);
    silverGstForCart = ParseFloat(totalSilverWeight * liveSilverPrice * 0.03, 2);
    amountWithTaxSilver = ParseFloat(totalSilverWeight * liveSilverPrice + silverGstForCart, 2);
    amountWithoutTaxGold = ParseFloat(liveGoldPrice * totalGoldWeight, 2);
    goldGstForCart = ParseFloat(totalGoldWeight * liveGoldPrice * 0.03, 2);
    amountWithTaxGold = ParseFloat(totalGoldWeight * liveGoldPrice + goldGstForCart, 2);

    // Dispatch actions to update the state in the Redux store
    dispatch(setTotalGoldWeight(totalGoldWeight));
    dispatch(setTotalSilverWeight(totalSilverWeight));
    dispatch(setTotalMakingChargesGold(totalGoldMakingCharges));
    dispatch(setTotalMakingChargesSilver(totalSilverMakingCharges));
    dispatch(setTotalMakingCharges(totalMakingCharges));
    dispatch(setTotalMakingWithoutTax(totalMakingWithoutTax));
    dispatch(setGoldVaultBalance(goldVaultBalance));
    dispatch(setSilverVaultBalance(silverVaultBalance));
    dispatch(setAmountWithTaxSilver(amountWithTaxSilver));
    dispatch(setAmountWithoutTaxSilver(amountWithoutTaxSilver));
    dispatch(setAmountWithTaxGold(amountWithTaxGold));
    dispatch(setAmountWithoutTaxGold(amountWithoutTaxGold));
    dispatch(setTotalGoldCoins(totalGoldCoins));
    dispatch(setTotalSilverCoins(totalSilverCoins));
    dispatch(calculateFinalAmount());
  }, [cartProducts, liveGoldPrice, liveSilverPrice, goldVaultBalance, silverVaultBalance, dispatch]);

  return {}; // If you need to return any values, you can do so here
};
