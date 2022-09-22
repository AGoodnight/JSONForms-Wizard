import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { SHAPES_INITIAL_CONTEXT } from "./shapes.constants";
import {
  ShapesRedux,
  ShapesState,
  Shape,
  ShapesActionTypes,
  ShapesValueType,
} from "./shapes.models";

const ShapesReducer = (
  state: ShapesState,
  action: {
    type: ShapesActionTypes;
    value: ShapesValueType;
  }
) => {
  let _state = { ...state };
  switch (action.type) {
    case "setShapes":
      return Object.assign({}, _state, {
        shapes: action.value as Shape[],
      });
    case "setShapesAndFinalize":
      return Object.assign({}, _state, {
        shapes: action.value as Shape[],
        finalizedShapes: action.value as Shape[],
      });
    case "startRemoveFromShapes":
      return Object.assign({}, _state, {
        shapes: [],
      });
    case "startCurrentShape":
      return Object.assign({}, _state, {
        currentShape: action.value as Shape,
      });
    case "endRemoveFromShapes":
      return Object.assign({}, _state, {
        drawing: false,
        shapes: action.value as Shape[],
        currentShape: {} as Shape,
      });
    case "endCurrentShape":
      return Object.assign({}, _state, {
        shapes: [action.value as Shape],
        currentShape: {} as Shape,
      });
    case "removeLastShape":
      let _shapes = [..._state.shapes];
      if (_shapes.length > 0) {
        _shapes.pop();
      }
      return Object.assign({}, _state, {
        shapes: [..._shapes],
      });
    case "revertShapesToSaved":
      return Object.assign({}, _state, {
        shapes: action.value,
      });
    case "finalizeAllShapes":
      return Object.assign({}, _state, {
        finalizedShapes: _state.shapes as Shape[],
      });
    case "nukeAllShapes":
      return Object.assign({}, _state, {
        shapes: [],
      });

    case "nukeEverything":
      return SHAPES_INITIAL_CONTEXT;
    default:
      return state;
  }
};

const getLocalShapesState = () => {
  const localState = localStorage.getItem("shapesState");
  return localState ? JSON.parse(localState) : SHAPES_INITIAL_CONTEXT;
};

export const ShapesContext = createContext<ShapesRedux>(
  getLocalShapesState() as ShapesRedux
);

export const ShapesProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ShapesReducer, getLocalShapesState());
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem("shapesState", JSON.stringify(state));
  }, [state]);

  return (
    <ShapesContext.Provider value={value as ShapesRedux}>
      {props.children}
    </ShapesContext.Provider>
  );
};

export const useShapesContext = () => {
  const context = useContext(ShapesContext);
  if (context === undefined) {
    throw new Error("useShapesContext must be used within a ShapesProvider");
  }
  return context;
};
