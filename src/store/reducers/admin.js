import { message } from "antd";

const initialState = {
  items: [],

  workers: [],

  selectedBranch: null,
  branches: [],

  cart: [],
  total: 0,

  orders: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_ITEMS":
      return { ...state, items: payload };

    case "SET_WORKERS":
      return { ...state, workers: payload };

    case "SET_BRANCHES":
      return { ...state, branches: payload };

    case "SAVE_BRANCH":
      return { ...state, selectedBranch: payload };

    case "ADD_TO_CART":
      let newCart = state.cart;
      let newItem = payload;
      let index = newCart.findIndex((item) => item.id == payload.id);
      let newTotal = state.total;

      if (index >= 0) {
        if (newItem.limit == newCart[index].quantity) {
          message.error("You have reached your limit. You can't add more");
        } else {
          newCart[index].quantity += 1;
          newTotal += newCart[index].price;
          message.success("Added successfully");
        }
      } else {
        newItem["quantity"] = 1;
        newTotal += newItem.price;
        newCart = [...newCart, payload];
        message.success("Added successfully");
      }
      return { ...state, cart: newCart, total: newTotal };

    case "CLEAR_CART":
      return { ...state, cart: [], total: 0 };

    case "SET_ORDERS":
      return { ...state, orders: payload };
    default:
      return state;
  }
};
