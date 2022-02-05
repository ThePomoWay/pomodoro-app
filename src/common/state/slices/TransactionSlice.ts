import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../API/network/AuthService";
import { getAllProductsApi, createCheckoutSessionApi, manageBillingPortalApi } from "../../API/network/TransactionsApis";
import { initialTransactionState, transactionReducer } from "../reducers/TransactionReducer";

export let getAllProducts = createAsyncThunk(
    'products/get',
    async (_, {dispatch}) => {
        let response = await getAllProductsApi();
        console.log(response, response.data.products)
        dispatch(setProducts(response.data.products));
    }
)

export let createCheckoutSession = createAsyncThunk(
    'checkout/create',
    async (e, {dispatch}) => {
        let response = await createCheckoutSessionApi(e);
        if (response.data && response.data.url) {
            window.open(response.data.url)
        }
    }
)

export let manageBillingPortal = createAsyncThunk(
    'portal/create',
    async (e, {dispatch}) => {
        let response = await manageBillingPortalApi();
        if (response.data && response.data.url) {
            window.open(response.data.url)
        }
    }
)

export let transactionSlice = createSlice(
    {
        name: 'transactionSlice',
        initialState: initialTransactionState,
        reducers: transactionReducer
    }
)

export const {setProducts} = transactionSlice.actions;