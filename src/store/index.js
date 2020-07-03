import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { asyncDispatchMiddleware } from "./asyncDispatchMiddleware";

import reducer from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk, asyncDispatchMiddleware))
);

export default store;
