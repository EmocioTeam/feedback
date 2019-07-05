import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
// import { Store } from "./store";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
// const initialState = {
//   auth: localStorage.getItem("auth")
// };

const initialState = {};
const Store = createStore(rootReducer, initialState, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
