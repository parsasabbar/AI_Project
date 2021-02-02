export enum MapContent {
  EMPTY,
  Barrier,
  Box,
}
export interface I_J {
  i: number;
  j: number;
}
export interface IBoxesForTrace {
  Fn: number;
  point: I_J;
}
