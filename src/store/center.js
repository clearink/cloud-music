const SET_CAT = "SET_CAT";

export const setCatAction = cat => ({
  type: SET_CAT,
  payload: cat
});
export const initState = {
  cat: "全部"
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_CAT:
      return { cat: action.payload };

    default:
      return state;
  }
};
