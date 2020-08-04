import React, { useState, useMemo } from "react";
import "./style.less";
import { CSSTransition } from "react-transition-group";

import { singerAreas, singerTypes, changeCatAction } from "@/store/singer";
import { useRedux } from "@/store";
function Select({ changeCat }) {
  const [choice, setChoice] = useState(false);

  const handleChangeCat = newCat => {
    setChoice(false);
    dispatch(changeCatAction(newCat));
  };
  const [
    {
      Singer: { cat }
    },
    dispatch
  ] = useRedux();
  const singerCat = useMemo(() => [...cat.match(/(.{2})/g)], [cat]);
  const types = useMemo(() => {
    const singerCat = [...cat.match(/(.{2})/g)];
    const area = singerTypes.find(item => item.id === singerCat[0]).type;
    const type = singerAreas.find(item => item.id === singerCat[1]).type;
    return `${area}/${type}`;
  }, [cat]);

  return (
    <div className="select">
      <span className="selected" onClick={() => setChoice(!choice)}>
        {types}
      </span>
      <CSSTransition
        in={choice}
        unmountOnExit
        classNames="fade-bottom"
        timeout={300}
        appear
      >
        <div className="select-wrap">
          <div className="language">
            <p>语种</p>
            <div className="wrap">
              {singerTypes.map(item => (
                <span
                  key={item.id}
                  className={singerCat[0] === item.id ? "active" : undefined}
                  onClick={() => handleChangeCat(item.id + singerCat[1])}
                >
                  {item.type}
                </span>
              ))}
            </div>
          </div>
          <div className="cat">
            <p>分类</p>
            <div className="wrap">
              {singerAreas.map(item => (
                <span
                  key={item.id}
                  className={cat[1] === item.id ? "active" : undefined}
                  onClick={() => handleChangeCat(singerCat[0] + item.id)}
                >
                  {item.type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default Select;
