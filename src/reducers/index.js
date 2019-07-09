import { combineReducers } from "redux";
import authReducer from "./auth-reducer";
import feedReducer from "./feed-reducer";
import hashtagsReducer from "./hashtags-reducer";
import FeedWithLocationReducer from "./feedWithLocation-reducer";
import lastFeedReducer from "./lastFeed-reducer";

export default combineReducers({
  auth: authReducer,
  feed: feedReducer,
  hashtags: hashtagsReducer,
  feedWithLocation: FeedWithLocationReducer,
  lastFeed: lastFeedReducer
});
