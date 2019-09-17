import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTransition, animated } from "react-spring";

import Monster from "../../components/animations/monster/monster";
import Food from "../../components/animations/food/food";

import getNextGuess from "../../utils/guess-machine.js";

import "./home.scss";

interface TempGuess {
  key: number;
  guess: string;
}

interface Props extends RouteComponentProps {}

const Home: React.FC<Props> = () => {
  const [guess, setGuess] = useState<null | string>(null);
  const [thinking, setThinking] = useState(false);
  const [seeFood, setSeeFood] = useState(false);
  const [tempGuesses, setTempGuesses] = useState<Array<TempGuess>>([]);

  const thoughtTransitions = useTransition(tempGuesses, temp => temp.key, {
    from: { transform: "translate3d(0px,0px,0) scale(0)", opacity: 0 },
    enter: { transform: "translate3d(100px,-100px,0) scale(1)", opacity: 1 },
    leave: { transform: "translate3d(0px,0px,0) scale(0)", opacity: 0 }
  });

  const pageName = "home";

  const showEpochGuess = ((event: CustomEvent) => {
    tempGuesses.push({ guess: event.detail.guess, key: tempGuesses.length });
    setTempGuesses([...tempGuesses]);
  }) as EventListener;

  useEffect(() => {
    window.addEventListener("epochFinished", e => showEpochGuess(e));

    return () => {
      window.removeEventListener("epochFinished", e => showEpochGuess(e));
    };
  }, []);

  const startGuessGeneration = async () => {
    if (!thinking) {
      setGuess(null);
      setThinking(true);
      const guess = await getNextGuess();
      setGuess(guess);
      setSeeFood(true);
      setThinking(false);
    }
  };

  return (
    <main className={`${pageName}`}>
      <div className={`${pageName}-monster__container  container`}>
        {thoughtTransitions.map(({ item, props, key }) => {
          return (
            <animated.div
              key={key}
              className={`${pageName}-monster__thought`}
              style={props}
            >
              {item.guess}
            </animated.div>
          );
        })}
        {/* {!thinking && (
          <div className={`${pageName}-monster__speech`}>
            {!guess && !thinking ? "Hi! What brings you here?" : ""}
            {thinking
              ? "Lemme think about this. It's quite possible it's Zao."
              : ""}
            {guess ? `I'm in the mood for ${guess}!` : ""}
            {seeFood && <Food />}
          </div>
        )} */}
        <Monster />
      </div>
      <div className="home__interactions  container">
        <button
          className="button button-primary"
          onClick={() => startGuessGeneration()}
        >
          {thinking ? "Thinking..." : "What's for lunch?"}{" "}
          {guess ? "again" : ""}
        </button>
      </div>
    </main>
  );
};

export default Home;
