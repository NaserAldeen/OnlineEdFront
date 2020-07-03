const initialState = {
  items: [],

  workers: [],

  selectedBranch: null,
  branches: [],
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
    default:
      return state;
  }
};
