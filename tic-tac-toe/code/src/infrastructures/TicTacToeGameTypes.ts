export enum whichTurn {
  HUMAN,
  COMPUTER,
}
export enum XO {
  EMPTY,
  X,
  O,
}
export interface INodeOfTreeType {
  value: XO[][];
  children: INodeOfTreeType[];
}
export interface IChoice {
  value: number;
  box: XO[][];
}
