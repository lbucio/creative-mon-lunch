import React from "react";
import { RouteComponentProps } from "@reach/router";

import { useSpring, animated as a } from 'react-spring'
import { useGesture } from "react-with-gesture";
import clamp from "lodash-es/clamp";

import "./food.scss";
import taco from "./taco.svg";

interface Props extends RouteComponentProps {}

interface test1 {
  xy: any;
}

function Food() {
  const [{ xy }, set] = useSpring<test1>(() => ({ xy: [0, 0] }))
  const bind = useGesture(({ down, delta, velocity }) => {
    velocity = clamp(velocity, 1, 8)
    set({ xy: down ? delta : [0, 0], config: { mass: velocity } })
  })
  // return <a.div {...bind()} className="food" style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }} />
  return <a.img src={taco} {...bind()} className="food" style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`) }} />
}

const Monster: React.FC<Props> = () => {

  return (
    <div className="svg-animation__container">
      <Food />
    </div>
  );
};

export default Food;
