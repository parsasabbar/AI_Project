import { XO, whichTurn, INodeOfTreeType, IChoice } from "./TicTacToeGameTypes";
import lodash, { xor } from "lodash";

export default class TicTacToeGame {
  turn = whichTurn.HUMAN as whichTurn;
  private humanValue = XO.O as XO;
  private computerValue = XO.X as XO;
  choices = [] as IChoice[];
  box = [
    [XO.EMPTY, XO.EMPTY, XO.EMPTY],
    [XO.EMPTY, XO.EMPTY, XO.EMPTY],
    [XO.EMPTY, XO.EMPTY, XO.EMPTY],
  ] as XO[][];
  /**
   *this class is for handle tic-tac-toe game
   */
  constructor() {}

  //main methods
  startGame = () => {
    this.emptyBox();
  };
  stopGame = () => {
    console.log("finish it right now");
  };
  humanMove = (i: number, j: number): XO[][] => {
    if (this.turn === whichTurn.HUMAN) {
      this.choices = [];
      this.box[i][j] = this.humanValue;
      this.turn = whichTurn.COMPUTER;
    }
    return this.box;
  };
  computerMove = (): XO[][] => {
    if (this.turn === whichTurn.COMPUTER) {
      this.choices = [];
      this.alphaBetaAlgorithm(
        lodash.cloneDeep(this.box),
        -Infinity,
        +Infinity,
        whichTurn.COMPUTER,
        true
      ) as XO[][];

      console.log([...this.choices]);
      this.box = this.getFinalBox([...this.choices]);
      this.turn = whichTurn.HUMAN;
      return this.box;
    }
    return this.box;
  };

  alphaBetaAlgorithm = (
    inputBox: XO[][],
    alpha: number,
    beta: number,
    turn: whichTurn,
    isFirstStep: boolean
  ): number | XO[][] | undefined => {
    //console.log(inputBox);
    if (this.oneLeft(inputBox)) {
      if (turn === whichTurn.COMPUTER) {
        this.insertLeftOne(inputBox, this.computerValue);
      } else {
        this.insertLeftOne(inputBox, this.humanValue);
      }
    }

    if (this.isFull(inputBox)) {
      return (
        this.getScore(inputBox, this.computerValue) * -1 +
        this.getScore(inputBox, this.humanValue)
      );
    }

    if (turn === whichTurn.COMPUTER) {
      if (
        this.getScore(inputBox, this.computerValue) !== 0 ||
        this.getScore(inputBox, this.humanValue) !== 0
      ) {
        return (
          this.getScore(inputBox, this.computerValue) * -1 +
          this.getScore(inputBox, this.humanValue)
        );
      }
      let nodeChildren = this.getChildren(inputBox, this.computerValue);
      for (let arg of nodeChildren) {
        let algorithmOutput = this.alphaBetaAlgorithm(
          [...arg],
          alpha,
          beta,
          whichTurn.HUMAN,
          false
        ) as number;
        if (algorithmOutput < beta) {
          beta = algorithmOutput;
          if (isFirstStep) {
            // if (beta === 0) {
            //   return undefined;
            // }
            this.choices.push({ value: algorithmOutput, box: arg });
          }
          if (alpha > beta) {
            return beta;
          }
        }
      }
      // if (isFirstStep) {
      //   //return nodeChildren[nodeChildren.length - 1];
      // }
      return beta;
    } else {
      if (
        this.getScore(inputBox, this.computerValue) !== 0 ||
        this.getScore(inputBox, this.humanValue) !== 0
      ) {
        return (
          this.getScore(inputBox, this.computerValue) * -1 +
          this.getScore(inputBox, this.humanValue)
        );
      }
      let nodeChildren = this.getChildren(inputBox, this.humanValue);
      for (let arg of nodeChildren) {
        let algorithmOutput = this.alphaBetaAlgorithm(
          [...arg],
          alpha,
          beta,
          whichTurn.COMPUTER,
          false
        ) as number;
        if (algorithmOutput > alpha) {
          alpha = algorithmOutput;
          if (isFirstStep) {
            // if (alpha === 0) {
            //   return undefined;
            // }
            this.choices.push({ value: algorithmOutput, box: arg });
          }
          if (alpha > beta) {
            return alpha;
          }
        }
      }
      // if (isFirstStep) {
      //   return nodeChildren[nodeChildren.length - 1];
      // }
      return alpha;
    }
  };

