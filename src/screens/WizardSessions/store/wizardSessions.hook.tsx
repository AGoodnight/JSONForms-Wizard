import { useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { GlobalAppState, AppDispatch } from "store/app.store";
import { getSessionById, getAllSessions } from "./wizardSessions.selector";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useWizardSessionsDispatch: () => AppDispatch = useDispatch;
export const useWizardSessionsSelector: TypedUseSelectorHook<GlobalAppState> =
  useSelector;

const useWizardSessionsStore = () => {
  const state = useWizardSessionsSelector((state: GlobalAppState) => {
    return state.wizardSessions;
  });

  const getSession = useCallback(
    (id: string) => getSessionById(state, id),
    [state]
  );

  const getSessions = useCallback(
    (id: string) => getAllSessions(state),
    [state]
  );

  return {
    state,
    getSession,
    getSessions,
  };
};

export default useWizardSessionsStore;
