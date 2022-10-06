import { WizardState } from "components/Wizard/wizard.models";

export type WizardSessionsState = {
  sessions: Record<string, WizardState>;
};
