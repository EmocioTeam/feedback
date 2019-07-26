export const hideKeyboard = state => dispatch => {
  dispatch({
    type: "hideKeyboard",
    payload: state
  });
};
