// auth = {
//   user: display name,
//   email: email,
//   stakeholder: true / false
//   errorMsg: if something went wrong logging
// }

export default (auth = {}, action) => {
  switch (action.type) {
    case "signIn":
      console.log("signInReducer", action.payload);
      return {
        ...auth,
        user: action.payload.user,
        email: action.payload.email,
        stakeholder: action.payload.stakeholder,
        errorMsg: ""
      };
    case "signOut":
      return {
        ...auth,
        user: undefined,
        email: undefined,
        stakeholder: undefined,
        errMsg: ""
      };
    case "signInError":
      return { ...auth, errorMsg: action.payload };
    case "updateUserName":
      return { ...auth, user: action.payload };
    default:
      return auth;
  }
};
