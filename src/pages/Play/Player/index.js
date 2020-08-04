import React, {
  useContext,
  memo,
  useRef,
  useState,
  useEffect,
  forwardRef
} from "react";
import { Context } from "@/store";
import "./style.less";
import { formatTime } from "@/utils";
import { modeAry, closeAction } from "@/store/play";
import { getLyric } from "@/http";

function Player(
  {
    play,
    toggleMusic,
    current,
    duration,
    setOpenList,
    changeMode,
    prevSong,
    nextSong
  },
  audioRef
) {
  const {
    state: {
      Play: { item, mode }
    },
    dispatch
  } = useContext(Context);

  const processBar = useRef(null);
  const scrollRef = useRef(null);
  const [showLyric, setShowLyric] = useState(false);
  const [lyric, setLyric] = useState([]);
  const [moveX, setMoveX] = useState(0); //这是移动的距离
  const [now, setNow] = useState(0); //当前的时间
  const [cancelCurrent, setCancelCurrent] = useState(false);

  useEffect(() => {
    if (item.id !== undefined) {
      getLyric(item.id).then(data => setLyric(data));
    }
  }, [item.id]);
  const active = lyric.findIndex(v => v.time >= current) - 1;
  useEffect(() => {
    //自动换歌词
    const dom = scrollRef.current.querySelectorAll("li")[active];
    if (dom) {
      scrollRef.current.scrollTop =
        dom.offsetTop - scrollRef.current.clientHeight / 2;
    }
  }, [active]);

  useEffect(() => {
    if (!cancelCurrent) {
      setNow(current);
      setMoveX((current / duration) * processBar.current.clientWidth);
    }
  }, [current, duration, cancelCurrent]);
  //进度条调整
  const handleTouchStart = e => {
    //需要将current的自动变更取消掉
    setCancelCurrent(true);
  };
  const handleTouchMove = e => {
    const barEle = processBar.current;
    const newMoveX = e.touches[0].pageX - barEle.offsetLeft;
    if (newMoveX < 0) {
      setMoveX(0); //移动距离
      setNow(0);
    } else if (newMoveX > barEle.clientWidth) {
      setMoveX(barEle.clientWidth); //移动距离
      setNow(duration);
    } else {
      setMoveX(newMoveX); //移动距离
      setNow((moveX / barEle.clientWidth) * duration);
    }
  };

  const handleTouchEnd = e => {
    const barEle = processBar.current;
    const newTime = (moveX / barEle.clientWidth) * duration;
    audioRef.current.currentTime = newTime;
    setTimeout(() => {
      setCancelCurrent(false);
    }, 300);
  };
  const handleClick = e => {
    const barEle = processBar.current;
    const newMoveX = e.clientX - barEle.offsetLeft;
    const newTime = (newMoveX / barEle.clientWidth) * duration;
    setCancelCurrent(true);
    setMoveX(newMoveX); //移动距离
    setNow((newMoveX / barEle.clientWidth) * duration);
    audioRef.current.currentTime = newTime;
    setTimeout(() => {
      setCancelCurrent(false);
    }, 300);
  };

  return (
    <div className="player">
      <div className="bac" style={{ backgroundImage: `url(${item.picUrl})` }}>
        <div className="filter"></div>
      </div>

      <div className="player-title">
        <i
          className="iconfont icon-back"
          onClick={() => dispatch(closeAction())}
        ></i>
        <div className="text">
          <p className="s-name">{item.name}</p>
          <p className="s-singer">{item.singer}</p>
        </div>
      </div>
      <div className="player-content" onClick={() => setShowLyric(!showLyric)}>
        <ul
          className="lyric"
          ref={scrollRef}
          style={{ opacity: showLyric ? 1 : 0 }}
        >
          {lyric.map((v, i) => (
            <li
              key={v.time + i}
              className={active === i ? "active" : undefined}
            >
              {v.text}
            </li>
          ))}
        </ul>
        <div
          className="record"
          style={{ display: showLyric ? "none" : "block" }}
        >
          <div className={`needle ${play ? "" : "needle-pause"}`}></div>
          <div className={`cd ${play ? "" : "cd-pause"}`}>
            <img src={item.picUrl} alt="封面" />
          </div>
        </div>
      </div>
      <div className="action">
        <i className="iconfont icon-love"></i>
        <i className="iconfont icon-download"></i>
        <i className="iconfont icon-comment"></i>
        <i className="iconfont icon-more"></i>
      </div>
      <div className="process">
        <span className="current">{formatTime(now)}</span>
        <div className="p-bar" ref={processBar} onClick={handleClick}>
          <div className="bar-cur" style={{ width: `${moveX}px` }}></div>
          <span
            className="bar-btn"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translateX(${moveX - 8}px)` }}
          ></span>
        </div>
        <span className="duration">{formatTime(duration)}</span>
      </div>
      <div className="player-footer">
        <i
          className={`iconfont icon-${modeAry[mode].type}`}
          onClick={changeMode}
        ></i>
        <i className="iconfont icon-prev" onClick={prevSong}></i>
        <i
          onClick={toggleMusic}
          className={`iconfont icon-${play ? "pause" : "play"}`}
        ></i>
        <i className="iconfont icon-next" onClick={nextSong}></i>
        <i
          className="iconfont icon-playlist"
          onClick={() => setOpenList(true)}
        ></i>
      </div>
    </div>
  );
}

export default memo(forwardRef(Player));
