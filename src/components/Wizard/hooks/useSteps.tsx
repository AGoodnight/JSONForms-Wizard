import { STARTING_STEP, useWizardContext } from "../wizard.context";
import { useEffect, useMemo } from "react";
import { StepsSchema, StepsUISchema, WizardStep } from "../wizard.models";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { useWizardSessionsSelector } from "screens/WizardSessions/store/wizardSessions.hook";

const useSteps = (
  thisSessionId: string,
  schema: StepsSchema,
  uiSchema: StepsUISchema
) => {
  const { state, dispatch } = useWizardContext();
  const sessionsState = useWizardSessionsSelector(
    (state) => state.wizardSessions
  );

  useEffect(() => {
    dispatch({
      type: "setWizardState",
      value: sessionsState.sessions[thisSessionId],
    });
  }, []);

  const sessionId: string | null = useMemo(() => {
    return state.sessionId;
  }, [state.sessionId]);

  const currentStep = useMemo(() => {
    return state.currentStep;
  }, [state.currentStep]);

  const hasPrevious: boolean = useMemo(() => {
    return schema ? currentStep?.index! > 0 : false;
  }, [currentStep, schema]);

  const hasNext: boolean = useMemo(() => {
    return schema ? currentStep?.index! < schema.length - 1 : false;
  }, [currentStep, schema]);

  const nextStep: JsonSchema | null = useMemo(() => {
    return hasNext && currentStep ? schema[currentStep.index + 1] : null;
  }, [currentStep, hasNext, schema]);

  const previousStep: JsonSchema | null = useMemo(() => {
    return hasPrevious && currentStep ? schema[currentStep.index - 1] : null;
  }, [currentStep, schema, hasPrevious]);

  const stepsCompleted: number = useMemo(() => {
    return (
      Object.keys(state?.stepAnswers!)?.filter((key: string) => {
        return !!state?.stepAnswers?.[key as WizardStep];
      }).length || 0
    );
  }, [state.stepAnswers]);

  const currentStepJSONSchema: JsonSchema = useMemo(() => {
    const _schema: JsonSchema =
      schema[state.currentStep?.index || STARTING_STEP?.index];
    return _schema;
  }, [state.currentStep, schema]);

  const currentStepUISchema: UISchemaElement = useMemo(() => {
    const _schema: UISchemaElement =
      uiSchema[state.currentStep?.index || STARTING_STEP?.index];
    return _schema;
  }, [state.currentStep, uiSchema]);

  const currentStepData: { default: unknown } = useMemo(() => {
    console.log(state.answer);
    if (state.answer) {
      return { default: state.answer };
    }
    const stepSchemaKey: WizardStep = state.currentStep
      ?.schemaKey as WizardStep;
    return stepSchemaKey
      ? { default: state.stepAnswers?.[stepSchemaKey] }
      : { default: undefined };
  }, [state.answer, state.stepAnswers, state.currentStep]);

  const currentStepState: { default: unknown } = useMemo(() => {
    const stepSchemaKey: WizardStep = state.currentStep
      ?.schemaKey as WizardStep;
    return stepSchemaKey
      ? { default: state.stepStates?.[stepSchemaKey] }
      : { default: undefined };
  }, [state.stepStates, state.currentStep?.schemaKey]);

  const stepProgress = useMemo(() => {
    const completed: number =
      Object.keys(state?.stepAnswers!)?.filter((key: string) => {
        return !!state?.stepAnswers?.[key as WizardStep];
      }).length || 0;
    const progress = completed / Object.keys(uiSchema).length;
    return progress * 100;
  }, [state.stepAnswers, uiSchema]);

  const numOfSteps = useMemo(() => {
    return uiSchema.length;
  }, [uiSchema]);

  return {
    sessionId,
    currentStep,
    hasNext,
    hasPrevious,
    nextStep,
    previousStep,
    currentStepJSONSchema,
    currentStepUISchema,
    currentStepData,
    stepsCompleted,
    stepProgress,
    numOfSteps,
    currentStepState,
    currentSession: state,
  };
};

export default useSteps;
