import { productContants, cartContants } from "../constants/index";

const { ADD_PRODUCT_TO_CART_SUCCESS } = productContants;
const {
  GET_ALL_PRODUCTS_IN_CART_SUCCESS,
  REMOVE_PRODUCT_FROM_CART_SUCCESS,
  INCREASE_QUANTITY_SUCCESS,
  DECREASE_QUANTITY_SUCCESS,
} = cartContants;

const initialState = [];

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT_TO_CART_SUCCESS:
      const clone = [...state];
      const filterItem = clone.filter(
        (item) => item.itemName === action.payload.itemName
      );
      const findItemIndex = clone.indexOf(filterItem[0]);
      if (findItemIndex > -1) {
        clone[findItemIndex].orderQuantity += action.payload.orderQuantity;
        clone[findItemIndex].orderPrice += action.payload.orderPrice;
        return [...clone];
      } else {
        return [...state, action.payload];
      }
    case INCREASE_QUANTITY_SUCCESS:
      const arrayClone = [...state];
      const filterIncreaseItem = arrayClone.filter(
        (item) => item._id === action.payload._id
      );
      const icreaseItemIndex = arrayClone.indexOf(filterIncreaseItem[0]);
      let itemPrice =
        arrayClone[icreaseItemIndex].orderPrice /
        arrayClone[icreaseItemIndex].orderQuantity;
      arrayClone[icreaseItemIndex].orderQuantity += 1;
      arrayClone[icreaseItemIndex].orderPrice += itemPrice;
      return [...arrayClone];
    case DECREASE_QUANTITY_SUCCESS:
      const decreaseClone = [...state];
      const filterDecrease = decreaseClone.filter(
        (item) => item._id === action.payload._id
      );
      const decreaseItemIndex = decreaseClone.indexOf(filterDecrease[0]);
      let countItemPrice =
        decreaseClone[decreaseItemIndex].orderPrice /
        decreaseClone[decreaseItemIndex].orderQuantity;
      decreaseClone[decreaseItemIndex].orderQuantity -= 1;
      decreaseClone[decreaseItemIndex].orderPrice -= countItemPrice;
      return [...decreaseClone];
    case GET_ALL_PRODUCTS_IN_CART_SUCCESS:
      return [...action.payload];
    case REMOVE_PRODUCT_FROM_CART_SUCCESS:
      const arr = [...state];
      const findItem = arr.filter((item) => item._id === action.payload._id);
      const itemIndex = arr.indexOf(findItem[0]);
      if (itemIndex > -1) {
        arr.splice(itemIndex, 1);
        return [...arr];
      } else {
        return [...state, action.payload];
      }
    default:
      return state;
  }
};

export default cartReducer;
