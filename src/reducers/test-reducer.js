export default (test = {}, action) => {
  switch (action.type) {
    case "test":
      test.msg = action.payload;
      return test;
    default:
      return test;
  }
};
