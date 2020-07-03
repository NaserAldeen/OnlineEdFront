import { SET_CURRENT_USER, SET_ERROR } from "../actions/actionTypes";

const initialState = {
  user: null,
  errors: null,
  type: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER:
      return { ...state, user: payload, errors: null };
    case SET_ERROR:
      return { ...state, errors: payload };
    case "CLEAR_ERRORS":
      return { ...state, errors: null };
    case "SET_USER_TYPE":
      return { ...state, type: payload };
    default:
      return state;
  }
};
