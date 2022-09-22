import { useCallback, useMemo } from "react";
import {
  ConfigureToolDefintions,
  DrawingToolDefintions,
  MapToolDefintions,
  Tool,
  ToolBarTool,
  ToolDefintions,
} from "./toolbar.models";
import { useToolBarContext } from "./toolbar.context";

const useToolBar = (
  tools: DrawingToolDefintions | MapToolDefintions | ConfigureToolDefintions
) => {
  const { state: toolBarState, dispatch: dispatchOnToolBar } =
    useToolBarContext();

  const definedTools = tools;

  const currentTool = useMemo(() => {
    return toolBarState.tool;
  }, [toolBarState.tool]);

  const disableTool = useCallback(
    (tool: ToolBarTool) => {
      dispatchOnToolBar({
        type: "disableTool",
        value: tool,
      });
    },
    [dispatchOnToolBar]
  );

  const enableTool = useCallback(
    (tool: ToolBarTool) => {
      dispatchOnToolBar({
        type: "enableTool",
        value: tool,
      });
    },
    [dispatchOnToolBar]
  );

  const setTool = useCallback(
    (tool: Tool) => {
      dispatchOnToolBar({
        type: "setTool",
        value: tool,
      });
    },
    [dispatchOnToolBar]
  );

  return { setTool, enableTool, disableTool, currentTool, definedTools };
};

export default useToolBar;
