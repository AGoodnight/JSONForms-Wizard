import {
  ConfigureBarTool,
  DrawingBarTool,
  MapBarTool,
  Tool,
  ToolBarState,
  ToolBarTool,
} from "./toolbar.models";

export const TOOL_ICONS_PATHS: Record<ToolBarTool, string> = {
  hand: "M369.427 119.119V96.31c0-42.828-42.806-72.789-82.304-56.523-19.82-54.166-94.37-52.179-112.451.797-38.439-15.75-81.814 12.815-81.814 55.916v145.654c-20.34-13.673-47.577-13.892-68.39 1.47-26.557 19.605-32.368 57.08-13.133 83.926l124.97 174.429A24 24 0 0 0 155.814 512h232.185a24 24 0 0 0 23.38-18.58l31.442-135.635a200.779 200.779 0 0 0 5.18-45.273V176.25c-.001-41.56-40.56-70.112-78.574-57.131zm46.57 193.394a168.76 168.76 0 0 1-4.35 38.046L381.641 480H159.924L37.336 308.912c-9.049-12.63-6.301-30.369 6.125-39.542 12.322-9.095 29.592-6.403 38.636 6.218l28.259 39.439c4.513 6.301 14.503 3.105 14.503-4.659V96.5c0-38.008 55.428-36.927 55.428.716V256a8 8 0 0 0 8 8h7.143a8 8 0 0 0 8-8V60.25c0-38.024 55.428-36.927 55.428.716V256a8 8 0 0 0 8 8h7.143a8 8 0 0 0 8-8V95.594c0-37.997 55.428-36.927 55.428.716V256a8 8 0 0 0 8 8h7.143a8 8 0 0 0 8-8v-79.034c0-37.556 55.428-38.847 55.428-.716v136.263z",
  polygon:
    "M493.25 56.26l-37.51-37.51C443.25 6.25 426.87 0 410.49 0s-32.76 6.25-45.26 18.74L12.85 371.12.15 485.34C-1.45 499.72 9.88 512 23.95 512c.89 0 1.78-.05 2.69-.15l114.14-12.61 352.48-352.48c24.99-24.99 24.99-65.51-.01-90.5zM126.09 468.68l-93.03 10.31 10.36-93.17 263.89-263.89 82.77 82.77-263.99 263.98zm344.54-344.54l-57.93 57.93-82.77-82.77 57.93-57.93c6.04-6.04 14.08-9.37 22.63-9.37 8.55 0 16.58 3.33 22.63 9.37l37.51 37.51c12.47 12.48 12.47 32.78 0 45.26z",
  // zoomout:
  //   "M376 232H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h368c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z",
  // zoomin:
  //   "M376 232H216V72c0-4.42-3.58-8-8-8h-32c-4.42 0-8 3.58-8 8v160H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h160v160c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V280h160c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z",
  freehand:
    "M459.67 179.63l-60.75-20.49c-9.69-3.28-17-10.05-19.03-17.7l-14.5-53.97c-6.84-25.44-27.69-45.05-55.75-52.42-30.87-8.06-63.09.17-84.22 21.66l-41.81 42.55c-7 7.16-18.62 11.02-30.16 10.14l-65.15-5.02c-33.56-2.42-65.03 13.2-79.9 40.21-12.87 23.38-10.87 50.32 5.34 72.05l34.9 46.78c4.62 6.19 5.34 13.16 2.03 19.67l-25.75 50.88c-11.84 23.36-9.25 49.85 6.97 70.85 19.25 24.99 53 36.47 86.09 29.38l63.4-13.64c11.34-2.5 23.78-.05 32.37 6.28L263 463.28c14.87 11.03 33.28 16.72 51.87 16.72 12.69 0 25.44-2.64 37.25-8.03 25.41-11.59 41.75-33.77 43.75-59.35l4.25-55.24c.56-7.44 6.03-14.47 14.66-18.8l56.19-28.35c27.22-13.74 42.87-39.63 40.87-67.55-2.04-28.72-22.04-52.9-52.17-63.05zm-10.34 87.75l-56.19 28.35c-23.75 11.98-39.03 33.66-40.9 57.97l-4.25 55.24c-.87 11.38-11.34 17.33-15.81 19.36-10.19 4.63-27 6.5-40.62-3.58l-49.22-36.45c-14.66-10.86-33.19-16.67-52.03-16.67-6.34 0-12.75.67-19.03 2.02l-63.4 13.64c-17 3.75-31.4-3.23-37.97-11.75-4.87-6.33-5.62-13.02-2.16-19.84L93.5 304.8c11.47-22.58 9.03-49.44-6.37-70.1l-34.9-46.78c-4.94-6.59-5.53-13.39-1.78-20.19 4.44-8.02 16.03-16.75 34.19-15.52l65.15 5.02c25.25 2.08 51.12-7.09 68.09-24.35l41.81-42.56c8.87-9.05 23.69-12.53 37.75-8.86 11.22 2.95 19.28 9.84 21.59 18.47l14.5 53.94c6.25 23.31 24.97 42.27 50.09 50.74l60.75 20.49c11.62 3.92 18.94 11.78 19.59 21 .62 8.53-4.72 16.29-14.63 21.28z",
  paintbrush:
    "M489.17 144.05C547.44 80.02 483.28 0 418.52 0c-23.39 0-46.87 10.44-64.68 35.85L187.9 284.01c-45.13 2.9-86.1 20.09-109.34 81.34-2.65 6.99-9 11.22-16.41 11.22-12.49 0-51.14-31.13-62.15-38.65C0 430.58 42.67 512 144 512c141.21 0 145.89-117.04 142.91-145.49l.02-.02 202.24-222.44zM393.15 63.4c9.68-13.8 19.11-15.4 25.37-15.4 16.4 0 35.57 13.17 42.72 29.35 5.36 12.13 3.03 22.74-7.6 34.41L266.16 317.98l-27.76-23.13L393.15 63.4zM144 464c-38.6 0-62.03-16.87-76.06-39.67 25.07-2.14 46.49-18.14 55.51-41.95 10.03-26.44 18.24-47.29 83.23-51.48l30.94 25.79C239.85 376.62 251.75 464 144 464z",
  eraser:
    "M497.942 273.941c18.745-18.745 18.745-49.137 0-67.882l-160-160c-18.744-18.744-49.136-18.746-67.883 0l-256 256c-18.745 18.745-18.745 49.137 0 67.882l96 96A48 48 0 0 0 144 480h356c6.627 0 12-5.373 12-12v-8c0-6.627-5.373-12-12-12H323.883l174.059-174.059zM292.686 68.687c6.243-6.243 16.374-6.254 22.628-.001l160 160c6.243 6.243 6.253 16.374 0 22.627L358.627 368.001 176 185.373 292.686 68.687zM144 448a15.895 15.895 0 0 1-11.314-4.686l-96-96c-6.243-6.243-6.253-16.374 0-22.627L153.373 208 336 390.628l-52.686 52.686A15.895 15.895 0 0 1 272 448H144z",
  undo: "M20 8h10c6.627 0 12 5.373 12 12v110.625C85.196 57.047 165.239 7.715 256.793 8.001 393.18 8.428 504.213 120.009 504 256.396 503.786 393.181 392.834 504 256 504c-63.926 0-122.202-24.187-166.178-63.908-5.113-4.618-5.354-12.561-.482-17.433l7.069-7.069c4.503-4.503 11.749-4.714 16.482-.454C150.782 449.238 200.935 470 256 470c117.744 0 214-95.331 214-214 0-117.744-95.331-214-214-214-82.862 0-154.737 47.077-190.289 116H180c6.627 0 12 5.373 12 12v10c0 6.627-5.373 12-12 12H20c-6.627 0-12-5.373-12-12V20c0-6.627 5.373-12 12-12z",
  // colorPicker: "",
  strokeWidth: "",
  revert:
    "m267.5 281.1 192 159.4c20.6 17.2 52.5 2.8 52.5-24.6V96c0-27.4-31.9-41.8-52.5-24.6L267.5 232c-15.3 12.8-15.3 36.4 0 49.1zm20.5-24.5L480 96v320L288 256.6zM11.5 281.1l192 159.4c20.6 17.2 52.5 2.8 52.5-24.6V96c0-27.4-31.9-41.8-52.5-24.6L11.5 232c-15.3 12.8-15.3 36.4 0 49.1zM32 256.6 224 96v320L32 256.6z",

  reset:
    "M336 64l-33.6-44.8C293.3 7.1 279.1 0 264 0h-80c-15.1 0-29.3 7.1-38.4 19.2L112 64H24C10.7 64 0 74.7 0 88v2c0 3.3 2.7 6 6 6h26v368c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V96h26c3.3 0 6-2.7 6-6v-2c0-13.3-10.7-24-24-24h-88zM184 32h80c5 0 9.8 2.4 12.8 6.4L296 64H152l19.2-25.6c3-4 7.8-6.4 12.8-6.4zm200 432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V96h320v368zm-176-44V156c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v264c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12zm-80 0V156c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v264c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12zm160 0V156c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v264c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12z",
  edit: "M384 352c-6.3 0-12.26 1.19-18.01 2.89l-32.42-54.02C344.95 289.31 352 273.49 352 256s-7.05-33.31-18.42-44.87L366 157.11c5.75 1.7 11.71 2.89 18.01 2.89 35.35 0 64-28.65 64-64s-28.65-64-64-64c-29.79 0-54.6 20.45-61.74 48H125.74C118.6 52.45 93.79 32 64 32 28.65 32 0 60.65 0 96c0 29.79 20.44 54.6 48 61.74v196.53C20.44 361.4 0 386.21 0 416c0 35.35 28.65 64 64 64 29.79 0 54.6-20.44 61.74-48h196.53c7.14 27.56 31.95 48 61.74 48 35.35 0 64-28.65 64-64-.01-35.35-28.66-64-64.01-64zm-304 2.26V157.74c22.41-5.8 39.93-23.32 45.74-45.74h196.53c2.86 11.04 8.4 20.99 16.16 28.87l-32.42 54.02c-5.75-1.7-11.71-2.89-18.01-2.89-35.35 0-64 28.65-64 64s28.65 64 64 64c6.3 0 12.26-1.19 18.01-2.89l32.42 54.02c-7.76 7.88-13.3 17.83-16.16 28.87H125.74A63.814 63.814 0 0 0 80 354.26zM288 288c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32zm96-224c17.64 0 32 14.36 32 32s-14.36 32-32 32-32-14.36-32-32 14.36-32 32-32zM32 96c0-17.64 14.36-32 32-32s32 14.36 32 32-14.36 32-32 32-32-14.36-32-32zm32 352c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32zm320 0c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32z",
};

