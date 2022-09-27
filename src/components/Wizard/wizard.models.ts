import { ControlElement, JsonSchema, Layout } from "@jsonforms/core";

export const ScopeKeyStrings = [
  "address",
  "select",
  "radio",
  "input",
  "map",
  "property",
] as const;
export type ScopeKey = typeof ScopeKeyStrings[number];

export type WizardConfiguration = {
  title: string;
  route: string;
  complete: boolean;
};

export interface WizardStepDefinition {
  index: number;
  complete: boolean;
  schemaKey: string;
}

export type WizardPropertyStepValue = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type WizardQuoteStepValue = {
  accepted?: boolean;
  name?: string;
  phone?: string;
  address?: string;
  extra?: string;
};

export type WizardStepValue = unknown;
export type WizardStep =
  | "address"
  | "map"
  | "property"
  | "parking"
  | "gate"
  | "notes"
  | "quality"
  | "quote";

export type WizardStepResults = Record<WizardStep, WizardStepResult>;
export type WizardStepResult = { answer: WizardAnswer; state: unknown };
export type WizardAnswer = unknown;
export type WizardStates = Record<WizardStep, WizardState>;

export type WizardValueType = unknown;
export type WizardAction = {
  type: WizardActionTypes;
  value?: WizardValueType;
};

export type WizardActionTypes =
  | "setSteps"
  | "nextStep"
  | "previousStep"
  | "setWizardState"
  | "setWizardAnswer"
  | "resetWizardProgress"
  | "setSessionId"
  | "setQuote"
  | "handleNextAsync";

export type WizardState = {
  sessionId: string | null;
  completedSteps: WizardStep[];
  currentStep: WizardStepDefinition | undefined;
  currentState: unknown | undefined;
  answer: WizardStepResult | undefined;
  stepAnswers: WizardStepResults;
  stepStates: WizardStates;
  sessions: Record<string, WizardState>;
};
export type WizardDispatch = (action: WizardAction) => void;
export type WizardRedux = {
  state: WizardState;
  dispatch: WizardDispatch;
};

export type StepsSchema = JsonSchema[];
export type StepUISchema = Layout & { elements: ControlElement[] };
export type StepsUISchema = StepUISchema[];
