import React from "react";
import { RouteComponentProps } from "@reach/router";
import ReactSVG from "react-svg";

import "./monster.scss";

import monster from "./monster-girl.svg";

interface Props extends RouteComponentProps {}

const Monster: React.FC<Props> = () => {

  return (
    <ReactSVG
      src={monster}
      afterInjection={(error, svg) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(svg);
      }}
      beforeInjection={svg => {
        svg.classList.add("svg-class-name");
        svg.setAttribute("style", "width: 200px");
      }}
      fallback={() => <span>Error!</span>}
      loading={() => <span>Loading</span>}
      renumerateIRIElements={false}
      wrapper="span"
      className="wrapper-class-name"
      onClick={() => {
        console.log("wrapper onClick");
      }}
    />
  );
};

export default Monster;
