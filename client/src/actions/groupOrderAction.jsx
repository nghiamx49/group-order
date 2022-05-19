import { groupOrerConstants } from "../constants";

const {
  CREATE_GROUP_ORDER_SUCCESS,
  GET_THE_GROUP_ORDER_ITEM,
  CLEAR_INFO,
  PRELOAD_CHECK_SUCCESS,
} = groupOrerConstants;

export const getAllGrouItem = (data) => {
  return { type: GET_THE_GROUP_ORDER_ITEM, payload: data };
};

export const createGroupSuccess = (data) => {
  return { type: CREATE_GROUP_ORDER_SUCCESS, payload: data };
};

export const preloadCheck = (data) => {
  return { type: PRELOAD_CHECK_SUCCESS, payload: data };
};

export const clearInfoWhenLogout = () => {
  return { type: CLEAR_INFO };
};
