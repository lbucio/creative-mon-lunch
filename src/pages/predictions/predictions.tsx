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
    const correct = week.Erin === week.Actual;
    if (correct) {
      total += 1;
    }
    return {
      date: week.Date,
      prediction: week.Erin,
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
    <section className="predictions">
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
      <div className="predictions__item">
        <p>Guess</p>
        <p>Result</p>
        <p>Actual</p>
        <p>Date</p>
      </div>
      {guesses.map((guess: any) => (
        <div key={guess.date} className="predictions__item">
          <h3>{guess.prediction || "??????"}</h3>
          <i>{guess.correct ? "✨" : "❌"}</i>
          <h3>{guess.actual}</h3>
          <p>{guess.date}</p>
        </div>
      ))}
    </section>
  );
};

export default Predictions;
