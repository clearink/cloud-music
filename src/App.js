import React, { useReducer } from "react";
import { HashRouter as Router } from "react-router-dom";
import Header from "@/components/Header";
import "./App.less";
import { routes } from "@/routes";
import AnimateSwitch from "@/components/AnimateSwitch";
import Play from "@/pages/Play";
import { Context, rootReducer, initialState } from "@/store";
function App(props) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      <Router>
        <Header />
        <section className="main">
          <AnimateSwitch classNames="fade-in-top" routes={routes} />
          <Play />
        </section>
      </Router>
    </Context.Provider>
  );
}

export default App;
