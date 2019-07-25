export const getDefaultHashtag = hash => dispatch => {
  dispatch({
    type: "getDefaultHashtag",
    payload: hash
  });
};
