import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";

import getNextGuess from "../../utils/guess-machine.js";

import "./home.scss";

import ant from "../../assets/monster.svg";

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
        <img
          className={`home__mascot ${
            animating ? "home__mascot--animating" : ""
          }`}
          src={ant}
          alt="mascot"
        />
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