export const DEFAULT_COLOR = "#a8c73f";
export const DEFAULT_FILL_COLOR = "#a8c73f";
export const DEFAULT_STROKE_COLOR = "#a8c73f";
export const DEFINED_TOOLBAR_TOOLS: Record<ToolBarTool, Tool> = {
  hand: {
    action: "iterative",
    key: "hand",
    label: "select and move a boundry",
    type: "artTool",
    caption: "Select & Move",
    mode: "simple_select",
    iconPath: TOOL_ICONS_PATHS.hand,
  },
  edit: {
    action: "iterative",
    key: "edit",
    label: "edit a selected boundry",
    type: "artTool",
    caption: "Edit Boundry",
    mode: "direct_select",
    iconPath: TOOL_ICONS_PATHS.edit,
  },
  freehand: {
    action: "iterative",
    key: "freehand",
    label: "draw a shape",
    type: "artTool",
    caption: "Freehand",
    iconPath: TOOL_ICONS_PATHS.freehand,
    paint: {
      strokeWidth: 1,
      closed: true,
      tension: 0.5,
      fillColor: DEFAULT_FILL_COLOR,
      strokeColor: DEFAULT_STROKE_COLOR,
    },
  },
  polygon: {
    action: "iterative",
    key: "polygon",
    label: "draw a boundry",
    type: "artTool",
    caption: "Draw",
    mode: "draw_polygon",
    iconPath: TOOL_ICONS_PATHS.polygon,
    paint: {
      strokeWidth: 1,
      closed: true,
      tension: 0,
      fillColor: DEFAULT_FILL_COLOR,
      strokeColor: DEFAULT_STROKE_COLOR,
    },
  },
  reset: {
    action: "immediate",
    key: "reset",
    label: "remove a selected boundry",
    type: "artTool",
    mode: "trash",
    caption: "Trash",
    iconPath: TOOL_ICONS_PATHS.reset,
  },
  revert: {
    action: "immediate",
    key: "revert",
    label: "revert to saved state",
    type: "artTool",
    mode: "revert",
    caption: "Revert",
    iconPath: TOOL_ICONS_PATHS.revert,
  },
  paintbrush: {
    action: "iterative",
    key: "paintbrush",
    label: "paintbrush tool",
    type: "artTool",
    mode: "paintbrush",
    caption: "Paintbrush",
    iconPath: TOOL_ICONS_PATHS.paintbrush,
    paint: {
      strokeWidth: 10,
      closed: false,
      tension: 0.5,
      fillColor: DEFAULT_FILL_COLOR,
      strokeColor: DEFAULT_STROKE_COLOR,
    },
  },
  eraser: {
    action: "iterative",
    key: "eraser",
    label: "eraser tool",
    type: "artTool",
    mode: "eraser",
    caption: "Eraser",
    iconPath: TOOL_ICONS_PATHS.paintbrush,
    paint: {
      strokeWidth: 20,
      closed: false,
      tension: 0.5,
      fillColor: DEFAULT_FILL_COLOR,
      strokeColor: DEFAULT_STROKE_COLOR,
    },
  },
  undo: {
    action: "iterative",
    key: "undo",
    label: "undo tool",
    type: "artTool",
    mode: "undo",
    caption: "Undo",
    iconPath: TOOL_ICONS_PATHS.undo,
  },
  // colorPicker: {
  //   action: "immediate",
  //   type: "settingsTool",
  //   key: "colorPicker",
  //   label: "Color Picker",
  //   iconPath: TOOL_ICONS_PATHS.colorPicker,
  // },
  strokeWidth: {
    action: "immediate",
    type: "settingsTool",
    key: "strokeWidth",
    label: "Stroke Width",
    caption: "Stroke Width",
    iconPath: TOOL_ICONS_PATHS.strokeWidth,
  },
};

