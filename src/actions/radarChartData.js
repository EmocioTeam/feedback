export const getRadarChartData = () => dispatch => {
  //   console.log("SERIES", series);

  dispatch({
    type: "getRadarChartDataByHashtag",
    payload: [1, 1, 1].map(elem => {
      var data = [1, 1, 1, 1, 1];
      return data.map(d => Math.floor(Math.random() * 100));
    })
  });
};
