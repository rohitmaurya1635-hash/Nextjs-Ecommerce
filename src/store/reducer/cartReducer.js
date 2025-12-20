import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    totalQty: 0,
};

const recalcTotalQty = (products) =>
    products.reduce((sum, item) => sum + item.qty, 0);

export const cartReducer = createSlice({
    name: "cartStore",
    initialState,
    reducers: {
        addIntoCart: (state, action) => {
            const payload = action.payload;

            const index = state.products.findIndex(
                (p) =>
                    p.productId === payload.productId &&
                    p.variantId === payload.variantId
            );

            if (index >= 0) {
                state.products[index].qty += payload.qty ?? 1;
            } else {
                state.products.push({
                    ...payload,
                    qty: payload.qty ?? 1,
                });
            }

            state.totalQty = recalcTotalQty(state.products);
        },

        increaseQuantity: (state, action) => {
            const { productId, variantId } = action.payload;

            const item = state.products.find(
                (p) =>
                    p.productId === productId &&
                    p.variantId === variantId
            );

            if (item) item.qty += 1;

            state.totalQty = recalcTotalQty(state.products);
        },

        decreaseQuantity: (state, action) => {
            const { productId, variantId } = action.payload;

            const item = state.products.find(
                (p) =>
                    p.productId === productId &&
                    p.variantId === variantId
            );

            if (item && item.qty > 1) item.qty -= 1;

            state.totalQty = recalcTotalQty(state.products);
        },

        removeFromCart: (state, action) => {
            const { productId, variantId } = action.payload;

            state.products = state.products.filter(
                (p) =>
                    !(p.productId === productId &&
                        p.variantId === variantId)
            );

            state.totalQty = recalcTotalQty(state.products);
        },

        clearCart: (state) => {
            state.products = [];
            state.totalQty = 0;
        },
    },
});

export const {
    addIntoCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
} = cartReducer.actions;

export default cartReducer.reducer;
