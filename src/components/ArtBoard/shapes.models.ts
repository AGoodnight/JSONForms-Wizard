import { Stage } from "konva/lib/Stage";
import { ToolBarTool } from "../ToolBar/toolbar.models";

export type APIShape = {
  tool: ToolBarTool;
  points: Point[];
  strokeWidth?: number;
  fill?: string;
  tension?: number;
  closed?: boolean;
};

export type ShapesPayload = {
  shapes: APIShape[]; // all points associated with the image, closed shapes
};

export type ShapesShapesResponse = {
  shapes: APIShape[];
  blob64: string;
};

export type Point = [number, number];
export type Position = { x: number; y: number };

export interface Shape extends Record<string, unknown> {
  tool: ToolBarTool;
  fill: string;
  pointsAsFlatArray: number[];
  points: Point[];
  type: ShapesStepMedium;
  strokeWidth: number;
  tension?: number;
  closed: boolean;
}

export type ShapesStepMedium = {
  label: string;
  color: string;
};

export type ShapesValueType =
  | Point
  | Shape
  | Shape[]
  | ShapesPayload
  | boolean
  | string;

export type ShapesAction = {
  type: ShapesActionTypes;
  value?: ShapesValueType;
};

export type ShapesActionTypes =
  | "setShapes"
  | "setShapesAndFinalize"
  | "endRemoveFromShapes"
  | "startCurrentShape"
  | "endCurrentShape"
  | "startRemoveFromShapes"
  | "removeLastShape"
  | "nukeAllShapes"
  | "finalizeAllShapes"
  | "nukeEverything"
  | "revertShapesToSaved";

export type ShapesState = {
  shapes: Shape[];
  currentShape: Shape | null;
  currentShapes: Stage | null | undefined;
};
export type ShapesDispatch = (action: ShapesAction) => void;
export type ShapesRedux = {
  state: ShapesState;
  dispatch: ShapesDispatch;
  payload: ShapesPayload;
};
