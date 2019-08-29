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

// const encode = (arg: string) => {
//   const array = arg.split("").map(x => x.charCodeAt(0) / 255);
//   return array.reduce((value: number, current: number) => {
//     value += current;
//     return value / array.length;
//   }, 0);
// };

const trainingData = data.map((week: any, i) => {
  const day = parseInt(week.Date.split("/")[1]);
  // const weekNumber = Math.round(day / 7);
  // const output: netValue = {};
  let previous = "Zupas";
  if (i > 0) {
    previous = data[i - 1].Actual;
  }
  const actual = week.Actual.toLocaleLowerCase();

  // output = actual;
  // const input = {  };

  return {
    input: previous,
    output: actual
  };
});

console.log(trainingData);

const net = new brain.recurrent.LSTM();

// create configuration for training
const config = {
  iterations: 300,
  log: true,
  logPeriod: 50,
  layers: [10]
};

net.train(trainingData, config);

const Predictions: React.FC<Props> = () => {
  const previousWeekActual = data[data.length - 1].Actual.toLowerCase();
  const output = net.run("zupas");
  console.log(output);
  // const [weekNumber, setWeekNumber] = useState(0);
  // const [guesses, setGuesses] = useState(net.run(previousWeekActual));
  // const [sortedGuesses, setSortedGuesses] = useState(
  //   Object.keys(guesses).sort((a, b) => guesses[b] - guesses[a])
  // );

  // useEffect(() => {
  //   if (weekNumber >= 0) {
  //     setGuesses(
  //       net.run({
  //         weekNumber: weekNumber
  //       })
  //     );
  //   }
  // }, [weekNumber]);

  // useEffect(() => {
  //   setSortedGuesses(
  //     Object.keys(guesses).sort((a, b) => guesses[b] - guesses[a])
  //   );
  // }, [guesses]);

  return (
    <section className="predictions">
      <h1>Predictions</h1>
      {/* <input
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
      ))} */}
    </section>
  );
};

export default Predictions;
