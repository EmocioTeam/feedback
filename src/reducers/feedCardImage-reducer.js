export default function(state = {}, action) {
  switch (action.type) {
    case "fetchImg":
      console.log("EOOOO", action.payload);
      return { ...state, [action.payload["uuid"]]: action.payload["url"] };
    default:
      return state;
  }
}
