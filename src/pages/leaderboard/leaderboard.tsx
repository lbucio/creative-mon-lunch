import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import "./leaderboard.scss";
import GoogleSheetsService from "../../utils/google-sheets-service";

import Crowning from "../../components/animations/crowning/crowning";

interface Props extends RouteComponentProps {}

const TEAM_MEMBERS = [
  { name: "Erin", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Zach", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Rachel", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Micaela", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Caleb", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Emilie", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Owen", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Dax", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Matt", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Beto", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Lars", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Emily", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Ether", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Scott", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
  { name: "Brady", data: [], score: 0, img: '../../../assets/people/emilie-knecht.png' },
];

const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

const GOOGLE_SHEET_OFFSET = 3;

const getData = async (column): Promise<string[] | undefined> => {
  try {
    const googleSheetService = new GoogleSheetsService();
    const sheetId = "1TjC2G4OJowhARGp7dtvs1gj0Ws11K4tyO5yI5emNVWA";
    const query = `select+A,${column}`;
    const response = await googleSheetService.getSheet(sheetId, query);
    const data: string[] = response.map(row => row[1]).filter(Boolean);
    return new Promise(resolve => {
      resolve(data);
    });
  } catch (error) {
    return new Promise(resolve => {
      resolve(undefined);
    });
  }
};


const getAllLunchGuesses = async () => {
  TEAM_MEMBERS.map((member, i) => {
    i += GOOGLE_SHEET_OFFSET;
    const data = getData(ALPHABET[i]);
    // TODO: This is where it needs to be hooked up
    // make sure the sheet returns blanks
    // set the member.data = data returned from the promise

    // member.data = data;
    console.log(member);
    console.log(data);
  });
};

const getActualLunch = async () => {
  return await getData('B');
}

const getScores = () => {
  const ACTUAL_PLACES = getActualLunch();
  const REVERSE_ORDER = ACTUAL_PLACES.reverse();
  let numberRight = 0;
  TEAM_MEMBERS.map((member, i) => {
    for(let i = 0; i <=6; i++) {
      if (member.data.reverse[i] === REVERSE_ORDER[i]) {
        numberRight ++;
      }
    }
    member.score = numberRight/6;
  })
}

const getWinners = () => {
  TEAM_MEMBERS.sort((a, b) => (a.score > b.score) ? 1 : -1);
  const WINNERS = TEAM_MEMBERS.slice(0, 3);
  return WINNERS;
}

getAllLunchGuesses();
getScores();


const Leaderboard: React.FC<Props> = () => {
  const [clickedButton, setClickedButton] = useState(false);

  useEffect(() => {}, [clickedButton]);

  return (
    <section className="container">
      <h1>Leaderboard</h1>

      {clickedButton && (
        <div>
          <div>
            <Crowning clicked={clickedButton} winners={getWinners()}/>
            <h2>Current Champ</h2>
          </div>
          <div className="leaderboard__item">
            <h3>Name</h3>
            <p>Score</p>
          </div>
          {TEAM_MEMBERS.map(member => (
            <div className="leaderboard__item">
              <h3>{member.name}</h3>
              <p>{member.score}</p>
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
