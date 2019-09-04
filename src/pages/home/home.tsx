import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import brain from "brain.js";

import data from "../../data/historical";

import "./home.scss";

import ant from "../../assets/ant.svg";

interface netValue {
  [key: string]: number;
}

const count: netValue = {};

const trainingData = data.map((week: any, i) => {
  const rotationNumber = i % 6;
  const output: netValue = {};
  const actual = week.Actual.toLowerCase();

  output[actual] = 1;
  count[actual] = count[actual] ? count[actual] + 1 : 1;
  const input = { rotationNumber };

  return {
    input,
    output
  };
});

const filteredData = trainingData.filter(
  // only keep results that have happened more than twice
  week => count[Object.keys(week.output)[0]] > 2
);

const net = new brain.NeuralNetwork();

net.train(filteredData);

interface Guess {
  name: string;
  chance: number;
}

interface Props extends RouteComponentProps {}

const Home: React.FC<Props> = () => {
  const [guess, setGuess] = useState<null | Guess>(null);
  const [animating, setAnimating] = useState(false);

  const rotationNumber = data.length % 6;

  const calculateGuess = (delay: number) => {
    if (!animating) {
      setGuess(null);
      const guesses = net.run({ rotationNumber }) as any;
      const sorted = Object.keys(guesses).sort(
        (a, b) => guesses[b] - guesses[a]
      );
      setAnimating(true);
      setTimeout(() => {
        const guess = sorted[0];
        setAnimating(false);
        setGuess({ name: guess, chance: guesses[guess] });
      }, delay * 1000);
    }
  };

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  return (
    <main className="home">
      <div className="home__main">
        <div className="home__speech">
          {!guess && !animating ? "Hello..." : ""}
          {animating ? "Hmmmmm...." : ""}
          {guess
            ? `My guess is ${guess.name}! I'm like ${(
                guess.chance * 100
              ).toFixed(0)}% sure.`
            : ""}
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
          onClick={() => calculateGuess(getRandomNumber(2, 5))}
        >
          {animating ? "Thinking..." : "Guess"} {guess ? "again" : ""}
        </button>
      </div>
    </main>
  );
};

export default Home;
