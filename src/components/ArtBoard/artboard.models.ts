import { Stage } from "konva/lib/Stage";

export type ArtBoardPayload = {
  id: null | undefined | string;
  areaType: ArtBoardStepKey; // is it a tree, house, driveway?
};

export type CursorWithinElementRelationship = {
  isWithin: boolean;
  leftBoundsLTRB: boolean[];
  lastX: number;
  lastY: number;
};

export type ArtBoardStepKey = "property";

export type ArtBoardValueType =
  | ArtBoardStepKey
  | ArtBoardPayload
  | Stage
  | boolean
  | string
  | CursorWithinElementRelationship;

export type ArtBoardAction = {
  type: ArtBoardActionTypes;
  value?: ArtBoardValueType;
};

export type ArtBoardActionTypes =
  | "setArtboardSession"
  | "setId"
  | "setPreDefinedPanelType"
  | "toggleDrawing"
  | "startDrawing"
  | "endDrawing"
  | "cancelLastChange"
  | "endCancelEvent"
  | "stageRendered"
  | "cursorWithinArtboard"
  | "disableArtBoard"
  | "enableArtBoard"
  | "reset";

export type RectSize = {
  height: number;
  width: number;
};

export type ArtBoardState = {
  id: null | undefined | string;
  canvasSize: RectSize;
  drawing: boolean;
  canceling: boolean;
  cursorWithinArtboard: boolean;
  cursorLeftBoundsLTRB: boolean[];
  cursorLeftArtBoardAt: [number, number];
  cursorEnteredArtBoardAt: [number, number];
  disabled: boolean | null | undefined;
};
export type ArtBoardDispatch = (action: ArtBoardAction) => void;
export type ArtBoardRedux = {
  state: ArtBoardState;
  dispatch: ArtBoardDispatch;
  payload: ArtBoardPayload;
};