export const DRAWING_TOOLBAR: Record<DrawingBarTool, Tool> = {
  freehand: DEFINED_TOOLBAR_TOOLS.freehand,
  paintbrush: DEFINED_TOOLBAR_TOOLS.paintbrush,
  polygon: DEFINED_TOOLBAR_TOOLS.polygon,
  eraser: DEFINED_TOOLBAR_TOOLS.eraser,
  undo: DEFINED_TOOLBAR_TOOLS.undo,
  reset: DEFINED_TOOLBAR_TOOLS.reset,
};

export const MAP_TOOLBAR: Record<MapBarTool, Tool> = {
  hand: DEFINED_TOOLBAR_TOOLS.hand,
  edit: DEFINED_TOOLBAR_TOOLS.edit,
  polygon: DEFINED_TOOLBAR_TOOLS.polygon,
  reset: DEFINED_TOOLBAR_TOOLS.reset,
};

export const DRAWING_CONFIG_TOOLBAR: Record<ConfigureBarTool, Tool> = {
  strokeWidth: DEFINED_TOOLBAR_TOOLS.strokeWidth,
};

export const TOOL_BAR_INITIAL_CONTEXT: ToolBarState = {
  tool: DEFINED_TOOLBAR_TOOLS.polygon,
  lastTool: DEFINED_TOOLBAR_TOOLS.polygon,
  disabledTools: [],
};
