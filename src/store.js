import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

export const Store = (initialState = {}) => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};
