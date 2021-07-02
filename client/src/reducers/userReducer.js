export const initialState = null;

export const reducer = (state, action) => {
  if (action.type == "USER") {
    return action.payload;
  }
  if (action.type == "CLEAR") {
    return null;
  }
  if (action.type == "UPDATE_USER") {
    return {
      ...state,
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
      bio: action.payload.bio,
      image: action.payload.imageurl,
    };
  }
  return state;
};
