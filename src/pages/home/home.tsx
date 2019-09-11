import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import Monster from '../../components/animations/monster/monster';
import Food from '../../components/animations/food/food';

import getNextGuess from "../../utils/guess-machine.js";

import "./home.scss";


interface Props extends RouteComponentProps {}

const Home: React.FC<Props> = () => {
  const [guess, setGuess] = useState<null | string>(null);
  const [animating, setAnimating] = useState(false);

  const startGuessGeneration = async () => {
    if (!animating) {
      setGuess(null);
      setAnimating(true);
      const guess = await getNextGuess();
      setGuess(guess);
      setAnimating(false);
    }
  };

  return (
    <main className="home">
      <div className="home__main">
        <div className="home__speech">
          {!guess && !animating ? "Hello..." : ""}
          {animating ? "Hmmmmm...." : ""}
          {guess ? `My guess is ${guess}!` : ""}
        </div>
        <Monster />
        <Food />
      </div>
      <div className="home__interactions">
        <button
          className="button button-primary"
          onClick={() => startGuessGeneration()}
        >
          {animating ? "Thinking..." : "Guess"} {guess ? "again" : ""}
        </button>
      </div>
    </main>
  );
};

export default Home;
