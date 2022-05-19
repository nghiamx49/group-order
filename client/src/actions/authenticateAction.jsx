import { authenticateContants } from "../constants";

const { LOGIN, LOGIN_SUCCESS, LOGOUT } = authenticateContants;

export const login = (loginForm) => {
  return { type: LOGIN, payload: loginForm };
};

export const loginSuccess = (data) => {
  return { type: LOGIN_SUCCESS, payload: data };
};

export const logout = () => {
  return { type: LOGOUT };
};

export const updateSidebarRequest = (data) => {
  return {
    type: authenticateContants.UPDATE_SIDEBAR,
    payload: data,
  };
};
