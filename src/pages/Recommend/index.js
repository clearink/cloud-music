import React, { useEffect } from "react";
import "./style.less";
import { getBannerList, getRecommendList } from "@/http";
import "swiper/css/swiper.min.css";
import Swiper from "swiper/js/swiper";
import { Link } from "react-router-dom";
import { formatNum } from "@/utils";
import { useRedux } from "@/store";
import { addRecommendAction, addBannerAction } from "@/store/recommend";
import ImgLazyLoad from "../../components/ImgLazyLoad";
function Recommend(props) {
  const [
    {
      Recommend: { bannerList, recommendList }
    },
    dispatch
  ] = useRedux();
  //推荐列表
  useEffect(() => {
    if (recommendList.length === 0) {
      getRecommendList().then(data => {
        dispatch(addRecommendAction(data));
      });
    }
  }, [dispatch, recommendList]);
  //轮播图
  useEffect(() => {
    if (bannerList.length === 0) {
      getBannerList().then(banners => {
        dispatch(addBannerAction(banners));
      });
    }
    initBanner();
  }, [dispatch, bannerList]);

  return (
    <ImgLazyLoad data={recommendList}>
      <div className="rcm">
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {bannerList.map(({ bannerId, pic, typeTitle }) => (
              <img
                className="swiper-slide"
                key={bannerId}
                src={pic}
                alt={typeTitle}
              />
            ))}
          </div>
          <div className="swiper-pagination"></div>
        </div>
        <h2 className="rcm-tl">推荐歌单</h2>
        <ul className="c-list">
          {recommendList.map(({ id, coverImgUrl, name, playCount }, index) => (
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
      </div>
    </ImgLazyLoad>
  );
}

export default Recommend;

function initBanner() {
  return new Swiper(".swiper-container", {
    autoplay: {
      delay: 2500,
      disableOnInteraction: false
    },
    height: 140,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    }
  });
}
