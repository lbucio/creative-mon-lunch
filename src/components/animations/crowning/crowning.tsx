import React from "react";
import { RouteComponentProps } from "@reach/router";

import { useSpring, animated } from 'react-spring'

import "./crowning.scss";
import crown from "./crown.svg";

import emilie from "../../../assets/people/emilie-knecht.png"

interface Props extends RouteComponentProps {}

function Crowning() {
  const { top, opacity } = useSpring({
    opacity: 1,
    top: `-35px`
  })
  
  return <animated.img src={crown} className="crown" style={{ opacity, top }} />
}

const CrowningCeremony: React.FC<Props> = () => {

  return (
    <div className="svg-animation__container">
      <Crowning />
      <img src = {emilie} className="people" />
    </div>
  );
};

export default CrowningCeremony;
