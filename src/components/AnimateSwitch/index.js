import React from "react";
import "./style.less";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useLocation, Switch, matchPath } from "react-router-dom";
import { renderRoutes } from "@/routes";
function AnimateSwitch(props) {
  const { routes, classNames, timeout = 300 } = props;
  const location = useLocation();
  const match = getMatchPath(routes, location);
  return (
    <SwitchTransition>
      <CSSTransition
        appear
        key={match.path}
        timeout={timeout}
        classNames={classNames}
      >
        <Switch location={location}>{renderRoutes(routes)}</Switch>
      </CSSTransition>
    </SwitchTransition>
  );
}
export default AnimateSwitch;

function getMatchPath(routes, { pathname }) {
  return routes.find(item => matchPath(pathname, item)) || { path: "noMatch" };
}
//不能使用location.pathname作为CSSTransition的key属性,原因是由于应用中可能不止一个Switch
//所以当location.pathname改变时,所有匹配到达组件都会重新应用动画,造成页面的抖动
