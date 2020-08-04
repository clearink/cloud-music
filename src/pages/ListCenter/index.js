import React, { useEffect, useState, useMemo, useRef } from "react";
import "./style.less";
import { getPlayList } from "@/http";
import { setCatAction } from "@/store/center";
import { useRedux } from "@/store";
import { Link } from "react-router-dom";
import { formatNum } from "@/utils";
import ImgLazyLoad from "../../components/ImgLazyLoad";
function ListCenter(props) {
  const [
    {
      Center: { cat }
    },
    dispatch
  ] = useRedux();
  const [playLists, setPlayLists] = useState([]);
  const catList = useMemo(() => ["全部", "华语", "欧美", "流行", "摇滚"], []);
  const loadDataRef = useRef(null);
  useEffect(() => {
    getPlayList(cat).then(data => {
      setPlayLists(data);
    });
  }, [cat]);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(item => {
        if (
          item.isIntersecting &&
          playLists.length < 100 &&
          playLists.length !== 0
        ) {
          getPlayList(cat, playLists.length + 30).then(data => {
            setPlayLists(state => state.concat(data.slice(state.length)));
          });
        }
      });
    });
    io.observe(loadDataRef.current);
    return () => {
      io.disconnect();
    };
  }, [cat, playLists.length]);
  return (
    <ImgLazyLoad data={playLists}>
      <div className="list-center">
        <div className="select-cat">
          <ul className="select-nav">
            {catList.map(v => (
              <li
                key={v}
                onClick={() => dispatch(setCatAction(v))}
                className={`btn ${v === cat ? "active" : ""}`}
              >
                {v}
              </li>
            ))}
          </ul>
        </div>

        <ul className="c-list">
          {playLists.map(({ id, coverImgUrl, name, playCount }, index) => (
            <li key={id + index}>
              <Link
                className="c-list-item"
                to={{
                  pathname: `/playlist/${id}`,
                  state: { coverImgUrl, name }
                }}
              >
                <img data-src={coverImgUrl} src="/assets/default.png" alt="" />
                <span className="c-item-name">{name}</span>
                <span className="play-count">{formatNum(playCount)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p ref={loadDataRef} style={{ textAlign: "center" }}>
          努力加载中...
        </p>
      </div>
    </ImgLazyLoad>
  );
}
export default ListCenter;
