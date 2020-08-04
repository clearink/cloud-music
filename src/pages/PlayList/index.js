import React, { useState, useEffect, useContext } from "react";
import "./style.less";
import { useHistory, useParams } from "react-router-dom";
import { getListDetails } from "@/http";
import { throttle, getV } from "@/utils";
import { NoticeBar, Toast } from "antd-mobile";
import { Context } from "@/store";
import {
  playAllAction,
  playMusicAction,
  openAction
} from "@/store/play";

function PlayList(props) {
  const {
    state: { Play },
    dispatch
  } = useContext(Context);
  const { goBack, location } = useHistory();
  const [listData, setListData] = useState([]); //歌单列表

  const [listInfo, setListInfo] = useState({
    title: "歌单",
    coverImgUrl: getV(location, "coverImgUrl"),
    name: getV(location, "name")
  }); //歌单信息
  const { id } = useParams();
  useEffect(() => {
    getListDetails(id).then(([listInfo, listData]) => {
      setListInfo(info => ({ ...info, ...listInfo }));
      setListData(listData);
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
    if (top < 100) {
      setListInfo(info => ({ ...info, title: "歌单" }));
    } else if (top < 400) {
      setListInfo(info => ({ ...info, title: info.name }));
    }
  }, 50);
  return (
    <div className="play-list" onScroll={handleScroll}>
      <div className="lst-wrap">
        <div
          className="bac"
          style={{
            backgroundImage: `url(${listInfo.coverImgUrl})`
          }}
        >
          <div className="filter"></div>
        </div>
        <div className="lst-tl">
          <i className="iconfont icon-back" onClick={goBack}></i>
          <NoticeBar
            icon={null}
            marqueeProps={{
              loop: true,
              leading: 1500
            }}
          >
            {listInfo.title}
          </NoticeBar>
          <i className="iconfont icon-search"></i>
          <i className="iconfont icon-more"></i>
        </div>
        <div className="lst-desc">
          <img className="cover" src={listInfo.coverImgUrl} alt="" />
          <div className="desc-right">
            <p>{listInfo.name}</p>
            <div className="creator">
              <img src={listInfo.coverImgUrl} alt="" />
              <span className="nickname">{listInfo.nickname}</span>
            </div>
          </div>
        </div>
        <ul className="action">
          <li>
            <i className="iconfont icon-comment"></i>
            <span>{listInfo.commentCount}</span>
          </li>
          <li>
            <i className="iconfont icon-share"></i>
            <span>{listInfo.shareCount}</span>
          </li>
          <li>
            <i className="iconfont icon-download"></i>
            <span>下载</span>
          </li>
          <li>
            <i className="iconfont icon-selection"></i>
            <span>多选</span>
          </li>
        </ul>
      </div>

      <div className="s-list">
        <div className="tool-bar">
          <div onClick={handlePlayAllClick}>
            <i className="iconfont icon-play"></i>
            <span className="lst-len">播放全部(共{listData.length}首)</span>
          </div>
          <span className="btn">
            <i className="iconfont icon-plus"></i>
            收藏({listInfo.subscribedCount})
          </span>
        </div>
        <div className="song">
          {listData.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>暂无歌曲</p>
          ) : (
            listData.map((item, index) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayList;
