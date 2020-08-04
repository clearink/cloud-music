import { shuffle } from "@/utils";
export const ORDER = 0;
export const RANDOM = 1;
export const LOOP = 2;
export const modeAry = [
  { name: "顺序播放", type: "order" },
  { name: "随机播放", type: "random" },
  { name: "循环播放", type: "loop" }
];
export const PLAY_ALL = "PLAY_ALL"; //播放全部
export const PLAY_MUSIC = "PLAY_MUSIC"; //点击播放
export const CHANGE_MODE = "CHANGE_MODE"; //改变播放模式
export const CHANGE_SONG = "CHANGE_SONG"; //切换歌曲
export const DELETE_SONG = "DELETE_SONG"; //删除歌曲
export const INIT_STATE = "INIT_STATE"; //初始化
export const TOGGLE_OPEN = "TOGGLE_OPEN"; //打开播放页面
//初始化
export const initAction = () => ({
  type: INIT_STATE
});

//切换模式
export const changeModeAction = mode => ({
  type: CHANGE_MODE,
  payload: mode
});

//播放全部
export const playAllAction = (list, listId) => ({
  type: PLAY_ALL,
  payload: { list, listId }
});
export const openAction = () => ({
  type: TOGGLE_OPEN,
  payload: true
});

export const closeAction = () => ({
  type: TOGGLE_OPEN,
  payload: false
});

//点击播放
export const playMusicAction = (item, list, listId, open) => ({
  type: PLAY_MUSIC,
  payload: { item, list, listId, open }
});

export const changeSongAction = index => ({
  type: CHANGE_SONG,
  payload: index
});

export const deleteSongAction = id => ({
  type: DELETE_SONG,
  payload: id
});

export const initState = {
  index: null, //index是为了更快的找到歌曲
  mode: 0,
  item: {},
  list: [], //用于播放的
  open: false,
  listId: null
};
export const reducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case INIT_STATE:
      return initState;

    case PLAY_ALL:
      if (newState.mode === RANDOM) {
        newState.list = shuffle(action.payload.list);
      } else {
        newState.list = action.payload.list;
      }
      newState.listId = action.payload.listId;
      newState.open = true;
      newState.index = 0;
      newState.item = newState.list[0];
      return newState;

    case PLAY_MUSIC:
      if (newState.mode === RANDOM) {
        newState.list = shuffle(action.payload.list);
      } else {
        newState.list = action.payload.list;
      }
      newState.listId = action.payload.listId;
      newState.item = action.payload.item;
      newState.open = action.payload.open;
      newState.index = newState.list.findIndex(
        item => item.id === newState.item.id
      );
      return newState;
    case CHANGE_SONG:
      newState.index = action.payload;
      newState.item = newState.list[newState.index];
      return newState;

    case DELETE_SONG:
      // newState.list.splice(action.payload, 1);
      let index = newState.list.findIndex(v => v.id === action.payload);
      newState.list = newState.list.filter(v => v.id !== action.payload);
      if (newState.index > index) {
        //如果删除的是播放之前的音乐
        newState.index -= 1;
      } else if (newState.index === index) {
        //删除当前播放的元素
        newState.item = newState.list[index];
        if (index === newState.list.length) {
          //如果删除的是最后一个
          newState.item = newState.list[newState.list.length - 1] || {};
          newState.index -= 1;
        }
      }
      return newState;
    case TOGGLE_OPEN:
      newState.open = action.payload;
      return newState;

    case CHANGE_MODE:
      newState.mode = action.payload;
      if (newState.mode === RANDOM) {
        newState.list = shuffle(newState.list);
        newState.index = newState.list.findIndex(
          item => item === newState.item
        );
      } else if (newState.mode === ORDER) {
        newState.list = [...newState.list].sort((a, b) => a.index - b.index);
        newState.index = newState.list.findIndex(
          item => item === newState.item
        );
      }
      return newState;

    default:
      return state;
  }
};
