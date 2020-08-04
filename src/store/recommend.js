export const ADD_RECOMMEND = "ADD_RECOMMEND";
export const ADD_BANNER = "ADD_BANNER";


export const addRecommendAction = recommendList => ({
  type: ADD_RECOMMEND,
  payload: recommendList
});

export const addBannerAction = bannerList => ({
  type: ADD_BANNER,
  payload: bannerList
});


export const initState = {
  recommendList: [],
  bannerList: [],
  playList: [],
  open: false
};
export const reducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ADD_RECOMMEND:
      //添加推荐歌单
      newState.recommendList = action.payload;
      return newState;
    case ADD_BANNER:
      //更换轮播图
      newState.bannerList = action.payload;
      return newState;
    
    default:
      return state;
  }
};
