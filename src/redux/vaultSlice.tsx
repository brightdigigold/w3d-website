import { funcForDecrypt } from '@/components/helperFunctions';
import { Wallet } from '@/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const apiForWallet = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.baseUrl}/user/vault`, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const decryptedData = await funcForDecrypt(data.payload);
    return JSON.parse(decryptedData).data;
  } catch (error) {
    throw error;
  }
};

export const fetchWalletData = createAsyncThunk('vault/fetchWalletData', async (_, { dispatch }) => {
  try {
    dispatch(setLoading(true));
    const walletData: Wallet = await apiForWallet();
    dispatch(setGoldVaultBalance(walletData?.gold));
    dispatch(setGiftedGoldWeight(walletData?.holdGoldGram));
    dispatch(setSilverVaultBalance(walletData?.silver));
    dispatch(setGiftedSilverWeight(walletData?.holdSilverGram));
    dispatch(setLoading(false));
    dispatch(setError(null));
    return walletData;
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError('Error fetching wallet data'));
    throw error;
  }
});

const initialState = {
  goldVaultBalance: 0,
  giftedGoldWeight: 0,
  silverVaultBalance: 0,
  giftedSilverWeight: 0,
  loading: false,
  error: null,
};

const vaultSlice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setGoldVaultBalance: (state, action) => {
      state.goldVaultBalance = action.payload;
    },
    setGiftedGoldWeight: (state, action) => {
      state.giftedGoldWeight = action.payload;
    },
    setSilverVaultBalance: (state, action) => {
      state.silverVaultBalance = action.payload;
    },
    setGiftedSilverWeight: (state, action) => {
      state.giftedSilverWeight = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetVault: (state) => {
      state.goldVaultBalance = 0;
      state.giftedGoldWeight = 0;
      state.silverVaultBalance = 0;
      state.giftedSilverWeight = 0;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setGoldVaultBalance, setGiftedGoldWeight, setSilverVaultBalance, setGiftedSilverWeight, setLoading, setError, resetVault } = vaultSlice.actions;

export const selectGoldVaultBalance = (state: { vault: { goldVaultBalance: any; }; }) => state.vault.goldVaultBalance;
export const selectGiftedGoldWeight = (state: { vault: { giftedGoldWeight: any; }; }) => state.vault.giftedGoldWeight;
export const selectSilverVaultBalance = (state: { vault: { silverVaultBalance: any; }; }) => state.vault.silverVaultBalance;
export const selectGiftedSilverWeight = (state: { vault: { giftedSilverWeight: any; }; }) => state.vault.giftedSilverWeight;
export const selectLoading = (state: { vault: { loading: any; }; }) => state.vault.loading;
export const selectError = (state: { vault: { error: any; }; }) => state.vault.error;

export default vaultSlice.reducer;


