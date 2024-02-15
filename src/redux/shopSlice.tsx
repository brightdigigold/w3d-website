import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParseFloat } from '@/components/helperFunctions';
import { metalPrice, MetalType, PurchaseType, ShopState, TransactionType } from '@/types';
import { RootState } from './store';

// Define the initial state
const initialState: ShopState = {
    purchaseType: 'buy',
    metalType: 'gold',
    transactionType: 'rupees',
    enteredAmount: 0,
    actualAmount: 0,
    gst: 0,
    metalPrice: 0,
    metalQuantity: 0,
    totalAmount: 0,
    transactionFrom: ''
};

// Helper function to calculate values based on the state
const recalculateValues = (state: ShopState) => {
    const metalPrice = state.metalPrice;
    // Calculate actual amount and GST based on conditions
    let enteredAmount = state.enteredAmount ?? 0
    if (state.purchaseType === 'buy') {
        if (state.transactionType === 'rupees') {
            state.actualAmount = ParseFloat(((enteredAmount / 103) * 100), 2);
            state.gst = (+(enteredAmount - state.actualAmount).toFixed(2));
            state.metalQuantity = (state.actualAmount / metalPrice);
            state.totalAmount = ParseFloat((state.actualAmount + state.gst), 2);
        } else if (state.transactionType === 'grams') {
            state.gst = ParseFloat((0.03 * enteredAmount * metalPrice), 2);
            state.actualAmount = ParseFloat(metalPrice * enteredAmount, 2);
            state.totalAmount = Math.round((state.actualAmount + state.gst));
            state.metalQuantity = state.enteredAmount;
        }
    } else {
        if (state.transactionType === 'rupees') {
            state.metalQuantity = (enteredAmount / metalPrice);
            state.actualAmount = state.enteredAmount;
            state.totalAmount = state.enteredAmount;
            state.gst = 0;
        } else if (state.transactionType === 'grams') {
            state.gst = 0;
            state.actualAmount = ParseFloat((metalPrice * enteredAmount), 2);
            state.metalQuantity = enteredAmount
            state.totalAmount = Math.round(enteredAmount * metalPrice);
        }
    }
};

const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        setPurchaseType: (state, action: PayloadAction<PurchaseType>) => {
            state.purchaseType = action.payload;
            recalculateValues(state);
        },
        setMetalType: (state, action: PayloadAction<MetalType>) => {
            state.metalType = action.payload;
            recalculateValues(state);
        },
        setMetalPrice: (state, action: PayloadAction<metalPrice>) => {
            state.metalPrice = action.payload;
            recalculateValues(state);
        },
        setTransactionType: (state, action: PayloadAction<TransactionType>) => {
            state.transactionType = action.payload;
            recalculateValues(state);
        },
        updateMetalPrice: (state, action: PayloadAction<metalPrice>) => {
            state.metalPrice = action.payload;
            recalculateValues(state);
        },
        setEnteredAmount: (state, action: PayloadAction<number>) => {
            state.enteredAmount = action.payload;
            recalculateValues(state);
        },
        setTransactionFrom: (state, action: PayloadAction<string>) => {
            state.transactionFrom = action.payload;
        },
    },
});

export const {
    setPurchaseType,
    setMetalType,
    setTransactionType,
    setEnteredAmount,
    setMetalPrice,
    updateMetalPrice,
    setTransactionFrom,
} = shopSlice.actions;

export const SelectGst = ((state: RootState) => state.shop.gst);
export const SelectMetalType = ((state: RootState) => state.shop.metalType);
export const SelectTransactionType = ((state: RootState) => state.shop.transactionType);
export const SelectPurchaseType = ((state: RootState) => state.shop.purchaseType);
export const SelectEnteredAmount = ((state: RootState) => state.shop.enteredAmount);
export const SelectActualAmount = ((state: RootState) => state.shop.actualAmount);
export const SelectTotalAmount = ((state: RootState) => state.shop.totalAmount);
export const SelectMetalQuantity = ((state: RootState) => state.shop.metalQuantity);
export const selectMetalPricePerGram = ((state: RootState) => state.shop.metalPrice);

export default shopSlice.reducer;
