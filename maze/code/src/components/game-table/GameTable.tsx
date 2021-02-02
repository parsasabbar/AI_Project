import React, { useEffect, useState } from "react";
import { IBoxType } from "./GameTableTypes";
import styles from "./GameTable.module.scss";
import { FaTimes } from "react-icons/fa";
import { FiCircle } from "react-icons/fi";
import { MapContent, I_J } from "../../infrastructures/n-queen/MazeTypes";
import Maze from "../../infrastructures/n-queen/Maze";

function GameTable() {
  const [map, setMap] = useState([] as IBoxType[][]);
  const [buttonText, setButtonText] = useState("hardcode for change barriers");
  const [answerPath, setAnswerPath] = useState([] as I_J[]);
  const [lockBoxes, setLockBoxes] = useState({
    lock: false,
    message: "boxes locked",
  });
  const [boxDancerColor, setBoxDancerColor] = useState("");

  //methods
  const hasBorder = (
    direction: "top" | "right" | "bottom" | "left",
    id: string
  ): boolean => {
    const { i, j } = get_i_j(id);

    switch (direction) {
      case "top":
        return map[i - 1][j].value === MapContent.Barrier ? true : false;
      case "right":
        return map[i][j + 1].value === MapContent.Barrier ? true : false;
      case "bottom":
        return map[i + 1][j].value === MapContent.Barrier ? true : false;
      case "left":
        return map[i][j - 1].value === MapContent.Barrier ? true : false;
      default:
        return false;
    }
  };
  const get_i_j = (id: string): I_J => {
    let array = id.split("-");
    return { i: parseInt(array[0]), j: parseInt(array[1]) };
  };

  //event handlers
  const onRestartClickHandler = () => {};

  //useeffects
  useEffect(() => {
    const n = 6;
    let tempMap = [] as IBoxType[][];
    let map_n = 2 * n + 1;
    for (let i = 0; i < map_n; i++) {
      let row = [] as IBoxType[];

      if (i === 0 || i === map_n - 1) {
        for (let j = 0; j < map_n; j++) {
          row.push({ id: `${i}-${j}`, value: MapContent.Barrier });
        }
        tempMap.push(row);
        continue;
      }

      //put even rows
      if (i % 2 === 0) {
        for (let j = 0; j < map_n; j++) {
          if (j === 0 || j === map_n - 1) {
            row.push({ id: `${i}-${j}`, value: MapContent.Barrier });

            continue;
          }
          row.push(
            { id: `${i}-${j}`, value: MapContent.EMPTY }
            // { id: "", value: MapContent.Box }
          );
        }
        tempMap.push(row);
      }
      //put odd rows
      else {
        for (let j = 0; j < map_n; j++) {
          if (j === 0 || j === map_n - 1) {
            row.push({ id: `${i}-${j}`, value: MapContent.Barrier });
            continue;
          }
          if (j % 2 === 0) {
            row.push(
              { id: `${i}-${j}`, value: MapContent.EMPTY }
              // { id: "", value: MapContent.Box }
            );
          } else {
            row.push(
              { id: `${i}-${j}`, value: MapContent.Box }
              // { id: "", value: MapContent.Box }
            );
          }
        }
        tempMap.push(row);
      }
    }
    console.log(tempMap);
    // //open and close gates
    // tempMap[1][0].value = MapContent.EMPTY;
    // tempMap[7][8].value = MapContent.EMPTY;

    // //insert barriers
    // tempMap[3][2].value = MapContent.Barrier;
    // tempMap[5][2].value = MapContent.Barrier;
    // tempMap[7][2].value = MapContent.Barrier;

    // //open and close gates
    // tempMap[1][0].value = MapContent.EMPTY;
    // tempMap[9][10].value = MapContent.EMPTY;

    // // //insert barriers
    // tempMap[2][3].value = MapContent.Barrier;
    // tempMap[2][5].value = MapContent.Barrier;
    // tempMap[2][7].value = MapContent.Barrier;
    // tempMap[2][9].value = MapContent.Barrier;
    // tempMap[2][11].value = MapContent.Barrier;
    // tempMap[2][13].value = MapContent.Barrier;
    // tempMap[2][15].value = MapContent.Barrier;
    // tempMap[2][17].value = MapContent.Barrier;
    // tempMap[2][19].value = MapContent.Barrier;
    // tempMap[3][2].value = MapContent.Barrier;
    // tempMap[5][2].value = MapContent.Barrier;
    // // //
    // tempMap[10][1].value = MapContent.Barrier;
    // tempMap[10][3].value = MapContent.Barrier;
    // tempMap[10][5].value = MapContent.Barrier;
    // tempMap[10][7].value = MapContent.Barrier;
    // tempMap[10][9].value = MapContent.Barrier;
    // tempMap[10][11].value = MapContent.Barrier;
    // tempMap[10][13].value = MapContent.Barrier;

    // //open and close gates
    tempMap[1][12].value = MapContent.EMPTY;
    tempMap[12][1].value = MapContent.EMPTY;

    tempMap[2][3].value = MapContent.Barrier;
    tempMap[2][5].value = MapContent.Barrier;
    tempMap[2][7].value = MapContent.Barrier;
    tempMap[2][9].value = MapContent.Barrier;
    tempMap[2][11].value = MapContent.Barrier;

    tempMap[4][1].value = MapContent.Barrier;
    tempMap[4][3].value = MapContent.Barrier;
    tempMap[4][5].value = MapContent.Barrier;
    tempMap[4][7].value = MapContent.Barrier;

    tempMap[6][1].value = MapContent.Barrier;
    tempMap[6][9].value = MapContent.Barrier;
    tempMap[6][3].value = MapContent.Barrier;
    tempMap[6][5].value = MapContent.Barrier;
    tempMap[6][7].value = MapContent.Barrier;

    tempMap[11][6].value = MapContent.Barrier;

    setMap(tempMap);
  }, []);

  useEffect(() => {
    if (map.length > 0) {
      const mazeManager = new Maze(
        map.map((item) => item.map((item2) => item2.value)),
        { i: 1, j: 11 },
        //{ i: 19, j: 19 }
        { i: 11, j: 1 }
      );
      setAnswerPath(mazeManager.start());
    }
  }, [map]);

  return (
    <div className={styles.game_table}>
      <div className={styles.table}>
        {map.length > 0 &&
          map.map((item, i) => {
            return item.map((value, j) =>
              i % 2 === 1 && j % 2 === 1 ? (
                <div
                  id={value.id.toString()}
                  key={value.id}
                  className={
                    boxDancerColor +
                    " " +
                    (answerPath.find(
                      (x) =>
                        x.i === get_i_j(value.id).i &&
                        x.j === get_i_j(value.id).j
                    )
                      ? styles.isPath
                      : "")
                  }
                  style={{
                    animationDelay: `${((j + i) / 2) * 0.1}s`,
                    borderTop: hasBorder("top", value.id)
                      ? "3px solid red"
                      : "",
                    borderRight: hasBorder("right", value.id)
                      ? "3px solid red"
                      : "",
                    borderBottom: hasBorder("bottom", value.id)
                      ? "3px solid red"
                      : "",
                    borderLeft: hasBorder("left", value.id)
                      ? "3px solid red"
                      : "",
                  }}
                >
                  {/* {value.value === MapContent.Barrier
                    ? // <img src={require("../../assets/images/chess.svg").default} />
                      "x"
                    : null} */}
                </div>
              ) : null
            );
          })}
      </div>
      <div className={styles.restart}>
        <div></div>
        <button onClick={onRestartClickHandler}>{buttonText}</button>
      </div>
    </div>
  );
}

export default GameTable;
