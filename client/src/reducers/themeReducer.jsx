import { themeConstants } from "../constants";

const { SET_COLOR, SET_MODE } = themeConstants;

const initialState = {
  mode: "light",
  color: "blue",
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };
    case SET_COLOR:
      return {
        ...state,
        color: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducer;
