export default (lastFeed = 0, action) => {
  switch (action.type) {
    case "getLastFeed":
      return action.payload;
    default:
      return lastFeed;
  }
};
