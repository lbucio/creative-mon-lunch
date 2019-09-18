import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import "./leaderboard.scss";

import Crowning from "../../components/animations/crowning/crowning";

interface Props extends RouteComponentProps {}
const items = [
  {
    name: "Owen",
    score: "10%"
  },
  {
    name: "Owen",
    score: "10%"
  },
  {
    name: "Owen",
    score: "10%"
  },
  {
    name: "Owen",
    score: "10%"
  },
  {
    name: "Owen",
    score: "10%"
  },
  {
    name: "Owen",
    score: "10%"
  },
  {
    name: "Owen",
    score: "10%"
  }
];

const Leaderboard: React.FC<Props> = () => {
  const [clickedButton, setClickedButton] = useState(false);

  useEffect(() => {
  }, [clickedButton]);

  return (
    <section className="container">
      <h1>Leaderboard</h1>

      {clickedButton && (
        <div>
          <div>
            <Crowning clicked={clickedButton}/>
            <h2>Current Champ</h2>
          </div>
          <div className="leaderboard__item">
            <h3>Name</h3>
            <p>Score</p>
          </div>
          {items.map(item => (
            <div className="leaderboard__item">
              <h3>{item.name}</h3>
              <p>{item.score}</p>
            </div>
          ))}{" "}
        </div>
      )}
      <button onClick={() => setClickedButton(a => !a)} className="button">
        Who's the winner?
      </button>
    </section>
  );
};

export default Leaderboard;
