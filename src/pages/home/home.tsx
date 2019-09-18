import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import Monster from '../../components/animations/monster/monster';
import Food from '../../components/animations/food/food';
import GoogleSheetsService from '../../utils/google-sheets-service';

import getNextGuess from "../../utils/guess-machine.js";

import "./home.scss";
import { Observable } from "rxjs";

interface Guess {
  guess: string;
  epoch: number;
}

interface Props extends RouteComponentProps {}

const Home: React.FC<Props> = () => {
  const [guess, setGuess] = useState<null | string>(null);
  const [animating, setAnimating] = useState(false);
  const [seeFood, setSeeFood] = useState(false);

  const pageName="home"

  const getLunchData = async (): Promise<string[] | undefined> => {
    try {
      const googleSheetService = new GoogleSheetsService();
      const sheetId = '1TjC2G4OJowhARGp7dtvs1gj0Ws11K4tyO5yI5emNVWA';
      const query = "select+A,B";
      const response = await googleSheetService.getSheet(sheetId, query);
      const data: string[] = response.map(row => row[1]).filter(Boolean);
      return new Promise(resolve => {
        resolve(data);
      })
    } catch (error) {
      return new Promise(resolve => {
        resolve(undefined);
      })
    }
  };

  const startGuessGeneration = async () => {
    if (!animating) {
      setGuess(null);
      setSeeFood(false);
      setAnimating(true);
      const lunchData = await getLunchData();
      const observable: Observable<Guess> = await getNextGuess(lunchData);
      observable.subscribe({
        next(value) {
          if (value.epoch % 5 === 0) {
            setGuess(value.guess);
          }
        },
        error(err) {
          console.error('something wrong occurred: ' + err);
        },
        complete() {
          setSeeFood(true);
          setAnimating(false);
        }})
    }
  };

  return (
    <main className={`${pageName}`}>
      <div className={`${pageName}-monster__container  container`}>
        <div className={`${pageName}-monster__thought`}>
          {!guess && !animating ? "Hi! What brings you here?" : ""}
          {animating && !guess ? `Let me see if I can guess what lunch will be this week...` : ""}
          {animating && guess ? `Hm it might be ${guess}!` : ""}
          {!animating && guess ? `I'm in the mood for ${guess}!` : ""}
          {seeFood && (
            <Food />
          )}
        </div>
        <Monster />
      </div>
      <div className="home__interactions  container">
        <button
          className="button button-primary"
          onClick={() => startGuessGeneration()}
        >
          {animating ? "Thinking..." : "What's for lunch?"} {guess ? "again" : ""}
        </button>
      </div>
    </main>
  );
};

export default Home;
