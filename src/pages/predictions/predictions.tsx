import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import brain from "brain.js";

import data from "../../data/historical";

import "./predictions.scss";

interface netValue {
  [key: string]: number;
}

interface Props extends RouteComponentProps {
  prediction?: string;
}

const trainingData = data.map(week => {
  const day = parseInt(week.Date.split("/")[1]);
  const weekNumber = Math.round(day / 7);
  const output: netValue = {};
  output[week.Actual.toLocaleLowerCase()] = 1;
  return {
    input: { weekNumber },
    output
  };
});

const net = new brain.NeuralNetwork();

net.train(trainingData);

const Predictions: React.FC<Props> = ({ prediction }) => {
  const [weekNumber, setWeekNumber] = useState(0);
  const [guesses, setGuesses] = useState(net.run(weekNumber));
  const [sortedGuesses, setSortedGuesses] = useState(
    Object.keys(guesses).sort((a, b) => guesses[b] - guesses[a])
  );

  useEffect(() => {
    if (weekNumber >= 0) {
      setGuesses(net.run({ weekNumber }));
    }
  }, [weekNumber]);

  useEffect(() => {
    setSortedGuesses(
      Object.keys(guesses).sort((a, b) => guesses[b] - guesses[a])
    );
  }, [guesses]);

  return (
    <section className="predictions">
      <h1>Predictions</h1>
      <input
        type="number"
        onChange={e => setWeekNumber(parseInt(e.target.value))}
      />
      <div className="predictions__item">
        <h3>Guess</h3>
        <p>Probability</p>
      </div>
      {sortedGuesses.map((guess: any) => (
        <div key={guess} className="predictions__item">
          <h3>{guess}</h3>
          <h3>{(guesses[guess] * 100).toFixed(0)}%</h3>
        </div>
      ))}
    </section>
  );
};

export default Predictions;
