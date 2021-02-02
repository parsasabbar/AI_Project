import React, { useEffect, useState } from "react";
import { IBoxType } from "./GameTableTypes";
import styles from "./GameTable.module.scss";
import { FaTimes } from "react-icons/fa";
import { FiCircle } from "react-icons/fi";
import { BoxContent } from "../../infrastructures/n-queen/NQeenTypes";
import NQueen from "../../infrastructures/n-queen/NQueen";
import { promises } from "fs";

function GameTable() {
  // const defaultPlacement = [
  //   [
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //   ],
  //   [
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //   ],
  //   [
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //   ],
  //   [
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //   ],
  //   [
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //     BoxContent.QUEEN,
  //   ],
  //   [
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //   ],
  //   [
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //   ],
  //   [
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //     BoxContent.EMPTY,
  //   ],
  // ] as BoxContent[][];

  // const defaultPlacement = [
  const [buttonText, setButtonText] = useState("place random queens");
  const defaultPlacement = [
    [BoxContent.QUEEN, BoxContent.QUEEN, BoxContent.QUEEN, BoxContent.QUEEN],
    [BoxContent.QUEEN, BoxContent.QUEEN, BoxContent.QUEEN, BoxContent.QUEEN],
    [BoxContent.QUEEN, BoxContent.QUEEN, BoxContent.QUEEN, BoxContent.QUEEN],
    [BoxContent.QUEEN, BoxContent.QUEEN, BoxContent.QUEEN, BoxContent.QUEEN],
  ] as BoxContent[][];

  const [boxes, setBoxes] = useState(defaultPlacement);
  const [lockBoxes, setLockBoxes] = useState({
    lock: false,
    message: "boxes locked",
  });
  const [boxDancerColor, setBoxDancerColor] = useState(styles.box_dance_color);
  const repeat = 20;

  //event handlers
  // new Promise((resolve, reject) => {
  //   let tempOuput = new NQueen(defaultPlacement, repeat).start();
  //   resolve(tempOuput);
  // }).then((res) => console.log(res));
  const onRestartClickHandler = () => {
    setBoxDancerColor("changing");

    new Promise((resolve, reject) => {
      console.log("bbb");
      // for (let i = 0; i < 1000000; i++) {
      //   console.log("");
      // }
      resolve("a");

      console.log("kkkk");
    }).then(() => {
      console.log("bbb");
    });
    console.log("aaaa");
  };

  //useeffects
  useEffect(() => {
    let tempOuput = new NQueen(boxes, repeat).start();
    setBoxes(tempOuput);
    setBoxDancerColor("changing");
  }, []);
  useEffect(() => {
    if (boxDancerColor === "changing") {
      setBoxDancerColor(styles.box_dance_color);
      setTimeout(() => {
        setBoxDancerColor("calm");
      }, 1000);
    }
  }, [boxDancerColor]);

  return (
    <div className={styles.game_table}>
      <div className={styles.table}>
        {boxes.map((item, i) =>
          item.map((value, j) => (
            <div
              id={`${i}-${j}`}
              key={`${i}-${j}`}
              className={boxDancerColor}
              style={{ animationDelay: `${((i + j) / 8) * 0.1}s` }}
            >
              {value === BoxContent.QUEEN ? (
                <img src={require("../../assets/images/chess.svg").default} />
              ) : null}
            </div>
          ))
        )}
      </div>
      <div className={styles.restart}>
        <div></div>
        <button onClick={onRestartClickHandler}>{buttonText}</button>
      </div>
    </div>
  );
}

export default GameTable;
