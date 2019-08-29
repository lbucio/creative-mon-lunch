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

const count: netValue = {};

const trainingData = data.map((week: any, i) => {
  const rotationNumber = i % 6;
  const output: netValue = {};
  const actual = week.Actual.toLocaleLowerCase();

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

const Predictions: React.FC<Props> = () => {
  const [rotationNumber, setRotationNumber] = useState(data.length % 6);
  const [guesses, setGuesses] = useState(net.run({ rotationNumber }));
  const [sortedGuesses, setSortedGuesses] = useState(
    Object.keys(guesses).sort((a, b) => guesses[b] - guesses[a])
  );

  useEffect(() => {
    if (rotationNumber >= 0) {
      setGuesses(
        net.run({
          rotationNumber
        })
      );
    }
  }, [rotationNumber]);

  useEffect(() => {
    setSortedGuesses(
      Object.keys(guesses).sort((a, b) => guesses[b] - guesses[a])
    );
  }, [guesses]);

  return (
    <section className="predictions">
      <h1>Predictions</h1>
      <input
        className="predictions__input-number"
        type="number"
        onChange={e => setRotationNumber(parseInt(e.target.value))}
        value={rotationNumber}
        min={0}
        max={5}
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
