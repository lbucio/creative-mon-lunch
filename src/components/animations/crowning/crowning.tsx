import React, { useState, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
// import * as easings from 'd3-ease';

import { useSpring, animated, useTransition } from "react-spring";

import "./crowning.scss";
import medal from "./crown.svg";

import emilie from "../../../assets/people/emilie-knecht.png";

interface Props {
  clicked: boolean;
  winners: object[];
}

const CrowningCeremony = (clicked: Props) => {
  const fade = useTransition(clicked, null, {
    from: { position: "relative", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const podiumTransitionThird = useSpring({
    from: { height: '0px', bottom: '0%', background: 'white' },
    to: async next => {
      while (1) {
        await next({ height: '99px', bottom: '50%', background: 'white' })
      }
    },
  });

  const podiumTransitionSecond = useSpring({
    from: { height: '0px', bottom: '0%', background: 'white' },
    to: async next => {
      while (1) {
        await next({ height: '66px', bottom: '50%', background: 'white' })
      }
    },
  });

  const podiumTransitionFirst = useSpring({
    from: { height: '0px', bottom: '0%', background: 'white' },
    to: async next => {
      while (1) {
        await next({ height: '33px', bottom: '50%', background: 'white' })
      }
    },
  });

  return (
    <div className="podium">
      <div className="third-place">
        {fade.map(
          ({ item, key, props }) =>
            item && (
              <>
                <animated.img
                  src={medal}
                  key={key}
                  style={props}
                  className="medal"
                />
                <animated.img
                  key={key}
                  style={props}
                  src={winners[2].img}
                  className="people people__third"
                />
              </>
            )
        )}
        <div className="podium__container">
          <animated.div style={podiumTransitionThird} className="podium__third" />
          <p className="podium__number">3</p>
        </div>
      </div>
      <div className="first-place">
        {fade.map(
          ({ item, key, props }) =>
            item && (
              <>
                <animated.img
                  src={medal}
                  key={key}
                  style={props}
                  className="medal"
                />
                <animated.img
                  key={key}
                  style={props}
                  src={winners[0].img}
                  className="people people__first"
                />
              </>
            )
        )}
        <div className="podium__container">
          <animated.div style={podiumTransitionFirst} className="podium__first" />
          <p className="podium__number">1</p>
        </div>
      </div>
      <div className="second-place">
        {fade.map(
          ({ item, key, props }) =>
            item && (
              <>
                <animated.img
                  src={medal}
                  key={key}
                  style={props}
                  className="medal"
                />
                <animated.img
                  key={key}
                  style={props}
                  src={winners[1].img}
                  className="people people__second"
                />
              </>
            )
        )}
        <div className="podium__container">
          <animated.div style={podiumTransitionSecond} className="podium__second" />
          <p className="podium__number">2</p>
        </div>
      </div>
    </div>
  );
};

export default CrowningCeremony;
