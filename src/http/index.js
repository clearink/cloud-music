import Axios from "axios";
import React from "react";
import Loading from "@/components/Loading";
import ReactDOM from "react-dom";
import { formatNum } from "@/utils";
//Axios.defaults.baseURL = "http://47.95.252.254:3000";
Axios.defaults.headers.post["Content-Type"] = "application/json";
Axios.defaults.baseURL = "http://localhost:4000";
const request = options => {
  const { method = "get", params = {}, data = {} } = options;
  let div = document.createElement("div");
  document.body.appendChild(div);
  ReactDOM.render(<Loading />, div);
  return new Promise((resolve, reject) => {
    Axios({
      method,
      params,
      data,
      timeout: 5000,
      ...options
    })
      .then(res => {
        if (res.status === 200) {
          resolve(res.data);
        } else {
          console.error("请求异常");
        }
      })
      .catch(res => {
        console.error(res.message);
        reject(res.message);
      })
      .finally(() => {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);
      });
  });
};
// Axios.defaults.baseURL = "http://localhost:3000";
// const request = async options => {
//   const { method = "get", params = {}, data = {} } = options;
//   const res = await Axios.request({
//     method,
//     params,
//     data,
//     ...options
//   });
//   if (res.status !== 200) {
//     return Promise.reject(res.status);
//   }
//   return res.data;
// };
//获取轮播图
export const getBannerList = async () => {
  const data = await request({
    url: "/banner",
    params: {
      type: 2
    }
  });
  return data.banners.map(({ bannerId, pic, typeTitle }) => ({
    bannerId,
    pic,
    typeTitle
  }));
};
//获取推荐歌单列表 /personalized
export const getRecommendList = async () => {
  const data = await request({
    url: "/personalized",
    params: {
      limit: 100
    }
  });
  return data.result.map(item => ({
    id: item.id,
    name: item.name,
    coverImgUrl: item.picUrl,
    playCount: item.playCount
  }));
};

// 网友精选碟 /top/playlist
export const getPlayList = async (cat = "全部", limit = 30) => {
  const data = await request({
    url: "/top/playlist",
    params: {
      cat,
      limit,
      order: "hot"
    }
  });
  return data.playlists;
};

//获取歌单详情 /playlist/detail
export const getListDetails = async id => {
  const { playlist, privileges } = await request({
    url: "/playlist/detail",
    params: {
      id
    }
  });
  const listInfo = {
    name: playlist.name,
    coverImgUrl: playlist.coverImgUrl,
    avatarUrl: playlist.creator.avatarUrl,
    nickname: playlist.creator.nickname,
    shareCount: playlist.shareCount,
    commentCount: playlist.commentCount,
    subscribedCount: formatNum(playlist.subscribedCount)
  };
  const listData = playlist.tracks.map((item, i) => ({
    index: i,
    id: item.id,
    name: item.name,
    picUrl: item.al.picUrl + "?param=300x300",
    url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
    singer: item.ar.map(v => v.name).join(" / "),
    album: " - " + item.al.name,
    status: !privileges[i].st && privileges[i].subp
    //有版权且不是vip
  }));
  return [listInfo, listData];
};

//歌词 /lyric?id=33894312
export const getLyric = async id => {
  const data = await request({
    url: "/lyric",
    params: {
      id
    }
  });
  const res = [];
  if (data.hasOwnProperty("lrc")) {
    for (let word of data.lrc.lyric.split("\n")) {
      if (!word) continue;
      const text = [...word.matchAll(/\[.*\](.*)/g)][0][1];
      if (!text) continue;
      for (let t of word.matchAll(/\[(\d+):(.*?)\]/g)) {
        res.push({ time: t[1] * 60 + +t[2], text: text });
      }
    }
    res.push({ time: 9999999, text: "" });
    res.sort((a, b) => a.time - b.time);
    return res;
  }
  return [{ time: 9999999, text: "暂无歌词" }];
};

//歌手 /artist/list?cat=1001
// 1001华语男歌手
export const getArtistList = async (cat = "1001", offset = 0) => {
  const data = await request({
    url: "/artist/list",
    params: {
      cat,
      offset,
      limit: 20
    }
  });
  return {
    more: data.more,
    artists: data.artists.map(item => ({
      id: item.id,
      url: item.picUrl + "?param=300x300",
      name: item.name
    }))
  };
};

// /artists?id=6452
export const getSingerTopSong = async id => {
  const data = await request({
    url: "/artists",
    params: {
      id
    }
  });
  return {
    info: {
      name: data.artist.name,
      url: data.artist.picUrl + "?param=300x300"
    },
    hotSong: data.hotSongs.map((item, i) => ({
      index: i,
      id: item.id,
      name: item.name,
      picUrl: item.al.picUrl + "?param=300x300",
      url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
      singer: item.ar.map(v => v.name).join(" / "),
      album: " - " + item.al.name,
      status: true
      //有版权
    }))
  };
};

// 所有榜单 /toplist/detail
export const getTopList = async () => {
  const data = await request({
    url: "/toplist/detail"
  });
  return data.list;
};

//热搜列表 简略 /search/hot
export const getSearchHot = async () => {
  const data = await request({
    url: "/search/hot"
  });
  return data.result.hots;
};

//搜索 /search
export const getSearchResult = async (keywords, offset = 0) => {
  const data = await request({
    url: "/search",
    params: {
      keywords,
      offset
    }
  });
  if (!data.result.songs) return [];
  return data.result.songs.map(item => ({
    id: item.id,
    name: item.name,
    picUrl: "/assets/default.png",
    url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
    singer: item.artists.map(v => v.name).join(" / "),
    album: " - " + item.album.name,
    status: true
  }));
};

export const getSongDetail = async ids => {
  const data = await request({
    url: "/song/detail",
    params: {
      ids
    }
  });
  return data.songs[0];
};
