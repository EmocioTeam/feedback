export default (feed = [], action) => {
  switch (action.type) {
    case "firstFeedLoad":
      return [...feed, action.payload];
    case "modifiedFeedList":
      const modifiedFeed = [...action.payload];
      return modifiedFeed;
    case "addedFeedList":
      return [action.payload, ...feed];
    case "removedFeedList":
      const removedFeed = [...action.payload];
      return removedFeed;
    default:
      return feed;
  }
};
