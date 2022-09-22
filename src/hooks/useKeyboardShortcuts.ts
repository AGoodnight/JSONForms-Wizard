import { useEffect } from "react";
import { useKeyboardEventsContext } from "store/keyBoard.context";
import useKeyCodesInterpreter from "components/MapBox/hooks/useKeyCodesInterpreter";

const useKeyboardShortcuts = () => {
  const { keysDown, whichKeys } = useKeyboardEventsContext();
  const { isUndo, isDelete } = useKeyCodesInterpreter();

  useEffect(() => {
    if (keysDown) {
      if (isUndo(whichKeys)) {
        console.log("Undo: ", whichKeys);
      }
      if (isDelete(whichKeys)) {
        console.log("Delete: ", whichKeys);
      }
    }
  }, [whichKeys, keysDown, isUndo, isDelete]);

  return { keysDown, whichKeys, isUndo, isDelete };
};

export default useKeyboardShortcuts;
