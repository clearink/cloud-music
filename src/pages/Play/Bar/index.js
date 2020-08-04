import React, { memo } from "react";
import { useRedux } from "@/store";
import { openAction } from "@/store/play";
import "./style.less";
function Bar({ play, toggleMusic, setOpenList }) {
  const [
    {
      Play: { item }
    },
    dispatch
  ] = useRedux();
  const handleOpenList = e => {
    e.stopPropagation();
    setOpenList(true);
  };
  return (
    <div onClick={() => dispatch(openAction())} className="player-bar">
      <img
        src={item.picUrl}
        alt="封面"
        className={play ? undefined : "pause"}
      />
      <div className="s-desc">
        <p className="s-name">{item.name}</p>
        <p className="s-singer">{item.singer}</p>
      </div>
      <i
        onClick={toggleMusic}
        className={`iconfont icon-${play ? "pause" : "play"}`}
      ></i>
      <i className="iconfont icon-playlist" onClick={handleOpenList}></i>
    </div>
  );
}

export default memo(Bar);
