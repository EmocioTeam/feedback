export default (hashtags = [], action) => {
  switch (action.type) {
    case "getHashtagList":
      // console.log(action.payload);
      return action.payload;
    default:
      return hashtags;
  }
};
