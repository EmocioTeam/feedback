export const getRadarChartData = () => (dispatch, getState) => {
  //   console.log("SERIES", series);

  dispatch({
    type: "getRadarChartDataByHashtag",
    payload: [1, 1, 1].map(elem => {
      var data = [1, 1, 1, 1, 1];
      return data.map(d => Math.floor(Math.random() * 100));
    })
  });
};

export const getRadarChartDataByHashtag = (
  graphData,
  selectedHashtags
) => dispatch => {
  dispatch({
    type: "getRadarChartDataByHashtag",
    payload: graphData
  });
};
