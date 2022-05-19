import { themeConstants } from "../constants";

const { SET_COLOR, SET_MODE, GET_THEME } = themeConstants;

export const setMode = (mode) => {
  return {
    type: SET_MODE,
    payload: mode,
  };
};

export const setColor = (color) => {
  return {
    type: SET_COLOR,
    payload: color,
  };
};

export const getTheme = () => {
  return {
    type: GET_THEME,
  };
};
