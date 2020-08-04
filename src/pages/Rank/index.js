import React, { useEffect } from "react";
import { getTopList } from "@/http";
import "./style.less";
import { Link } from "react-router-dom";
import { useRedux } from "@/store";
import { addRankListAction } from "@/store/rank";
function Rank(props) {
  const [{ Rank }, dispatch] = useRedux();
  useEffect(() => {
    if (Rank.global.length === 0) {
      getTopList().then(data => {
        dispatch(addRankListAction(data.slice(0, 4), data.slice(4)));
      });
    }
  }, [Rank, dispatch]);
  return (
    <div className="rank">
      <p className="title">官方榜</p>
      <ul className="official-list">
        {Rank.official.map(item => (
          <li key={item.id}>
            <Link
              to={{
                pathname: `/playlist/${item.id}`,
                state: { coverImgUrl: item.coverImgUrl, name: item.name }
              }}
              className="list-item"
            >
              <img src={item.coverImgUrl} alt="" className="list-img" />
              <div className="top3">
                {item.tracks.map((song, i) => (
                  <div key={song.first + i}>
                    {`${i + 1}. ${song.first}-${song.second}`}
                  </div>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="title">全球榜</p>
      <ul className="global-list">
        {Rank.global.map(item => (
          <li key={item.id}>
            <Link
              to={{
                pathname: `/playlist/${item.id}`,
                state: { coverImgUrl: item.coverImgUrl, name: item.name }
              }}
              className="list-item"
            >
              <img src={item.coverImgUrl} alt="" className="list-img" />
              <p>{item.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rank;
