import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParseFloat } from '@/components/helperFunctions';
import { metalPrice, MetalType, GiftState, TransactionType } from '@/types';

// Define the initial state
const initialState: GiftState = {
    metalType: 'gold',
    transactionType: 'rupees',
    enteredAmount: 0,
    actualAmount: 0,
    metalPrice: 0,
    metalQuantity: 0,
    totalAmount: 0,
};

// Helper function to calculate values based on the state
const recalculateValues = (state: GiftState) => {
    const metalPrice = state.metalPrice;
    let enteredAmount = state.enteredAmount ?? 0
    if (state.transactionType === 'rupees') {
        state.metalQuantity = ParseFloat((enteredAmount / metalPrice), 4);
        state.actualAmount = ParseFloat((enteredAmount), 2);
        state.totalAmount = ParseFloat((enteredAmount), 2);
    } else if (state.transactionType === 'grams') {
        state.actualAmount = ParseFloat(metalPrice * enteredAmount, 2);
        state.metalQuantity = state.enteredAmount;
        state.totalAmount = ParseFloat(state.actualAmount, 2);
    }
}

const giftSlice = createSlice({
    name: 'gift',
    initialState,
    reducers: {
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
    },
});

export const {
    setMetalType,
    setTransactionType,
    setEnteredAmount,
    setMetalPrice,
    updateMetalPrice,
} = giftSlice.actions;

export default giftSlice.reducer;