  ////secondary methods
  //empty main box
  private emptyBox = (): void => {
    for (let i = 0; i < this.box.length; i++) {
      for (let j = 0; j < this.box[i].length; j++) {
        this.box[i][j] = XO.EMPTY;
      }
    }
  };

  //get score of an full box
  private getScore = (inputBox: XO[][], xo: XO): number => {
    let score = 0;
    for (let i = 0; i < 3; i++) {
      if (
        inputBox[i][0] === xo &&
        inputBox[i][1] === xo &&
        inputBox[i][2] === xo
      ) {
        score++;
      }
      if (
        inputBox[0][i] === xo &&
        inputBox[1][i] === xo &&
        inputBox[2][i] === xo
      ) {
        score++;
      }
    }

    if (
      inputBox[0][0] === xo &&
      inputBox[1][1] === xo &&
      inputBox[2][2] === xo
    ) {
      score++;
    }
    if (
      inputBox[0][2] === xo &&
      inputBox[1][1] === xo &&
      inputBox[2][0] === xo
    ) {
      score++;
    }
    return score;
  };

  //predict all available situations
  private predictSituations = (inputBox: XO[][], value: XO): XO[][][] => {
    let outPut = [] as XO[][][];
    let emptyAddresses = [];
    for (let i = 0; i < inputBox.length; i++) {
      for (let j = 0; j < inputBox.length; j++) {
        if (inputBox[i][j] === XO.EMPTY) {
          emptyAddresses.push({ i, j });
        }
      }
    }

    for (let arg of emptyAddresses) {
      let newBox = lodash.cloneDeep(inputBox);
      newBox[arg.i][arg.j] = value;
      outPut.push(newBox);
    }
    return outPut;
  };

  //check that main box is full or not
  private isFull = (inputBox: XO[][]): boolean => {
    let temp = [...inputBox];
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < temp[i].length; j++) {
        if (temp[i][j] === XO.EMPTY) {
          return false;
        }
      }
    }
    return true;
  };
  private oneLeft = (inputBox: XO[][]): boolean => {
    let sum = 0;
    let temp = [...inputBox];
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < temp[i].length; j++) {
        if (temp[i][j] === XO.EMPTY) {
          sum++;
        }
      }
    }
    if (sum === 1) {
      return true;
    }
    return false;
  };
  private insertLeftOne = (inputBox: XO[][], xo: XO) => {
    for (let i = 0; i < inputBox.length; i++) {
      for (let j = 0; j < inputBox[i].length; j++) {
        if (inputBox[i][j] === XO.EMPTY) {
          inputBox[i][j] = xo;
        }
      }
    }
  };

  private getChildren = (inputBox: XO[][], value: XO): XO[][][] => {
    return this.predictSituations(inputBox, value);
  };
  getFinalBox = (inputChoices: IChoice[]): XO[][] => {
    // if (this.turn === whichTurn.COMPUTER) {
    //   return inputChoices.sort((item) => item.value)[0].box;
    // } else {
    //   return inputChoices.sort((item) => item.value)[inputChoices.length - 1]
    //     .box;
    // }
    return [...inputChoices].sort((a, b) => a.value - b.value)[0].box;
  };
  checkForWinner = (inputBox: XO[][]): whichTurn | null => {
    if (this.getScore([...inputBox], XO.O) !== 0) {
      if (this.computerValue === XO.O) {
        return whichTurn.COMPUTER;
      } else {
        return whichTurn.COMPUTER;
      }
    }
    if (this.getScore([...inputBox], XO.X) !== 0) {
      if (this.computerValue === XO.X) {
        return whichTurn.COMPUTER;
      } else {
        return whichTurn.COMPUTER;
      }
    }
    return null;
  };
}
