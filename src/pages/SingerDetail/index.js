import React, { useEffect, useState, memo } from "react";
import "./style.less";
import { getSingerTopSong } from "@/http";
import { useParams, useHistory } from "react-router-dom";
import { useRedux } from "@/store";
import { Toast } from "antd-mobile";
import { playAllAction, playMusicAction, openAction } from "@/store/play";
import { throttle } from "@/utils";
function SingerDetail(props) {
  const { id } = useParams();
  const [{ Play }, dispatch] = useRedux();
  const { goBack, location } = useHistory();
  const [opacity, setOpacity] = useState(0);
  const [info, setInfo] = useState({
    name: location.state ? location.state.name : undefined,
    url: location.state ? location.state.url : undefined
  });
  const [listData, setListData] = useState([]);
  useEffect(() => {
    getSingerTopSong(id).then(({ info, hotSong }) => {
      setInfo(info);
      setListData(hotSong);
    });
  }, [id]);
  //点击播放
  const handleClick = item => {
    if (item.id !== Play.item.id || id !== Play.listId) {
      //如果是歌曲不同或者歌单不同,点击才有效
      const list = listData.filter(item => item.status);
      dispatch(playMusicAction(item, list, id, !Play.list.length));
    } else {
      dispatch(openAction());
    }
  };
  //播放全部
  const handlePlayAllClick = () => {
    let list = listData.filter(item => item.status);
    if (list.length) {
      dispatch(playAllAction(list, id));
    } else {
      Toast.fail("不可播放!", 1, null, false);
    }
  };
  const handleScroll = throttle(e => {
    const top = e.target.scrollTop;
    if (top < 250) {
      setOpacity(top / 500);
    }
  }, 100);
  return (
    <div className="singer-detail" onScroll={handleScroll}>
      <div
        className="title"
        style={{ background: `rgba(0, 0, 0, ${opacity})` }}
      >
        <i className="iconfont icon-back" onClick={goBack}></i>
        <p className="name">{info.name}</p>
      </div>
      <div
        className="bac"
        style={{
          backgroundImage: `url(${info.url})`
        }}
      >
        <div className="filter"></div>
      </div>

      <div className="song">
        <div className="play-action" onClick={handlePlayAllClick}>
          <i className="iconfont icon-play"></i>
          <span className="song-num">播放热门50单曲</span>
        </div>
        {listData.map((item, index) => (
          <div
            key={item.id}
            className={`s-item${item.status ? "" : " disabled"}`}
            onClick={() => handleClick(item)}
          >
            <span className="s-index">
              {item.id === Play.item.id && id === Play.listId ? (
                <i className="iconfont icon-playCount"></i>
              ) : (
                index + 1
              )}
            </span>
            <div className="s-name-wrap">
              <span className="s-name">{item.name}</span>
              <span className="s-singer">{item.singer + item.album}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(SingerDetail);
/**
 * /top/artists?offset=0&limit=30 热门
 * /artist/list?cat=1001&initial=b 歌手分类和以首字母开头
 */
