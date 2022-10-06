import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WizardState } from "components/Wizard/wizard.models";
import { WizardSessionsState } from "../wizardSessions.models";

export const wizardsSlicer = createSlice({
  name: "wizards",
  initialState: { sessions: {} as Record<string, WizardState> },
  reducers: {
    setSession: (state: WizardSessionsState, action: PayloadAction<any>) => {
      state.sessions = {
        [action.payload.id]: action.payload.state,
        ...state.sessions,
      };
    },
  },
});

export const { setSession } = wizardsSlicer.actions;

export default wizardsSlicer.reducer;
