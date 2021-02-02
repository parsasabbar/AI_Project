import React, { useEffect, useState } from "react";
import { IBoxType } from "./GameTableTypes";
import styles from "./GameTable.module.scss";
import { FaTimes } from "react-icons/fa";
import { FiCircle } from "react-icons/fi";
import { whichTurn, XO } from "../../infrastructures/TicTacToeGameTypes";
import TicTacToeGame from "../../infrastructures/TicTacToeGame";
import { xor } from "lodash";

function GameTable() {
  const [boxes, setBoxes] = useState([
    { id: 0, value: XO.EMPTY },
    { id: 1, value: XO.EMPTY },
    { id: 2, value: XO.EMPTY },
    { id: 3, value: XO.EMPTY },
    { id: 4, value: XO.EMPTY },
    { id: 5, value: XO.EMPTY },
    { id: 6, value: XO.EMPTY },
    { id: 7, value: XO.EMPTY },
    { id: 8, value: XO.EMPTY },
  ] as IBoxType[]);
  const [buttonText, setButtonText] = useState("restart");
  const [gameManager] = useState(new TicTacToeGame());
  const [lockBoxes, setLockBoxes] = useState({
    lock: false,
    message: "boxes locked",
  });
  const [boxDancerColor, setBoxDancerColor] = useState("");
  const [winnerMessage, setWinnerMessage] = useState(null);

  //methods
  const convertXOtoIBoxType = (input: XO[][]): IBoxType[] => {
    let boxType = [] as IBoxType[];
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input.length; j++) {
        boxType.push({ id: 3 * i + j, value: input[i][j] });
      }
    }
    return boxType;
  };

  //event handlers
  const onClickDivHandler = (id: number, disabled: boolean) => {
    if (disabled || lockBoxes.lock) return;
    if (gameManager.turn === whichTurn.HUMAN) {
      let output = gameManager.humanMove(Math.floor(id / 3), id % 3);
      let iboxTypeOutput = convertXOtoIBoxType(output);
      setBoxes(iboxTypeOutput);
      if (gameManager.checkForWinner(output) !== null) {
        setLockBoxes({ lock: true, message: "you win" });
      }

      output = gameManager.computerMove();
      iboxTypeOutput = convertXOtoIBoxType(output);
      setBoxes(iboxTypeOutput);
      if (gameManager.checkForWinner(output) !== null) {
        setLockBoxes({ lock: true, message: "computer wins" });
      }
    }
  };
  const onRestartClickHandler = () => {
    setBoxDancerColor("reloading");
    gameManager.startGame();
    setLockBoxes({ lock: false, message: "" });
    setBoxes(convertXOtoIBoxType(gameManager.box));
  };

  //useeffects

  useEffect(() => {
    gameManager.startGame();
    setBoxDancerColor(styles.box_dance_color);
    // let m = gameManager.alphaBetaAlgorithm(
    //   [
    //     [XO.EMPTY, XO.EMPTY, XO.O],
    //     [XO.EMPTY, XO.O, XO.EMPTY],
    //     [XO.EMPTY, XO.EMPTY, XO.X],
    //   ],
    //   -Infinity,
    //   +Infinity,
    //   whichTurn.COMPUTER,
    //   true
    // );
    // gameManager.alphaBetaAlgorithm(
    //   [
    //     [XO.EMPTY, XO.X, XO.O],
    //     [XO.O, XO.X, XO.EMPTY],
    //     [XO.O, XO.EMPTY, XO.EMPTY],
    //   ],
    //   -Infinity,
    //   +Infinity,
    //   whichTurn.COMPUTER,
    //   true
    // );
    // console.log(gameManager.getFinalBox(gameManager.choices));
    //console.log(gameManager.choices.sort((item) => item.value));
  }, []);
  useEffect(() => {
    if ("reloading") {
      setBoxDancerColor(styles.box_dance_color);
    }
  }, [boxDancerColor]);
  useEffect(() => {
    if (lockBoxes.lock === true) {
      alert(lockBoxes.message);
    }
  }, [lockBoxes]);

  return (
    <div className={styles.game_table}>
      <div className={styles.table}>
        {boxes.map((item) => (
          <div
            id={item.id.toString()}
            key={item.id}
            onClick={() =>
              onClickDivHandler(item.id, item.value === XO.EMPTY ? false : true)
            }
            className={boxDancerColor}
            style={{ animationDelay: `${item.id * 0.1}s` }}
          >
            {item.value === XO.X ? (
              <FaTimes />
            ) : item.value === XO.O ? (
              <FiCircle />
            ) : null}
          </div>
        ))}
      </div>
      <div className={styles.restart}>
        <div></div>
        <button onClick={onRestartClickHandler}>{buttonText}</button>
      </div>
    </div>
  );
}

export default GameTable;
