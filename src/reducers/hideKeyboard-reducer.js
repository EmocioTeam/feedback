export default function(state = false, action) {
  switch (action.type) {
    case "hideKeyboard":
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
}
