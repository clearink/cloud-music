import React, { memo, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import { useRedux } from "@/store";
import {
  changeSongAction,
  deleteSongAction,
  initAction,
  modeAry
} from "@/store/play";
import { Modal } from "antd-mobile";

import "./style.less";
function SongList({ setOpenList, changeMode, open }) {
  const [
    {
      Play: { item, mode, list }
    },
    dispatch
  ] = useRedux();
  const songList = useMemo(
    () =>
      [...list].sort((a, b) => {
        if (a.index < b.index) return -1;
        return 1;
      }),
    [list]
  );
  //删除全部
  const handleDeleteAll = () => {
    Modal.alert("确定要清空列表?", null, [
      { text: "取消" },
      {
        text: "确定",
        onPress: () => dispatch(initAction())
      }
    ]);
  };
  const handleChangeSong = songId => {
    const index = list.findIndex(item => item.id === songId);
    dispatch(changeSongAction(index));
  };
  return (
    <CSSTransition classNames="song-list" in={open} timeout={300} unmountOnExit>
      <div className="song-list">
        <div className="mask" onClick={() => setOpenList(false)}></div>
        <div className="s-list">
          <div className="lst-title">
            <div className="tlt-action" onClick={changeMode}>
              <i className={`iconfont icon-${modeAry[mode].type}`}></i>
              <span>
                {modeAry[mode].name}({list.length})
              </span>
            </div>
            <div className="tlt-extra" onClick={handleDeleteAll}>
              <i className={`iconfont icon-trash`}></i>
            </div>
          </div>
          <ul className="lst">
            {songList.map(song => (
              <li className="lst-item" key={song.id}>
                <div
                  className={`s-info ${song.id === item.id ? "active" : ""}`}
                  onClick={() => handleChangeSong(song.id)}
                >
                  {song.id === item.id && (
                    <i className="iconfont icon-playCount"></i>
                  )}
                  <span className="s-n">{song.name}</span>
                  <span className="s-s">-{song.singer}</span>
                </div>
                <i
                  className="iconfont icon-delete"
                  onClick={() => dispatch(deleteSongAction(song.id))}
                ></i>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CSSTransition>
  );
}

export default memo(SongList);
