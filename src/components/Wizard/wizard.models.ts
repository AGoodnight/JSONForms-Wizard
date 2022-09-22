import { ControlElement, JsonSchema, Layout } from "@jsonforms/core";
import { Shape } from "konva/lib/Shape";

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

export type WizardStepValue =
  | string
  | WizardPropertyStepValue
  | WizardQuoteStepValue
  | { value: string; label: string }
  | Shape[];

export type WizardStep =
  | "address"
  | "map"
  | "property"
  | "parking"
  | "gate"
  | "notes"
  | "quality"
  | "quote";
export type WizardAnswers = Record<WizardStep, any>;

export type WizardValueType =
  | string
  | WizardStepDefinition
  | Record<string, unknown>;
export type WizardAction = {
  type: WizardActionTypes;
  value?: WizardValueType;
};

export type WizardActionTypes =
  | "setSteps"
  | "nextStep"
  | "previousStep"
  | "setAnswer"
  | "resetWizardProgress"
  | "setSessionId"
  | "setQuote"
  | "handleNextAsync";

export type WizardState = {
  sessionId: string | null;
  completedSteps: WizardStep[];
  currentStep: WizardStepDefinition | undefined;
  answers: Record<WizardStep, WizardStepValue> | undefined;
};
export type WizardDispatch = (action: WizardAction) => void;
export type WizardRedux = {
  state: WizardState;
  dispatch: WizardDispatch;
};

export type StepsSchema = JsonSchema[];
export type StepsUISchema = Layout[] & { elements: ControlElement[] }[];
