import { configureStore } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";


export const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        isProfileFilled : false,
        showLoginAside : false
    },
    reducers: {
        logInUser : (state,action) => {
            state.isAuthenticated = action.payload;
        },
        logOutUser : (state, action) => {
            state.isAuthenticated = action.payload;
        },
        profileFilled : (state, action) => {
            state.isProfileFilled = action.payload;
        },
        doShowLoginAside : (state, action) => {
            state.showLoginAside = action.payload;
        },
    }
})

const store = configureStore({
    reducer : {
        auth : AuthSlice.reducer
    }
})

export default store

export const {logInUser,logOutUser,profileFilled,doShowLoginAside} = AuthSlice.actions

