import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import useEventListener from "hooks/useEventListener";

export type KeyBoardEventState = {
  keysDown: boolean;
  whichKeys: Set<string>;
};

export const INITIAL_KEYBOARD_EVENTS_STATE: KeyBoardEventState = {
  keysDown: false,
  whichKeys: new Set([]),
};

export const KeyboardEventsContext = createContext(
  INITIAL_KEYBOARD_EVENTS_STATE
);

export const KeyboardEventsProvider = (props: { children: ReactNode }) => {
  const [whichKeys, setWhichKeys] = useState<Set<string>>(
    INITIAL_KEYBOARD_EVENTS_STATE.whichKeys
  );
  const [keysDown, setKeysDown] = useState<boolean>(
    INITIAL_KEYBOARD_EVENTS_STATE.keysDown
  );

  const setKeyDown = useCallback(
    (event: Event) => {
      const _keyboardEvent = event as KeyboardEvent;
      if (!whichKeys.has(_keyboardEvent.code)) {
        whichKeys.add(_keyboardEvent.code);
        const _whichKeys: Set<string> = new Set(whichKeys);
        setWhichKeys(_whichKeys);
        setKeysDown(_whichKeys.size > 0);
      }
    },
    [whichKeys]
  );

  const setKeyUp = useCallback(
    (event: Event) => {
      const _keyboardEvent = event as KeyboardEvent;
      if (whichKeys.has(_keyboardEvent.code)) {
        whichKeys.delete(_keyboardEvent.code);
        const _whichKeys: Set<string> = new Set(whichKeys);
        setWhichKeys(_whichKeys);
        setKeysDown(_whichKeys.size > 0);
      }
    },
    [whichKeys]
  );

  useEventListener("keydown", setKeyDown);
  useEventListener("keyup", setKeyUp);

  return (
    <KeyboardEventsContext.Provider value={{ keysDown, whichKeys }}>
      {props.children}
    </KeyboardEventsContext.Provider>
  );
};

export const useKeyboardEventsContext = () => {
  const context = useContext(KeyboardEventsContext);
  if (context === undefined) {
    throw new Error(
      "useKeyboardEventsContext must be used within a KeyBoardEventsProvider"
    );
  }
  return context;
};
