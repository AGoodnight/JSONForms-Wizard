import { useCallback, useEffect, useMemo } from "react";
import { DRAWING_TOOLBAR } from "./toolbar.constants";
import { Tool, DrawingBarTool } from "./toolbar.models";
import { useToolBarContext } from "./toolbar.context";

type DrawingToolBarParams = {
  iconBaseClasses?: string;
  onToolClick?: (tool: Tool) => void;
};

export const DrawingToolBar = ({
  iconBaseClasses = "uk-button uk-button-default",
  onToolClick,
}: DrawingToolBarParams) => {
  const { state: toolBarState, dispatch: dispatchOnToolBar } =
    useToolBarContext();

  const DefinedTools: (Tool & { classList?: string })[] = useMemo(
    () =>
      Object.values(DRAWING_TOOLBAR).map((tool) => {
        return Object.assign({}, tool, {
          classList: `
              ${iconBaseClasses} ${
            tool.key === toolBarState.tool.key &&
            toolBarState.tool.action === "iterative" &&
            toolBarState.disabledTools.indexOf(tool.key) < 0
              ? " active"
              : ""
          }`,
        });
      }),
    [iconBaseClasses, toolBarState]
  );

  const handleToolChange = useCallback(
    (e: any) => {
      const _tool: DrawingBarTool = e.target.value;
      const _isATool: boolean = Object.keys(DRAWING_TOOLBAR).some(
        (key) => key === e.target.value
      );
      const _toolConfiguration = DRAWING_TOOLBAR[_tool];
      if (_isATool) {
        switch (_toolConfiguration?.action) {
          case "iterative":
            dispatchOnToolBar({
              type: "setTool",
              value: _toolConfiguration,
            });
            onToolClick?.(_toolConfiguration);
            break;
          case "immediate":
            dispatchOnToolBar({
              type: "setTool",
              value: _toolConfiguration,
            });
            onToolClick?.(_toolConfiguration);
            break;
          default:
            break;
        }
      }
    },
    [dispatchOnToolBar, onToolClick]
  );

  useEffect(() => {
    if (
      toolBarState.tool.action !== "iterative" &&
      toolBarState.disabledTools.indexOf(toolBarState.lastTool.key) < 0
    ) {
      dispatchOnToolBar({
        type: "setTool",
        value: toolBarState.lastTool,
      });
    }
  }, [toolBarState, dispatchOnToolBar]);

  return (
    <div data-uk-width-1-1 className={"uk-button-bar vertical"}>
      {DefinedTools.map((tool) => {
        return (
          <button
            key={tool.label}
            type="button"
            uk-tooltip={tool.label}
            title={tool.label}
            value={tool.key}
            className={tool.classList}
            disabled={toolBarState.disabledTools.indexOf(tool.key) > -1}
            onClick={handleToolChange}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d={tool.iconPath} />
            </svg>
            <span>{` ${tool.caption}`}</span>
          </button>
        );
      })}
    </div>
  );
};
