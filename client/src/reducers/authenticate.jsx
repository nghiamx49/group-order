import { authenticateContants } from "../constants/index";
const { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT } = authenticateContants;

const initialState = {
  account: {
    image: "",
    role: "",
    username: "",
    fullname: "",
  },
  isAuthenticated: false,
};

const authenticateReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { payload } = action;
      return { ...state, ...payload };
    case LOGIN_FAILED:
      const { error } = action;
      return { ...state, ...error };
    case LOGOUT:
      return {
        account: {
          image: "",
          role: "",
          username: "",
          fullname: "",
        },
        token: "",
        isAuthenticated: false,
        message: "",
      };
    default:
      return state;
  }
};

export default authenticateReducer;
