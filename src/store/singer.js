export const CHANGE_CAT = "CHANGE_CAT";
export const ADD_BANNER = "ADD_BANNER";

export const changeCatAction = newCat => ({
  type: CHANGE_CAT,
  payload: newCat
});

export const initState = {
  cat: "1001"
};
export const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CAT:
      return { cat: action.payload };
    case ADD_BANNER:
    default:
      return state;
  }
};

export const singerAreas = [
  { type: "男歌手", id: "01" },
  { type: "女歌手", id: "02" },
  { type: "乐队组合", id: "03" }
];
export const singerTypes = [
  { type: "华语", id: "10" },
  { type: "欧美", id: "20" },
  { type: "日本", id: "60" },
  { type: "韩国", id: "70" },
  { type: "其他", id: "40" }
];
