import React from "react";
import "./style.less";
import { NavLink } from "react-router-dom";
function Header(props) {
  const handleMore = () => {
    alert(`
    待续功能:
    0.优化选择歌手组件
    1.用户中心
    2.搜索历史
    3.历史记录
    4.收藏歌曲
    5.下载歌曲
    `);
  };
  return (
    <header>
      <div className="m-head">
        <i className="iconfont icon-menu" onClick={handleMore}></i>
        <div className="tab">
          <NavLink to="/recommend">推荐</NavLink>
          <NavLink exact to="/playlist">
            歌单
          </NavLink>
          <NavLink to="/singer">歌手</NavLink>
          <NavLink to="/rank">榜单</NavLink>
        </div>
        <NavLink
          to="/search"
          style={{ flexBasis: "4rem", textAlign: "center" }}
        >
          <i className="iconfont icon-search"></i>
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
