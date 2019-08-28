import React from "react";
import { RouteComponentProps } from "@reach/router";
import "./leaderboard.scss";

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
  return (
    <section>
      <h1>Leaderboard</h1>
      <div>
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
      ))}
    </section>
  );
};

export default Leaderboard;
