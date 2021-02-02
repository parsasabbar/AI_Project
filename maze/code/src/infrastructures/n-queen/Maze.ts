import { IBoxesForTrace, I_J, MapContent } from "./MazeTypes";
import lodash from "lodash";
import { isReturnStatement } from "typescript";

export default class Maze {
  /**
   *
   */
  private mainMap: MapContent[][];
  private startPoint: I_J;
  private endPoint: I_J;
  private finalPath = [] as I_J[];
  private minF = Infinity;
  constructor(mainMap: MapContent[][], startPoint: I_J, endPoint: I_J) {
    this.fenceAroundMap(mainMap);
    this.mainMap = mainMap;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }
  start = () => {
    if (
      this.heuristicAlgorithm(
        this.startPoint.i,
        this.startPoint.j,
        0,
        this.mainMap,
        []
      )
    ) {
      return this.finalPath;
    }
    return [];
  };
  getNextSteps = (inputMap: MapContent[][], point: I_J): I_J[] => {
    let points = [] as I_J[];

    //check top
    if (inputMap[point.i - 1][point.j] === MapContent.EMPTY) {
      points.push({ i: point.i - 2, j: point.j });
    }
    //check right
    if (inputMap[point.i][point.j + 1] === MapContent.EMPTY) {
      points.push({ i: point.i, j: point.j + 2 });
    }
    //check bottom
    if (inputMap[point.i + 1][point.j] === MapContent.EMPTY) {
      points.push({ i: point.i + 2, j: point.j });
    }
    //check left
    if (inputMap[point.i][point.j - 1] === MapContent.EMPTY) {
      points.push({ i: point.i, j: point.j - 2 });
    }
    return points;
  };
  blockBox = (inputMap: MapContent[][], point: I_J): MapContent[][] => {
    inputMap = lodash.cloneDeep(inputMap);
    inputMap[point.i - 1][point.j] = MapContent.Barrier;
    inputMap[point.i][point.j + 1] = MapContent.Barrier;
    inputMap[point.i + 1][point.j] = MapContent.Barrier;
    inputMap[point.i][point.j - 1] = MapContent.Barrier;
    return inputMap;
  };
  heuristicAlgorithm = (
    i: number,
    j: number,
    Gn: number,
    inputMap: MapContent[][],
    pathTaken: I_J[]
  ): boolean => {
    if (this.endPoint.i === i && this.endPoint.j === j) {
      pathTaken.push({ ...this.endPoint });
      this.finalPath = lodash.cloneDeep(pathTaken);
      return true;
    } else {
      inputMap = lodash.cloneDeep(inputMap);
      let nextBoxes = this.getNextSteps(inputMap, { i, j });
      if (nextBoxes.length === 0) {
        return false;
      }

      let boxesForTrace = nextBoxes.map((item) => ({
        Fn:
          Math.abs(
            (this.endPoint.i - item.i) / 2 +
              Math.abs(this.endPoint.j - item.j) / 2
          ) + Gn,
        point: item,
      })) as IBoxesForTrace[];

      boxesForTrace = boxesForTrace.sort((a, b) => a.Fn - b.Fn);
      // if (boxesForTrace.every((x) => x.Fn > minFn)) {
      //   return false;
      // } else {
      //   minFn = boxesForTrace[1] ? boxesForTrace[1].Fn : minFn;
      // }
      let mapWithBlockBoxes = this.blockBox(inputMap, { i, j });
      pathTaken.push({ i, j });
      for (let box of boxesForTrace) {
        let algorithmOutput = this.heuristicAlgorithm(
          box.point.i,
          box.point.j,
          Gn + 1,
          mapWithBlockBoxes,
          lodash.cloneDeep(pathTaken)
        );
        if (algorithmOutput) {
          return true;
        }
      }
      return false;
    }
  };
  fenceAroundMap = (inputMap: MapContent[][]) => {
    for (let i = 0; i < inputMap.length; i++) {
      for (let j = 0; j < inputMap[i].length; j++) {
        if (i === 0 || i === inputMap.length - 1) {
          inputMap[i][j] = MapContent.Barrier;
        }
        if (j === 0 || j === inputMap[i].length - 1) {
          inputMap[i][j] = MapContent.Barrier;
        }
      }
    }
  };
}
