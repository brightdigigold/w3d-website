import { ParseFloat } from '@/components/helperFunctions';
import { CartProduct, CartState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CartState = {
    products: [],
    totalGoldWeight: 0,
    totalSilverWeight: 0,
    totalMakingCharges: 0,
    totalMakingWithoutTax: 0,
    amountWithTaxGold: 0,
    amountWithoutTaxGold: 0,
    amountWithTaxSilver: 0,
    amountWithoutTaxSilver: 0,
    useVaultBalanceGold: false,
    useVaultBalanceSilver: false,
    goldVaultBalance: 0,
    silverVaultBalance: 0,
    purchasedGoldWeight: 0,
    purchasedSilverWeight: 0,
    goldGstForCart: 0,
    silverGstForCart: 0,
    liveGoldPrice: 0,
    liveSilverPrice: 0,
    finalAmount: 0,
    totalMakingChargesGold: 0,
    totalMakingChargesSilver: 0,
    totalGoldCoins: 0,
    totalSilverCoins: 0,
    goldVaultWeightUsed: 0,
    silverVaultWeightUsed: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        calculatePurchasedGoldWeight: (state) => {
            console.log('logged globally')
            if (state.useVaultBalanceGold) {
                // Check if the vault balance is greater than total gold weight
                if (state.goldVaultBalance >= state.totalGoldWeight) {
                    console.log('state.goldVaultBalance >= state.totalGoldWeight')
                    state.purchasedGoldWeight = 0; // User doesn't need to purchase additional gold
                    state.goldGstForCart = 0;
                    state.amountWithoutTaxGold = 0;
                    state.amountWithTaxGold = 0;
                    state.goldVaultWeightUsed = state.totalGoldWeight
                } else {
                    // User needs to purchase the difference
                    console.log('state.totalGoldWeight', state.totalGoldWeight)
                    state.purchasedGoldWeight = Math.abs(ParseFloat(state.totalGoldWeight - state.goldVaultBalance, 4));
                    state.goldGstForCart = ParseFloat(state.liveGoldPrice * state.purchasedGoldWeight * 0.03, 2);
                    state.amountWithoutTaxGold = ParseFloat(state.liveGoldPrice * state.purchasedGoldWeight, 4);
                    state.amountWithTaxGold = ParseFloat((state.amountWithoutTaxGold + state.goldGstForCart), 2);
                    state.goldVaultWeightUsed = state.goldVaultBalance
                }
            }
            if (!state.useVaultBalanceGold) {
                // Handle the case where vault balance is not used
                state.purchasedGoldWeight = state.totalGoldWeight;
                state.goldGstForCart = ParseFloat(state.totalGoldWeight * 0.03 * state.liveGoldPrice, 2);
                state.amountWithoutTaxGold = ParseFloat(state.liveGoldPrice * state.totalGoldWeight, 4);
                state.amountWithTaxGold = ParseFloat((state.amountWithoutTaxGold + state.goldGstForCart), 2);

            }
        },

        calculatePurchasedSilverWeight: (state) => {

            if (state.useVaultBalanceSilver) {
                // Check if the vault balance is greater than total silver weight
                if (state.silverVaultBalance > state.totalSilverWeight) {
                    state.purchasedSilverWeight = 0; // User doesn't need to purchase additional silver
                    state.silverGstForCart = 0;
                    state.amountWithoutTaxSilver = 0;
                    state.amountWithTaxSilver = 0;
                    state.silverVaultWeightUsed = state.totalSilverWeight
                } else {
                    // User needs to purchase the difference
                    state.purchasedSilverWeight = Math.abs(ParseFloat(state.silverVaultBalance - state.totalSilverWeight, 4));
                    state.silverGstForCart = ParseFloat((state.liveSilverPrice * state.purchasedSilverWeight) * 0.03, 2);
                    state.amountWithoutTaxSilver = ParseFloat(state.liveSilverPrice * state.purchasedSilverWeight, 4);
                    state.amountWithTaxSilver = ParseFloat((state.amountWithoutTaxSilver + state.silverGstForCart), 2);
                    state.silverVaultWeightUsed = state.silverVaultBalance
                }
            }
            if (!state.useVaultBalanceSilver) {
                // Handle the case where vault balance is not used
                state.purchasedSilverWeight = state.totalSilverWeight;
                state.silverGstForCart = ParseFloat(state.liveSilverPrice * state.totalSilverWeight * 0.03, 2);
                state.amountWithoutTaxSilver = ParseFloat(state.liveSilverPrice * state.totalSilverWeight, 4);
                state.amountWithTaxSilver = ParseFloat((state.amountWithoutTaxSilver + state.silverGstForCart), 2);
            }
        },



        calculateFinalAmount: (state) => {
            state.finalAmount = ParseFloat(state.amountWithTaxGold + state.amountWithTaxSilver + state.totalMakingCharges, 2);
        },

        setCartProducts: (state, action: PayloadAction<CartProduct[]>) => {
            state.products = action.payload;
        },
        setTotalGoldWeight: (state, action: PayloadAction<number>) => {
            state.totalGoldWeight = action.payload;
        },
        setTotalSilverWeight: (state, action: PayloadAction<number>) => {
            state.totalSilverWeight = action.payload;
        },
        setTotalMakingCharges: (state, action: PayloadAction<number>) => {
            state.totalMakingCharges = action.payload;
        },
        setTotalMakingWithoutTax: (state, action: PayloadAction<number>) => {
            state.totalMakingWithoutTax = action.payload;
        },
        setAmountWithTaxGold: (state, action: PayloadAction<number>) => {
            state.amountWithTaxGold = action.payload;
        },
        setAmountWithoutTaxGold: (state, action: PayloadAction<number>) => {
            state.amountWithoutTaxGold = action.payload;
        },
        setAmountWithTaxSilver: (state, action: PayloadAction<number>) => {
            state.amountWithTaxSilver = action.payload;
        },
        setAmountWithoutTaxSilver: (state, action: PayloadAction<number>) => {
            state.amountWithoutTaxSilver = action.payload;
        },
        setLiveGoldPrice: (state, action: PayloadAction<number>) => {
            state.liveGoldPrice = action.payload;
        },
        setTotalMakingChargesGold: (state, action: PayloadAction<number>) => {
            state.totalMakingChargesGold = action.payload;
        },
        setTotalMakingChargesSilver: (state, action: PayloadAction<number>) => {
            state.totalMakingChargesSilver = action.payload;
        },
        setUseVaultBalanceGold: (state, action: PayloadAction<boolean>) => {
            state.useVaultBalanceGold = action.payload;
        },
        setUseVaultBalanceSilver: (state, action: PayloadAction<boolean>) => {
            state.useVaultBalanceSilver = action.payload;
        },
        setGoldVaultBalance: (state, action: PayloadAction<number>) => {
            state.goldVaultBalance = action.payload;
        },
        setSilverVaultBalance: (state, action: PayloadAction<number>) => {
            state.silverVaultBalance = action.payload;
        },
        setLiveSilverPrice: (state, action: PayloadAction<number>) => {
            state.liveSilverPrice = action.payload;
        },
        setFinalAmount: (state, action: PayloadAction<number>) => {
            state.finalAmount = action.payload;
        },
        setTotalGoldCoins: (state, action: PayloadAction<number>) => {
            state.totalGoldCoins = action.payload;
        },
        setTotalSilverCoins: (state, action: PayloadAction<number>) => {
            state.totalSilverCoins = action.payload;
        },
    },
});

export const {
    setCartProducts,
    setTotalGoldWeight,
    setTotalSilverWeight,
    setTotalMakingCharges,
    setTotalMakingWithoutTax,
    setAmountWithTaxGold,
    setAmountWithoutTaxGold,
    setAmountWithTaxSilver,
    setAmountWithoutTaxSilver,
    setUseVaultBalanceGold,
    setUseVaultBalanceSilver,
    setGoldVaultBalance,
    setSilverVaultBalance,
    calculatePurchasedGoldWeight,
    calculatePurchasedSilverWeight,
    setLiveGoldPrice,
    setLiveSilverPrice,
    setFinalAmount,
    calculateFinalAmount,
    setTotalMakingChargesGold,
    setTotalMakingChargesSilver,
    setTotalGoldCoins,
    setTotalSilverCoins,
} = cartSlice.actions;

export default cartSlice.reducer;
