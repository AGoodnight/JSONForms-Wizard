import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { ARTBOARD_INITIAL_CONTEXT } from "./artboard.constants";
import { CursorWithinElementRelationship } from "../../store/cursor.context";
import {
  ArtBoardRedux,
  ArtBoardState,
  ArtBoardActionTypes,
  ArtBoardValueType,
} from "./artboard.models";

const artBoardReducer = (
  state: ArtBoardState,
  action: {
    type: ArtBoardActionTypes;
    value: ArtBoardValueType;
  }
) => {
  let _state = { ...state };
  switch (action.type) {
    case "setArtboardSession":
      return Object.assign({}, _state, {
        id: action.value,
      });
    case "disableArtBoard":
      return Object.assign({}, _state, {
        disabled: true,
      });
    case "enableArtBoard":
      return Object.assign({}, _state, {
        disabled: false,
      });
    case "setId": {
      if (typeof action.value === "string") {
        return Object.assign({}, _state, {
          id: action.value,
        });
      } else {
        return _state;
      }
    }
    case "setPreDefinedPanelType":
      return Object.assign({}, _state, {
        mediumType: action.value,
      });
    case "startDrawing":
      return Object.assign({}, _state, {
        drawing: true,
      });
    case "endDrawing":
      return Object.assign({}, _state, {
        drawing: false,
      });

    case "toggleDrawing":
      return Object.assign({}, _state, {
        drawing: !state.drawing,
      });
    case "cancelLastChange":
      return Object.assign({}, _state, {
        canceling: true,
      });
    case "cursorWithinArtboard":
      if (action.value.hasOwnProperty("isWithin")) {
        const value = action.value as CursorWithinElementRelationship;
        let rest: Record<string, any> = {};
        if (_state.cursorWithinArtboard) {
          if (!value.isWithin) {
            rest = {
              cursorLeftArtBoardAt: [value.lastX, value.lastY],
            };
          }
        } else {
          if (value.isWithin) {
            rest = {
              cursorEnteredArtBoardAt: [value.lastX, value.lastY],
            };
          }
        }
        return Object.assign({}, _state, {
          cursorWithinArtboard: value.isWithin,
          cursorLeftBoundsLTRB: value.leftBoundsLTRB,
          ...rest,
        });
      } else {
        return _state;
      }
    case "endCancelEvent":
      return Object.assign({}, _state, {
        canceling: false,
      });
    case "stageRendered":
      return Object.assign({}, _state, {
        currentArtBoard: action.value,
      });
    case "reset":
      return ARTBOARD_INITIAL_CONTEXT;
    default:
      return state;
  }
};

const getLocalArtBoardState = () => {
  const localState = localStorage.getItem("artBoardState");
  return localState ? JSON.parse(localState) : ARTBOARD_INITIAL_CONTEXT;
};

export const ArtBoardContext = createContext<ArtBoardRedux>(
  getLocalArtBoardState() as ArtBoardRedux
);

export const ArtBoardProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    artBoardReducer,
    getLocalArtBoardState()
  );
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem("artBoardState", JSON.stringify(state));
  }, [state]);

  return (
    <ArtBoardContext.Provider value={value as ArtBoardRedux}>
      {props.children}
    </ArtBoardContext.Provider>
  );
};

export const useArtBoardContext = () => {
  const context = useContext(ArtBoardContext);
  if (context === undefined) {
    throw new Error(
      "useArtBoardContext must be used within a ArtBoardProvider"
    );
  }
  return context;
};
