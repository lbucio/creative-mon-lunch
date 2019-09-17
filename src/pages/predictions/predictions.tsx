import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { useSprings, animated, interpolate } from "react-spring";
import { useGesture } from "react-use-gesture";

import data from "../../data/historical";

import "./predictions.scss";

import bostonDeli from "../../assets/logos/boston-deli.jpeg";
import cafeRio from "../../assets/logos/cafe-rio.jpg";
import chickFilA from "../../assets/logos/chick-fil-a.png";
import foodTime from "../../assets/logos/food-time.png";
import goodwood from "../../assets/logos/goodwood.png";
import gourmandise from "../../assets/logos/gourmandise.png";
import macaroniGrill from "../../assets/logos/macaroni-grill.jpg";
import marvelousCatering from "../../assets/logos/marvelous-catering.jpeg";
import meiersCatering from "../../assets/logos/meiers-catering.jpg";
import spitz from "../../assets/logos/spitz.jpeg";
import villageBaker from "../../assets/logos/village-baker.png";
import yummys from "../../assets/logos/yummys.png";
import zao from "../../assets/logos/zao.jpg";
import zupas from "../../assets/logos/zupas.png";
// random lunch choice
import lunch from "../../assets/logos/lunch-box.png";

interface Props extends RouteComponentProps {
  prediction?: string;
}

const logos = {
  "Boston Deli": bostonDeli,
  "Cafe Rio": cafeRio,
  "Chick-fil-a": chickFilA,
  "Food Time": foodTime,
  Goodwood: goodwood,
  Groumandise: gourmandise,
  "Macaroni Grill": macaroniGrill,
  "Marvelous Catering": marvelousCatering,
  "Meier's Catering": meiersCatering,
  Spitz: spitz,
  "Village Baker": villageBaker,
  "Yummy's Korean BBQ": yummys,
  Zao: zao,
  "Cafe Zupas": zupas
};

let totalCorrect = 0;

const cards = data.map(week => {
  const actual = week.Actual;
  const guess = week.Erin;
  const date = week.Date;
  if (actual === guess) {
    totalCorrect += 1;
  }
  return {
    actual,
    guess,
    date
  };
});

const to = (i: number) => ({
  x: -20,
  y: i * -2,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 10
});
const from = () => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r /
    10}deg) rotateZ(${r}deg) scale(${s})`;

const Predictions: React.FC<Props> = () => {
  const total = cards;

  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, set] = useSprings(cards.length, i => ({
    ...to(i),
    from: from()
  }));

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(
    ({ args: [index], down, delta: [xDelta], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      // @ts-ignore
      set((i: number) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });
      if (!down && gone.size === cards.length) {
        // @ts-ignore
        setTimeout(() => gone.clear() || set((i: number) => to(i)), 600);
      }
    }
  );

  return (
    <main>
      <section className="prediction">
        <div className="prediction__header">
          <h1>Predictions</h1>
          <h4>
            {totalCorrect} / {cards.length}
          </h4>
        </div>

        <div>
          {props.map(({ x, y, rot, scale }, i) => {
            const card = cards[i];
            const date = new Date(card.date);
            const actual = card.actual;
            const guess = card.guess;
            const correct = actual === guess;
            return (
              <animated.div
                className="prediction__parent"
                key={i}
                style={{
                  transform: interpolate(
                    [x, y],
                    (x, y) => `translate3d(${x}px, ${y}px, 0) `
                  )
                }}
              >
                <animated.div
                  className={`prediction__card ${
                    correct ? "prediction__card--correct" : ""
                  }`}
                  {...bind(i)}
                  style={{
                    transform: interpolate([rot, scale], trans)
                  }}
                >
                  <p className="prediction__date">
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  <div className="prediction__info">
                    <div className="prediction__actual">
                      <img
                        className="prediction__logo"
                        src={logos[actual] || lunch}
                        alt={actual}
                      />
                      <p>{actual}</p>
                    </div>
                    <div
                      className={`prediction__result ${
                        correct ? "predction__result--correct" : ""
                      }`}
                    />
                    {!correct ? (
                      <div className="prediction__guess">
                        <img
                          className="prediction__logo prediction__logo--small"
                          src={logos[guess] || lunch}
                          alt={guess}
                        />
                        <p>
                          I guessed: <span>{guess || "nothing :("}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="prediction__winner">
                        <h2 className="prediction__winner-text">
                          I GOT IT RIGHT!!!
                        </h2>
                      </div>
                    )}
                  </div>
                </animated.div>
              </animated.div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Predictions;
