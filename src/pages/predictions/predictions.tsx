import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";

import data from "../../data/historical";

import "./predictions.scss";

interface Props extends RouteComponentProps {
  prediction?: string;
}

const Predictions: React.FC<Props> = () => {
  let total = 0;
  const guesses = data.map(week => {
    const correct = week.Emilie === week.Actual;
    if (correct) {
      total += 1;
    }
    return {
      date: week.Date,
      prediction: week.Emilie,
      actual: week.Actual,
      correct
    };
  });

  const percent = total / data.length;
  const inverse = 1 - percent;

  const [circle, setCircle] = useState(44);

  useEffect(() => {
    setTimeout(() => {
      setCircle(44 * inverse);
    }, 300);
  }, []);

  return (
    <main className="container">
      <section className="prediction">
        <h1>Predictions</h1>
        <div>
          {Math.floor(percent * 100)}%{" "}
          <svg className="predictions__ring" height="20" width="20">
            <circle
              className="predictions__ring-circle"
              style={{ strokeDashoffset: circle }}
              strokeWidth="5"
              stroke="green"
              fill="transparent"
              r="7"
              cx="10"
              cy="10"
            />
          </svg>
        </div>
        <p>
          {total} / {data.length}
        </p>
        <div className="prediction__item">
          <p className="prediction__item--large">Guess</p>
          <p className="prediction__item--small align-center">Result</p>
          <p className="prediction__item--large">Actual</p>
          <p className="prediction__item--small">Date</p>
        </div>
        {guesses.reverse().map((guess: any) => (
          <div key={guess.date} className="prediction__item">
            <h3 className="prediction__item--large">
              {guess.prediction || "??????"}
            </h3>
            <i className="prediction__item--small align-center">
              {guess.correct ? "✨" : "❌"}
            </i>
            <h3 className="prediction__item--large">{guess.actual}</h3>
            <p className="prediction__item--small  align-right">{guess.date}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Predictions;
