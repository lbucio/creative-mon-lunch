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

const encode = (arg: string) => {
  const array = arg.split("").map(x => x.charCodeAt(0) / 255);
  return array.reduce((value: number, current: number) => {
    value += current;
    return value / array.length;
  }, 0);
};

const trainingData = data.map((week: any, i) => {
  const day = parseInt(week.Date.split("/")[1]);
  const weekNumber = Math.round(day / 7);
  const output: netValue = {};
  let previous = "Zupas";
  if (i > 0) {
    previous = data[i - 1].Actual;
  }
  const actual = week.Actual.toLocaleLowerCase();

  output[actual] = 1;
  const input = { weekNumber, previous: encode(previous) };

  return {
    input,
    output
  };
});

console.log(trainingData);

const net = new brain.NeuralNetwork();

net.train(trainingData);

const Predictions: React.FC<Props> = ({ prediction }) => {
  const previousWeekActual = data[data.length - 1].Actual.toLowerCase();
  const [weekNumber, setWeekNumber] = useState(0);
  const [guesses, setGuesses] = useState(
    net.run({ weekNumber, previous: encode(previousWeekActual) })
  );
  const [sortedGuesses, setSortedGuesses] = useState(
    Object.keys(guesses).sort((a, b) => guesses[b] - guesses[a])
  );

  useEffect(() => {
    if (weekNumber >= 0) {
      setGuesses(
        net.run({
          weekNumber: weekNumber
        })
      );
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
        className="predictions__input"
        type="number"
        onChange={e => setWeekNumber(parseInt(e.target.value))}
        value={weekNumber}
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
