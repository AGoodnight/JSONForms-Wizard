import { JsonSchema } from "@jsonforms/core";
import {
  useContext,
  createContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { STEP_SCHEMAS } from "../../screens/MakeAGreetingCard/MakeAGreetingCard.constants";
import {
  WizardAction,
  WizardAnswers,
  WizardRedux,
  WizardState,
  WizardStep,
  WizardStepDefinition,
} from "./wizard.models";

const resolveProps = (index: number) => {
  if (index < 0) {
    return undefined;
  }
  if (!STEP_SCHEMAS[index].properties) {
    return undefined;
  }
  return STEP_SCHEMAS[index].properties;
};

const asStepDef = (
  index: number,
  state: WizardState
): WizardStepDefinition | undefined => {
  const _schema: JsonSchema & { $id: string } = STEP_SCHEMAS[
    index
  ] as JsonSchema & { $id: string };
  if (!_schema?.$id) {
    return undefined;
  }
  return {
    index: index,
    complete: state.completedSteps?.indexOf(_schema.$id as WizardStep)! > -1,
    schemaKey: _schema.$id,
  };
};

export const STARTING_STEP_INDEX: number = 0;
export const STARTING_STEP_SCHEMA_$ID: string = "address";
export const STARTING_STEP =
  asStepDef(0, {
    sessionId: null,
    answers: {} as WizardAnswers,
    completedSteps: [],
    currentStep: {
      schemaKey: STARTING_STEP_SCHEMA_$ID,
      index: STARTING_STEP_INDEX,
      complete: false,
    },
  }) || ({} as WizardStepDefinition);

export const WIZARD_INITIAL_STATE: WizardState = {
  sessionId: null,
  currentStep: STARTING_STEP,
  completedSteps: [],
  answers: {} as WizardAnswers,
};

const wizardReducer = (state: WizardState, action: WizardAction) => {
  const _state = state;
  const _cIndex = _state.currentStep?.index || STARTING_STEP_INDEX;
  const _cKey = _state.currentStep?.schemaKey || undefined;

  switch (action.type) {
    case "nextStep":
      if (_cIndex > -1 && _cKey && resolveProps(_cIndex)) {
        const currentAnswers = _state.answers;
        const _nextStep = asStepDef(_cIndex + 1, _state) || STARTING_STEP;

        return Object.assign({}, _state, {
          currentStep: _nextStep,
          answers: Object.assign({}, currentAnswers, {
            [_cKey]: action.value,
          }),
          complete: !!action.value,
        });
      } else {
        return _state;
      }

    case "previousStep":
      if (_cIndex > 0 && _cKey && resolveProps(_cIndex)) {
        const currentAnswers = _state.answers;
        const _previousStep = asStepDef(_cIndex - 1, _state) || STARTING_STEP;

        return Object.assign({}, _state, {
          currentStep: _previousStep,
          answers: Object.assign({}, currentAnswers, {
            [_cKey]: action.value,
          }),
          complete: !!action.value,
        });
      } else {
        return _state;
      }

    case "resetWizardProgress":
      return Object.assign({}, WIZARD_INITIAL_STATE, {
        id: null,
        currentStep: STARTING_STEP,
      });

    case "setAnswer":
      if (_state.currentStep?.schemaKey) {
        const currentAnswers = _state.answers;
        return Object.assign({}, _state, {
          answers: Object.assign({}, currentAnswers, {
            [_state.currentStep?.schemaKey]: action.value,
          }),
          complete: !!action.value,
        });
      } else {
        return _state;
      }

    case "setSessionId":
      return Object.assign({}, _state, {
        sessionId: action.value,
      });

    case "setQuote":
      return Object.assign({}, _state, {
        quote: action.value,
      });

    default:
      return state;
  }
};

const getLocalWizardState = () => {
  const localState = localStorage.getItem("wizardState");
  return localState ? JSON.parse(localState) : WIZARD_INITIAL_STATE;
};

export const WizardContext = createContext<WizardRedux | undefined>(
  getLocalWizardState()
);

export const WizardProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wizardReducer, getLocalWizardState());
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem("wizardState", JSON.stringify(state));
  }, [state]);

  return (
    <WizardContext.Provider value={value}>
      {props.children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizardContext must be used within a WizardProvider");
  }
  return context;
};
