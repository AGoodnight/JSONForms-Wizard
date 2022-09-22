import {
  useContext,
  createContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { TOOL_BAR_INITIAL_CONTEXT } from "./toolbar.constants";
import {
  ToolBarAction,
  ToolBarRedux,
  ToolBarState,
  Tool,
  ToolBarTool,
} from "./toolbar.models";

const getLocalToolBarState = () => {
  const localState = localStorage.getItem("toolBarState");
  return localState ? JSON.parse(localState) : TOOL_BAR_INITIAL_CONTEXT;
};
const toolbarReducer = (state: ToolBarState, action: ToolBarAction) => {
  const _state = state;
  const _disabledTools = new Set<ToolBarTool>(_state.disabledTools);
  switch (action.type) {
    case "setTool":
      _disabledTools.delete(action.value as ToolBarTool);
      return Object.assign({}, _state, {
        tool: action.value as Tool,
        lastTool: _state.tool,
        disabledTool: Array.from(_disabledTools),
      });

    case "disableTool":
      _disabledTools.add(action.value as ToolBarTool);

      // console.log(Array.from(_disabledTools));

      return Object.assign({}, _state, {
        disabledTools: Array.from(_disabledTools),
      });

    case "enableTool":
      _disabledTools.delete(action.value as ToolBarTool);
      // console.log(Array.from(_disabledTools));
      return Object.assign({}, _state, {
        disabledTools: Array.from(_disabledTools),
      });

    default:
      return state;
  }
};

export const ToolBarContext = createContext<ToolBarRedux | undefined>(
  getLocalToolBarState()
);

export const ToolBarProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(toolbarReducer, getLocalToolBarState());
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem("toolBarState", JSON.stringify(state));
  }, [state]);

  return (
    <ToolBarContext.Provider value={value}>
      {props.children}
    </ToolBarContext.Provider>
  );
};

export const useToolBarContext = () => {
  const context = useContext(ToolBarContext);
  if (context === undefined) {
    throw new Error("useToolBarContext must be used within a ToolBarProvider");
  }
  return context;
};
