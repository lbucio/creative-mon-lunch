import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import Monster from '../../components/animations/monster/monster';
import Food from '../../components/animations/food/food';
import GoogleSheetsService from '../../utils/google-sheets-service';

import getNextGuess from "../../utils/guess-machine.js";

import "./home.scss";


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
    const lunchData = await getLunchData();
    if (!animating) {
      setGuess(null);
      setSeeFood(false);
      setAnimating(true);
      const guess = await getNextGuess(lunchData);
      setGuess(guess);
      setSeeFood(true);
      setAnimating(false);
    }
  };

  return (
    <main className={`${pageName}`}>
      <div className={`${pageName}-monster__container  container`}>
        <div className={`${pageName}-monster__thought`}>
          {!guess && !animating ? "Hi! What brings you here?" : ""}
          {animating ? "Lemme think about this. It's quite possible it's Zao." : ""}
          {guess ? `I'm in the mood for ${guess}!` : ""}
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
