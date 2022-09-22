export type PaintConfiguration = {
  strokeWidth: number;
  fillColor: string;
  strokeColor: string;
  tension: number;
  closed: boolean;
};

export type ToolBarActionTypes =
  | "setTool"
  | "configureTool"
  | "disableTool"
  | "enableTool";

export type ToolBarAction = {
  type: ToolBarActionTypes;
  value: Tool | PaintConfiguration | ToolBarTool;
};

export type ToolBarState = {
  tool: Tool;
  lastTool: Tool;
  disabledTools: ToolBarTool[];
};
export type ToolBarDispatch = (action: ToolBarAction) => void;
export type ToolBarRedux = {
  state: ToolBarState;
  dispatch: ToolBarDispatch;
};

export type ToolActionType = "iterative" | "immediate" | "toggle";

export type Tool = {
  action: ToolActionType;
  key: ToolBarTool;
  type: ToolType;
  paint?: PaintConfiguration;
  mode?: string;
  iconPath: string;
  label: string;
  caption: string;
  enabled?: boolean;
};

export const DrawingToolStrings = [
  "freehand",
  "paintbrush",
  "polygon",
  "eraser",
  "undo",
  "reset",
] as const;
export const MapToolStrings = ["hand", "edit", "polygon", "reset"] as const;
export const ConfigureToolStrings = ["strokeWidth"] as const;
export const ToolBarToolString = [
  ...DrawingToolStrings,
  ...MapToolStrings,
  ...ConfigureToolStrings,
  "revert",
] as const;
export const ToolTypeStrings = ["artTool", "mapTool", "settingsTool"] as const;

export type ToolBarTool = typeof ToolBarToolString[number];
export type ConfigureBarTool = typeof ConfigureToolStrings[number];
export type DrawingBarTool = typeof DrawingToolStrings[number];
export type MapBarTool = typeof MapToolStrings[number];
export type ToolType = typeof ToolTypeStrings[number];

export type ToolDefintions = Record<ToolBarTool, Tool>;
export type DrawingToolDefintions = Record<DrawingBarTool, Tool>;
export type MapToolDefintions = Record<MapBarTool, Tool>;
export type ConfigureToolDefintions = Record<ConfigureBarTool, Tool>;
