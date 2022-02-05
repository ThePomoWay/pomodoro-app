
export const initialTransactionState = {
    products: []
}

export const transactionReducer = {
    setProducts: (state, action) => {
        console.log("hello seno, ", action.payload)
        state.products = action.payload;
    }
}