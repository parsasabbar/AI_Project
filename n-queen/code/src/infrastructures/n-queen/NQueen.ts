import { queries } from "@testing-library/react";
import lodash from "lodash";
import { IconContext } from "react-icons/lib";
import { IBoxType } from "../../components/game-table/GameTableTypes";
import { BoxContent, I_J } from "./NQeenTypes";

export default class NQueen {
  private inputBoxes: BoxContent[][];
  private T: number;
  /**
   *
   */
  constructor(inputBoxes: BoxContent[][], T: number) {
    this.inputBoxes = inputBoxes;
    this.T = T;
  }
  start = (): BoxContent[][] => {
    this.hillClimbingAlgorithm();
    return this.inputBoxes;
  };
  getHeuristic = (inputBoxes: BoxContent[][]): number => {
    let queenPositions = [] as I_J[];
    for (let i = 0; i < inputBoxes.length; i++) {
      for (let j = 0; j < inputBoxes[i].length; j++) {
        if (inputBoxes[i][j] === BoxContent.QUEEN) {
          queenPositions.push({ i, j });
        }
      }
    }
    let tempBoxes = lodash.cloneDeep(inputBoxes);
    let outputH = 0;
    while (queenPositions.length > 0) {
      let target = queenPositions.pop();
      if (!target) {
        break;
      }
      tempBoxes[target.i][target.j] = BoxContent.EMPTY;
      outputH += this.calculateHeuristicOfAnElement(
        lodash.cloneDeep(tempBoxes),
        target.i,
        target.j
      );
    }
    return outputH;
  };
  calculateHeuristicOfAnElement = (
    inputBoxes: BoxContent[][],
    i: number,
    j: number
  ): number => {
    let h = 0;
    for (let k = 0; k < inputBoxes.length; k++) {
      if (inputBoxes[i][k] === BoxContent.QUEEN) {
        h++;
        inputBoxes[i][k] = BoxContent.EMPTY;
      }
      if (inputBoxes[k][j] === BoxContent.QUEEN) {
        h++;
        inputBoxes[k][j] = BoxContent.EMPTY;
      }
    }
    for (let i1 = 0; i1 < inputBoxes.length; i1++) {
      for (let j1 = 0; j1 < inputBoxes.length; j1++) {
        if (i + j === i1 + j1 && inputBoxes[i1][j1] === BoxContent.QUEEN) {
          h++;
          inputBoxes[i1][j1] = BoxContent.EMPTY;
        }
        if (i - j === i1 - j1 && inputBoxes[i1][j1] === BoxContent.QUEEN) {
          h++;
          inputBoxes[i1][j1] = BoxContent.EMPTY;
        }
      }
    }
    return h;
  };
  getAnotherRandom = (): void => {
    let n = this.inputBoxes.length;
    let i = Math.floor(Math.random() * n);
    let j = Math.floor(Math.random() * n);
    for (let k = 0; k < n; k++) {
      this.inputBoxes[k][j] = BoxContent.EMPTY;
    }
    this.inputBoxes[i][j] = BoxContent.QUEEN;
  };
  hillClimbingAlgorithm = () => {
    let H = this.getHeuristic(this.inputBoxes);
    while (this.getHeuristic(this.inputBoxes) !== 0) {
      this.getAnotherRandom();
      let newH = this.getHeuristic(this.inputBoxes);
      this.T--;
      if (newH > H) {
        let m = (H - newH) / this.T;
        let edge = 2.7 ** m;

        let randomNum = Math.random();

        if (randomNum < edge) {
          if (this.T === 0) {
            break;
          }
        }
      }
      H = newH;
    }
  };
}
