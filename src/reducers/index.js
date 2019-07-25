import { combineReducers } from "redux";
import authReducer from "./auth-reducer";
import feedReducer from "./feed-reducer";
import hashtagsReducer from "./hashtags-reducer";
import FeedWithLocationReducer from "./feedWithLocation-reducer";
import lastFeedReducer from "./lastFeed-reducer";
import feedPageTabReducer from "./feedPageTab-reducer";
import radarChartReducer from "./radarChart-reducer";
import feedCardImageReducer from "./feedCardImage-reducer";
import defaultHashtagReducer from "./defaultHashtag-reducer";

export default combineReducers({
  auth: authReducer,
  feed: feedReducer,
  hashtags: hashtagsReducer,
  feedWithLocation: FeedWithLocationReducer,
  lastFeed: lastFeedReducer,
  feedPageTab: feedPageTabReducer,
  radarChartData: radarChartReducer,
  feedCardImg: feedCardImageReducer,
  defaultHashtag: defaultHashtagReducer
});
