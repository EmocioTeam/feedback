export default (feedWithLocation = [], action) => {
  switch (action.type) {
    case "feedWithLocation":
      console.log("FEED WITH LOCATION", action.payload);
      return action.payload;
    default:
      return feedWithLocation;
  }
};
