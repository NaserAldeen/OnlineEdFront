import { message } from "antd";

const initialState = {
  // items: [],

  // workers: [],

  // selectedBranch: null,
  // branches: [],

  // cart: [],
  // total: 0,

  // orders: [],
  classes: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_CLASSES":
      return { ...state, classes: payload };
    default:
      return state;
  }
};
