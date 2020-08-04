import React, { useEffect, useState, useRef, memo } from "react";
import "./style.less";
import { getArtistList } from "@/http";
import { useRedux } from "@/store";
import Select from "./Select";
import { Link } from "react-router-dom";
import ImgLazyLoad from "../../components/ImgLazyLoad";
function Singer(props) {
  const loadDataRef = useRef(null);
  const [artists, setArtists] = useState([]);
  const [more, setMore] = useState(true);

  const [
    {
      Singer: { cat }
    }
  ] = useRedux();
  //请求数据
  useEffect(() => {
    getArtistList(cat).then(data => {
      setArtists(data.artists);
      setMore(data.more);
    });
  }, [cat]);
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(item => {
        if (item.isIntersecting && artists.length !== 0 && more) {
          // console.log("object");
          //请求数据
          getArtistList(cat, artists.length).then(data => {
            setArtists(state => state.concat(data.artists));
            setMore(data.more);
          });
        }
      });
    });
    io.observe(loadDataRef.current);
    return () => {
      io.disconnect();
    };
  }, [cat, artists.length, more]);
  return (
    <ImgLazyLoad data={artists}>
      <div className="singer">
        <Select changeCat={() => {}} />
        <ul className="artist-list">
          {artists.map(item => (
            <li key={item.id}>
              <Link
                to={{
                  pathname: `/singer/${item.id}`,
                  state: { name: item.name, url: item.url }
                }}
                className="list-item"
              >
                <img data-src={item.url} src="/assets/default.png" alt="" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p ref={loadDataRef} style={{ textAlign: "center" }}>
          {more ? "努力加载中..." : "暂无更多"}
        </p>
      </div>
    </ImgLazyLoad>
  );
}

export default memo(Singer);
/**
 * /top/artists?offset=0&limit=30 热门
 * /artist/list?cat=1001&initial=b 歌手分类和以首字母开头
 */
