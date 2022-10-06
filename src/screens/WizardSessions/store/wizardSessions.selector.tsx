import { WizardState } from "components/Wizard/wizard.models";
import { WizardSessionsState } from "../wizardSessions.models";

export const getAllSessions = (
  state: WizardSessionsState
): Record<string, WizardState> => {
  return state.sessions;
};

export const getSessionById = (
  state: WizardSessionsState,
  id: string
): WizardState => {
  return state.sessions[id];
};
