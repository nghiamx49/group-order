import { groupOrerConstants } from "../constants";

const {
  GET_THE_GROUP_ORDER_ITEM,
  CREATE_GROUP_ORDER_SUCCESS,
  CLEAR_INFO,
  PRELOAD_CHECK_SUCCESS,
} = groupOrerConstants;

const initalState = {
  isOwner: false,
  currentUserId: "",
  groupId: "",
  data: [],
  isOrderLocker: false,
};

const groupOrderReducer = (state = initalState, action) => {
  switch (action.type) {
    case CREATE_GROUP_ORDER_SUCCESS:
      return { ...state, ...action.payload };
    case GET_THE_GROUP_ORDER_ITEM:
      return { ...state, data: action.payload };
    case PRELOAD_CHECK_SUCCESS:
      return { ...state, ...action.payload };
    case CLEAR_INFO:
      return {
        ...state,
        isOwner: false,
        groupId: "",
        currentUserId: "",
        data: [],
        isOrderLocker: false,
      };
    default:
      return state;
  }
};

export default groupOrderReducer;
