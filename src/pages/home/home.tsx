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
  const [seeFood, setSeeFood] = useState(false);

  const pageName="home"

  const startGuessGeneration = async () => {
    if (!animating) {
      setGuess(null);
      setSeeFood(false);
      setAnimating(true);
      const guess = await getNextGuess();
      setGuess(guess);
      setSeeFood(true);
      setAnimating(false);
    }
  };

  return (
    <main className={`${pageName}`}>
      <div className={`${pageName}-monster__container  container`}>
        <div className={`${pageName}-monster__thought`}>
          {!guess && !animating ? "Hi! What brings you here?" : ""}
          {animating ? "Lemme think about this. It's quite possible it's Zao." : ""}
          {guess ? `I'm in the mood for ${guess}!` : ""}
          {seeFood && (
            <Food />
          )}
        </div>
        <Monster />
      </div>
      <div className="home__interactions  container">
        <button
          className="button button-primary"
          onClick={() => startGuessGeneration()}
        >
          {animating ? "Thinking..." : "What's for lunch?"} {guess ? "again" : ""}
        </button>
      </div>
    </main>
  );
};

export default Home;
