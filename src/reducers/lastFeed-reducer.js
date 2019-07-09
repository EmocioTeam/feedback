export default (lastFeed = {}, action) => {
  switch (action.type) {
    case "getLastFeed":
      return action.payload;
    default:
      return lastFeed;
  }
};
