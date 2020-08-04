import React, { useEffect, useState, useCallback, useRef } from "react";
import { debounce } from "@/utils";
import { useRedux } from "@/store";
import "./style.less";
import { useHistory } from "react-router-dom";
import { getSearchHot, getSearchResult, getSongDetail } from "@/http";
import { playMusicAction, openAction } from "@/store/play";
import {} from "../../http";
function Search(props) {
  const { goBack } = useHistory();
  const [hotList, setHotList] = useState([]);
  const [result, setResult] = useState([]);
  const [showHot, setShowHot] = useState(true);
  const [word, setWord] = useState("");
  const focus = useRef(null);
  const [{ Play }, dispatch] = useRedux();
  useEffect(() => {
    getSearchHot().then(data => setHotList(data));
  }, []);
  const loadData = useCallback(
    debounce(word =>
      getSearchResult(word).then(data => {
        setShowHot(false);
        setResult(data);
      })
    ),
    []
  );
  useEffect(() => {
    focus.current.focus();
  }, []);
  const handleInputChange = e => {
    const keywords = e.target.value;
    setWord(keywords);
    if (keywords.trim() !== "" && keywords.trim() !== word) {
      loadData(keywords.trim());
    }
  };
  const handleSearchClick = keywords => {
    loadData(keywords);
    setWord(keywords);
  };
  const handlePlayMusic = async song => {
    if (song.id !== Play.item.id) {
      const hasSong = Play.list.find(item => item.id === song.id);
      let newList = Play.list;
      if (!hasSong) {
        //如果没有
        const data = await getSongDetail(song.id);
        song.picUrl = data.al.picUrl+'?param=400x400';
        song.index = Play.list.length;
        newList = newList.concat(song);
      }
      dispatch(playMusicAction(song, newList, Play.listId, !Play.list.length));
    } else {
      dispatch(openAction());
    }
  };
  return (
    <div className="search">
      <div className="search-title">
        <i className="iconfont icon-back" onClick={goBack}></i>
        <div className="ipt">
          <input
            ref={focus}
            value={word}
            type="text"
            onChange={handleInputChange}
            placeholder="请输入..."
          />
          <i
            className="iconfont icon-delete"
            onClick={() => setWord("")}
            style={{ opacity: word.length ? 1 : 0 }}
          ></i>
        </div>
      </div>
      <div className="content">
        <p>{showHot ? "热门搜索" : "最佳匹配"}</p>
        <div className="hot" style={{ display: showHot ? "flex" : "none" }}>
          {hotList.map((item, i) => (
            <span
              className="hot-item"
              key={item.first + i}
              onClick={() => handleSearchClick(item.first)}
            >
              {item.first}
            </span>
          ))}
        </div>
        <div className="song">
          {result.map((song, index) => (
            <div
              key={song.id}
              className={`s-item${song.status ? "" : " disabled"}`}
              onClick={() => handlePlayMusic(song)}
            >
              <div className="s-name-wrap">
                <span className="s-name">{song.name}</span>
                <span className="s-singer">{song.singer + song.album}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
