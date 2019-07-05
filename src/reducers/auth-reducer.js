export default (auth = {}, action) => {
  switch (action.type) {
    case "signIn":
      return {
        ...auth,
        user: action.payload.user,
        email: action.payload.email,
        errorMsg: ""
      };
    case "signOut":
      return { ...auth, user: undefined, email: undefined };
    case "signInError":
      return { ...auth, errorMsg: action.payload };
    case "updateUserName":
      return { ...auth, user: action.payload };
    default:
      return auth;
  }
};
