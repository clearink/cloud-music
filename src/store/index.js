import { createContext, useContext } from "react";
import { reducer as Play, initState as PlayInit } from "./play";
import { reducer as Singer, initState as SingerInit } from "./singer";
import { reducer as Recommend, initState as RecommendInit } from "./recommend";
import { reducer as Center, initState as CenterInit } from "./center";
import { reducer as Rank, initState as RankInit } from "./rank";
export const rootReducer = combineReducer({
  Recommend,
  Play,
  Center,
  Singer,
  Rank
});
export const Context = createContext(null);
export const initialState = {
  Recommend: RecommendInit,
  Play: PlayInit,
  Center: CenterInit,
  Singer: SingerInit,
  Rank: RankInit
};

function combineReducer(reducerObj) {
  //组合成一个大的reducer函数
  return function(state, action) {
    return Object.entries(reducerObj).reduce((prev, [key, value]) => {
      prev[key] = value(state[key], action);
      return prev;
    }, {});
  };
}

export const useRedux = () => {
  const { state, dispatch } = useContext(Context);
  return [state, dispatch];
};
