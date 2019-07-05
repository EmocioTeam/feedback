import { combineReducers } from "redux";
import authReducer from "./auth-reducer";
import test from "./test-reducer";
import feedReducer from "./feed-reducer";

export default combineReducers({
  auth: authReducer,
  feed: feedReducer,
  test
});
