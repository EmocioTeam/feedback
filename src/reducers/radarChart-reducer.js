import data from "../data";

const initialState = {
  series: [
    {
      name: "No data",
      data: [0, 0, 0, 0, 0]
    }
  ]
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "firstFeedLoad":
      const allData = action.payload.docs.map(doc => {
        const docData = doc.data();
        docData.id = doc.id;
        return docData;
      });
      const totalNumberEmocios = action.payload.docs.length;
      const emotionCount = allData.reduce((prev, current, index) => {
        // console.log("TEEEST", prev);
        if (prev[current.mood] !== undefined) {
          prev[current.mood] = prev[current.mood] + 1;
        } else {
          prev[current.mood] = 1;
        }
        return prev;
      }, {});

      const commentsCount = allData.reduce((prev, current, index) => {
        return current.comments ? prev + current.comments.length : prev;
      }, 0);

      const topEmotion = Object.keys(emotionCount).reduce((a, b) =>
        emotionCount[a] > emotionCount[b] ? a : b
      );

      const series = [
        {
          name: "All",
          data: data.map(mood => {
            if (emotionCount[mood.name]) {
              return emotionCount[mood.name];
            } else {
              return 0;
            }
          })
        }
      ];
      return {
        ...state,
        topEmotion,
        totalNumberEmocios,
        commentsCount,
        series: [...series],
        defaultSeries: [...series]
      };
    case "getRadarChartDataByHashtag":
      const newSeries = action.payload.map(doc => {
        return {
          name: doc.id,
          data: data.map(mood => {
            if (doc.moods[mood.name]) {
              return doc.moods[mood.name];
            } else {
              return 0;
            }
          })
        };
      });
      if (action.payload.length === 0) {
        return { ...state, series: [...state.defaultSeries] };
      }
      return { ...state, series: [...newSeries] };
    default:
      return state;
  }
}
