import data from "../data";
import _ from "lodash";

const initialState = {
  series: [
    {
      name: "No data",
      data: [0, 0, 0, 0, 0]
    }
  ],
  // Defaults used when filters produce empty datasets or before firstFeedLoad runs
  topEmotion: "-",
  totalNumberEmocios: 0,
  commentsCount: 0,
  defaultTopEmotion: "-",
  defaultTotalNumberEmocios: 0,
  defaultCommentsCount: 0,
  defaultSeries: [
    {
      name: "All",
      data: [0, 0, 0, 0, 0]
    }
  ]
};

function getAllData(payload) {
  return payload.docs.map(doc => {
    const docData = doc.data();
    docData.id = doc.id;
    return docData;
  });
}

function getTotalNumberEmocios(payload) {
  return payload.docs.length;
}

function getEmotionCount(data) {
  return data.reduce((prev, current, index) => {
    // console.log("TEEEST", prev);
    if (prev[current.mood] !== undefined) {
      prev[current.mood] = prev[current.mood] + 1;
    } else {
      prev[current.mood] = 1;
    }
    return prev;
  }, {});
}

function getTopEmotion(emotionCount) {
  const keys = Object.keys(emotionCount || {});
  if (keys.length === 0) {
    return "-";
  }
  return keys.reduce((a, b) => (emotionCount[a] > emotionCount[b] ? a : b));
}

function getCommentsCount(data) {
  return data.reduce((prev, current, index) => {
    return current.comments ? prev + current.comments.length : prev;
  }, 0);
}

function getRadarChartSeries(emotionCount) {
  return [
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
}

function getRadarChartSeries2(graphData) {
  return graphData.map(doc => {
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
}

export default function(state = initialState, action) {
  switch (action.type) {
    case "firstFeedLoad":
      const allData = getAllData(action.payload);
      const totalNumberEmocios = getTotalNumberEmocios(action.payload);
      const commentsCount = getCommentsCount(allData);
      const emotionCount = getEmotionCount(allData);
      const topEmotion = getTopEmotion(emotionCount);
      const series = getRadarChartSeries(emotionCount);
      return {
        ...state,
        topEmotion,
        totalNumberEmocios,
        commentsCount,
        series: [...series],
        defaultTopEmotion: topEmotion,
        defaultTotalNumberEmocios: totalNumberEmocios,
        defaultCommentsCount: commentsCount,
        defaultSeries: [...series]
      };
    case "getRadarChartDataByHashtag":
      if (action.payload.graphData.length === 0) {
        return {
          ...state,
          topEmotion: state.defaultTopEmotion !== undefined ? state.defaultTopEmotion : (state.topEmotion !== undefined ? state.topEmotion : "-"),
          totalNumberEmocios: state.defaultTotalNumberEmocios !== undefined ? state.defaultTotalNumberEmocios : (state.totalNumberEmocios !== undefined ? state.totalNumberEmocios : 0),
          commentsCount: state.defaultCommentsCount !== undefined ? state.defaultCommentsCount : (state.commentsCount !== undefined ? state.commentsCount : 0),
          series: [...(state.defaultSeries !== undefined ? state.defaultSeries : state.series)]
        };
      }
      const newAllData = action.payload.feed.docs
        .map(feed => {
          return feed.data();
        })
        .filter((elem, i, arr) => {
          return elem.hashtags.some(elem => {
            return action.payload.list.includes(elem);
          });
        });

      const newTotalNumberEmocios = newAllData.length;
      const newEmotionCount = getEmotionCount(newAllData);
      console.log("test", newEmotionCount);
      let newTopEmotion = "-";
      if (Object.keys(newEmotionCount).length > 0) {
        newTopEmotion = getTopEmotion(newEmotionCount);
      }
      const newCommentsCount = getCommentsCount(newAllData);
      const newSeries = getRadarChartSeries2(action.payload.graphData);

      return {
        ...state,
        topEmotion: newTopEmotion,
        totalNumberEmocios: newTotalNumberEmocios,
        commentsCount: newCommentsCount,
        series: [...newSeries]
      };
    default:
      return state;
  }
}
