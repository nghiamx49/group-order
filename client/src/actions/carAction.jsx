import { productContants, cartContants } from "../constants/index";

const { ADD_PRODUCT_TO_CART_SUCCESS } = productContants;
const {
  GET_ALL_PRODUCTS_IN_CART_SUCCESS,
  REMOVE_PRODUCT_FROM_CART_SUCCESS,
  INCREASE_QUANTITY_SUCCESS,
  DECREASE_QUANTITY_SUCCESS,
} = cartContants;

export const addToCart = (data) => {
  return { type: ADD_PRODUCT_TO_CART_SUCCESS, payload: data };
};

export const loadCart = (data) => {
  return { type: GET_ALL_PRODUCTS_IN_CART_SUCCESS, payload: data };
};

export const deleteFromCart = (data) => {
  return { type: REMOVE_PRODUCT_FROM_CART_SUCCESS, payload: data };
};

export const increaseCartItem = (data) => {
  return { type: INCREASE_QUANTITY_SUCCESS, payload: data };
};

export const decreaseCarItem = (data) => {
  return { type: DECREASE_QUANTITY_SUCCESS, payload: data };
};
