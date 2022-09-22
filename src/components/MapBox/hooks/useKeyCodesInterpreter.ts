const useKeyCodesInterpreter = () => {
  const commandKey = (codes: Set<string>) =>
    codes.has("ControlLeft") || codes.has("ControlRight");

  const isUndo = (codes: Set<string>) => {
    return codes.has("KeyZ") && commandKey(codes);
  };

  const isDelete = (codes: Set<string>) => {
    return codes.has("Backspace");
  };

  return {
    isUndo,
    isDelete,
  };
};

export default useKeyCodesInterpreter;
