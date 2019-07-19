export const getFeedPageTab = show => dispatch => {
  if (show === "wall") {
    dispatch({
      type: "showWall",
      payload: show
    });
  } else {
    dispatch({
      type: "showMap",
      payload: show
    });
  }
};
