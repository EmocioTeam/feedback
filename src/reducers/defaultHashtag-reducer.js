export default function getDefaultHashtag(state = "", action) {
  switch (action.type) {
    case "getDefaultHashtag":
      console.log("EEEO", action.payload);
      return action.payload;
    default:
      return state;
  }
}
