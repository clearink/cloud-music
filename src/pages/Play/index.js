import React, { useRef, useState, useEffect, memo, useCallback } from "react";
import { useRedux } from "@/store";
import { changeSongAction, LOOP, changeModeAction } from "@/store/play";
import Bar from "./Bar";
import { CSSTransition } from "react-transition-group";
import Player from "./Player";
import SongList from "./SongList";
function Play(props) {
  const [
    {
      Play: { index, item, mode, list, open }
    },
    dispatch
  ] = useRedux();
  const [play, setPlay] = useState(false);
  const [duration, setDuration] = useState(0); //时长
  const [current, setCurrent] = useState(0); //进度
  const [openList, setOpenList] = useState(false); //打开播放列表
  const audioRef = useRef(null);
  useEffect(() => {
    //切换歌曲
    if (!item.url) {
      audioRef.current.pause();
      setOpenList(false);
      return;
    }
    return () => {
      setPlay(false);
    };
  }, [item.url]);

  const handleMusicClick = useCallback(e => {
    //播放or暂停
    e.stopPropagation();
    const audio = audioRef.current;
    audio.paused ? audio.play() : audio.pause();
    setPlay(!audio.paused);
  }, []);

  const handleLoop = useCallback(() => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setPlay(true);
  }, []);

  //播放器------------------------------
  const handleEnded = e => {
    //播放完成

    if (mode === LOOP || list.length === 1) {
      handleLoop();
    } else {
      handleNextSong();
    }
  };
  const handleChangeMode = useCallback(() => {
    const newMode = (mode + 1) % 3;
    dispatch(changeModeAction(newMode));
  }, [mode, dispatch]);
  //上一首,下一首
  const handlePrevSong = () => {
    if (list.length === 1) {
      handleLoop();
    } else {
      const i = (index - 1 + list.length) % list.length;
      dispatch(changeSongAction(i));
    }
  };
  const handleNextSong = () => {
    if (list.length === 1) {
      handleLoop();
    } else {
      const i = (index + 1) % list.length;
      dispatch(changeSongAction(i));
    }
  };
  return (
    <>
      <CSSTransition
        in={open && !!list.length}
        classNames="open-player"
        timeout={300}
        unmountOnExit
      >
        <Player
          play={play}
          ref={audioRef}
          toggleMusic={handleMusicClick}
          duration={duration}
          current={current}
          nextSong={handleNextSong}
          prevSong={handlePrevSong}
          setOpenList={setOpenList}
          changeMode={handleChangeMode}
        />
      </CSSTransition>

      <SongList
        setOpenList={setOpenList}
        changeMode={handleChangeMode}
        open={openList}
      />

      <CSSTransition
        classNames="bar"
        in={item.id !== undefined}
        timeout={300}
        unmountOnExit
      >
        <Bar
          play={play}
          toggleMusic={handleMusicClick}
          setOpenList={setOpenList}
        />
      </CSSTransition>
      <audio
        src={item.url}
        autoPlay
        ref={audioRef}
        onEnded={handleEnded}
        onCanPlay={() => setPlay(true)}
        onLoadedData={e => setDuration(e.target.duration | 0)}
        onTimeUpdate={e => setCurrent(e.target.currentTime)}
        onError={() => alert("播放出错")}
      ></audio>
    </>
  );
}

export default memo(Play);
