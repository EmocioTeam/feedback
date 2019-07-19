export default function showFeed(state = "wall", action) {
  switch (action.type) {
    case "showWall":
      return action.payload;
    case "showMap":
      return action.payload;
    default:
      return state;
  }
}
