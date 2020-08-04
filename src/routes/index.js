import React from "react";
import Recommend from "@/pages/Recommend";
import ListCenter from "@/pages/ListCenter";
import Singer from "@/pages/Singer";
import PlayList from "@/pages/PlayList";
import SingerDetail from "@/pages/SingerDetail";
import Rank from "@/pages/Rank";
import Search from "@/pages/Search";
import { Redirect, Route } from "react-router-dom";

export const routes = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/recommend" />
  },
  {
    path: "/recommend",
    component: Recommend
  },
  {
    path: "/rank",
    component: Rank
  },
  {
    path: "/search",
    exact: true,
    component: Search
  },
  {
    path: "/playlist",
    exact: true,
    component: ListCenter
  },
  {
    path: "/playlist/:id",
    component: PlayList
  },
  {
    path: "/singer",
    exact: true,
    component: Singer
  },
  {
    path: "/singer/:id",
    component: SingerDetail
  }
];

export const renderRoutes = routes => {
  return routes.map(item => (
    <Route
      key={item.path}
      exact={item.exact}
      path={item.path}
      render={props => <item.component {...props} routes={item.routes} />}
    />
  ));
};
