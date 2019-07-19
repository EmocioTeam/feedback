export default function(state = {}, action) {
  state.series = [
    {
      name: "Series 1",
      data: [80, 50, 30, 40, 100]
    },
    {
      name: "Series 2",
      data: [20, 30, 40, 80, 20]
    },
    {
      name: "Series 3",
      data: [44, 76, 78, 13, 43]
    }
  ];

  switch (action.type) {
    case "getRadarChartData":
      console.log("all data snapshot", action.payload);
      return state;
    case "getRadarChartDataByHashtag":
      return [
        {
          name: "series 1",
          data: action.payload[0]
        },
        {
          name: "series 2",
          data: action.payload[1]
        },
        {
          name: "series 3",
          data: action.payload[2]
        }
      ];
    default:
      return state;
  }
}
