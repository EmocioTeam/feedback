export default (feed = [], action) => {
  switch (action.type) {
    case "firstFeedLoad":
      return action.payload;
    // return [...feed, action.payload];
    case "modifiedFeedList":
      // return action.payload;
      return { ...action.payload };
    // const modifiedFeed = [...action.payload];
    // return modifiedFeed;
    case "addedFeedList":
      // feed.docs = [action.payload, ...feed.docs];
      return feed;
      return [action.payload, ...feed];
    case "removedFeedList":
      const removedFeed = [...action.payload];
      return removedFeed;
    case "getMoreFeeds":
      console.log("is it getting here??");
      return [...feed, action.payload];
    default:
      return feed;
  }
};
