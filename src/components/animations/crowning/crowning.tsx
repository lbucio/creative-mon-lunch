import React, { useState, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
// import * as easings from 'd3-ease';

import { useSpring, animated, useTransition } from "react-spring";

import "./crowning.scss";
import medal from "./crown.svg";

import emilie from "../../../assets/people/emilie-knecht.png";

interface Props {
  clicked: boolean;
}

const CrowningCeremony = (clicked: Props) => {
  const fade = useTransition(clicked, null, {
    from: { position: "relative", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const podiumTransitionThird = useSpring({
    to: { size: '25px', background: 'red' },
    from: { size: '0%', background: 'white' }
  })

  const podiumTransitionFirst = useSpring({
    to: { size: '75px', background: 'red' },
    from: { size: '0%', background: 'white' }
  })

  const podiumTransitionSecond = useSpring({
    to: { size: '50px', background: 'red' },
    from: { size: '0%', background: 'white' }
  })

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
                  src={emilie}
                  className="people"
                />
              </>
            )
        )}

      <animated.div style={podiumTransitionThird} className="third-podium">3</animated.div>
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
                  src={emilie}
                  className="people"
                />
              </>
            )
        )}
        <animated.div style={podiumTransitionFirst} className="first-podium">1</animated.div>
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
                  src={emilie}
                  className="people"
                />
              </>
            )
        )}
        <animated.div style={podiumTransitionSecond} className="second-podium">2</animated.div>
      </div>
    </div>
  );
};

export default CrowningCeremony;
