import { ArtBoardState, ArtBoardStepKey } from "./artboard.models";
import { PaintConfiguration } from "components/ToolBar/toolbar.models";
import {
  DEFAULT_FILL_COLOR,
  DEFAULT_STROKE_COLOR,
} from "components/ToolBar/toolbar.constants";

export const DEFINED_ACTIVE_DRAWING_CONFIG: PaintConfiguration = {
  strokeWidth: 5,
  strokeColor: DEFAULT_STROKE_COLOR,
  fillColor: DEFAULT_FILL_COLOR,
  tension: 0.5,
  closed: false,
};

export const SHAPES_MEDIUM_KEY: ArtBoardStepKey = "property";

export const DRAWN_BLOB_ID = 0;
export const FINALIZED_BLOB_ID = 2;

export const ARTBOARD_INITIAL_CONTEXT: ArtBoardState = {
  id: undefined,
  drawing: false,
  canceling: false,
  canvasSize: { width: 500, height: 500 },
  cursorWithinArtboard: false,
  cursorLeftBoundsLTRB: [false, false, false, false],
  cursorLeftArtBoardAt: [0, 0],
  cursorEnteredArtBoardAt: [0, 0],
  disabled: false,
};
