// userSlice.ts
import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';
import { funcForDecrypt } from '@/components/helperFunctions';
import { UserState } from '@/types';

interface FetchUserDetailsResponse {
    userDetails: UserState;
}

// Define the initial state based on your user structure
const initialState: UserState = {

    data: {
        address: { line1: '', line2: '', pincode: null, state: '', city: '' },
        addresses: [],
        bankDetails: { bankName: '', accountName: '', ifsc: '', accountNumber: '', upiId: '' },
        createdAt: '',
        dateOfBirth: '',
        email: '',
        enabled: false,
        gender: '',
        gst_number: '',
        isAadhaarUploaded: false,
        isAddressCompleted: false,
        isBankDetailsCompleted: false,
        isBasicDetailsCompleted: false,
        isEmailVerified: false,
        isKycDone: false,
        isMobileVerified: false,
        isPanUploaded: false,
        isUpiVerified: false,
        kyc: { panNumber: '', aadhaarNumber: '' },
        fromApp: false,
        isNewUser: false,
        legalName: '',
        tradeName: '',
        mobile_number: '',
        name: '',
        // profile_image: '',
        referralCode: '',
        referredBy: null,
        type: '',
        updatedAt: '',
        userId: '',
        user_vaults: {
            _id: '',
            user_id: '',
            gold: 0,
            silver: 0,
            totalAmount: 0,
            createdAt: "",
            updatedAt: '',
        },
        verificationToken: '',
        walletAmount: 0,
        __v: 0,
        _id: '',
    }
};

// Create a user slice
// Async thunk action to fetch user details
export const fetchUserDetails = createAsyncThunk(
    'user/fetchUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const configHeaders = { headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
            const response = await fetch(`${process.env.baseUrl}/auth/validate/token`, configHeaders);

            if (!response.ok) {
                throw new Error(`Failed to fetch user details. Status: ${response.status}`);
            }

            const data = await response.json();
            const decryptedData = await funcForDecrypt(data.payload);
            const userDetails: UserState = JSON.parse(decryptedData);

            const finalUserDetails = userDetails;

            return { userDetails: finalUserDetails } as FetchUserDetailsResponse;
        } catch (error: any) {
            console.error('Error fetching user details:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const resetUserDetails = createAction('user/resetUserDetails');

const userDetailsSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
        },
        resetUserDetails: (state) => {
            return { ...initialState };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
            return { ...state, ...action.payload.userDetails };
        });
    },
});

export const { setUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
export const selectUser = (state: RootState) => state.user;



