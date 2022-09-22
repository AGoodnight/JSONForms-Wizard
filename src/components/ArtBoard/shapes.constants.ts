import { PaintConfiguration } from "components/ToolBar/toolbar.models";
import {
  DEFAULT_FILL_COLOR,
  DEFAULT_STROKE_COLOR,
} from "components/ToolBar/toolbar.constants";
import { ShapesState, ShapesStepMedium } from "./shapes.models";

export const DEFINED_ACTIVE_DRAWING_CONFIG: PaintConfiguration = {
  strokeWidth: 5,
  strokeColor: DEFAULT_STROKE_COLOR,
  fillColor: DEFAULT_FILL_COLOR,
  tension: 0.5,
  closed: false,
};

export const SHAPES_MEDIUM_KEY: string = "paint";
export const DEFINED_SHAPE_MEDIUM_TYPES: Record<string, ShapesStepMedium> = {
  paint: {
    label: "Paint",
    color: DEFAULT_STROKE_COLOR,
  },
};

export const DRAWN_BLOB_ID = 0;
export const FINALIZED_BLOB_ID = 2;

export const SHAPES_INITIAL_CONTEXT: ShapesState = {
  shapes: [],
  currentShape: null,
  currentShapes: null,
};
