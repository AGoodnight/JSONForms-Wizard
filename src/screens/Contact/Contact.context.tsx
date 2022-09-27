import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  WizardStepResults,
  WizardState,
  WizardStep,
} from "../../components/Wizard/wizard.models";
import {
  ServiceSignUpAction,
  ServiceSignUpRedux,
  ServiceSignUpState,
} from "./Contact.models";

const getLocalServiceSignUpState = () => {
  const localState = localStorage.getItem("serviceSignUpState");
  const _parsedState = localState ? JSON.parse(localState) : INITIAL_STATE;
  return Object.assign({}, _parsedState, INITIAL_STATE);
};

const getWizardAnswer = (
  results: WizardStepResults = {} as WizardStepResults,
  key: WizardStep
) => {
  return results?.[key]?.answer ? results[key].answer : null;
};

const getWizardAnswers = () => getLocalWizardStateValue("stepAnswers");

const getLocalWizardStateValue = (key: string) => {
  const localWizardState = localStorage.getItem("wizardState");
  const _parsedState = localWizardState
    ? JSON.parse(localWizardState)
    : (EMPTY_STATE as WizardState);
  return _parsedState ? _parsedState[key] : undefined;
};

const EMPTY_STATE: Partial<WizardState> = {};

const INITIAL_STATE: ServiceSignUpState = {
  quote: String(getWizardAnswer(getWizardAnswers(), "quote")),
  wizardSessionId: null,
  address: String(getWizardAnswer(getWizardAnswers(), "address")),
};

const wizardReducer = (
  state: ServiceSignUpState,
  action: ServiceSignUpAction
) => {
  const _state = state;

  switch (action.type) {
    case "setValue":
      return Object.assign({}, _state, action.value);
    default:
      return state;
  }
};

export const ServiceSignUpContext = createContext<
  ServiceSignUpRedux | undefined
>(getLocalServiceSignUpState());

export const ServiceSignUpProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    wizardReducer,
    getLocalServiceSignUpState()
  );
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem("serviceSignUpState", JSON.stringify(state));
  }, [state]);

  return (
    <ServiceSignUpContext.Provider value={value}>
      {props.children}
    </ServiceSignUpContext.Provider>
  );
};

export const useServiceSignUpContext = () => {
  const context = useContext(ServiceSignUpContext);
  if (context === undefined) {
    throw new Error("useWizardContext must be used within a WizardProvider");
  }
  return context;
};
