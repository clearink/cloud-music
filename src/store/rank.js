export const ADD_RANK_LIST = "ADD_RANK_LIST";

export const addRankListAction = (official, global) => ({
  type: ADD_RANK_LIST,
  payload: { official, global }
});

export const initState = {
  official: [],
  global: []
};
export const reducer = (state, action) => {
  switch (action.type) {
    case ADD_RANK_LIST:
      return { ...action.payload };
    default:
      return state;
  }
};
