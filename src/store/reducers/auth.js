import { SET_CURRENT_USER, SET_ERROR } from "../actions/actionTypes";

const initialState = {
  user: null,
  errors: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER:
      return { ...state, user: payload, errors: null };
    case SET_ERROR:
      return { ...state, errors: payload };
    case "CLEAR_ERRORS":
      return { ...state, errors: null };
    default:
      return state;
  }
};
