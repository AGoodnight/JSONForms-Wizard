import { ArtBoardProvider } from "components/ArtBoard/artboard.context";
import { ShapesProvider } from "components/ArtBoard/shapes.context";
import { ToolBarProvider } from "components/ToolBar/toolbar.context";
import Wizard from "components/Wizard";
import useSteps from "components/Wizard/hooks/useSteps";
import { useWizardContext } from "components/Wizard/wizard.context";
import {
  StepUISchema,
  WizardState,
  WizardStep,
  WizardStepResult,
} from "components/Wizard/wizard.models";
import useAnswers, { AnswersResponse } from "hooks/useAnswers";
import useResolvePayload from "hooks/useResolvePayload";
import { useCallback, useState } from "react";
import { GlobalAppState } from "store/app.store";
import { useMapBoxSelector } from "components/MapBox/store/mapBox.hook";
import {
  useWizardSessionsSelector,
  useWizardSessionsDispatch,
} from "screens/WizardSessions/store/wizardSessions.hook";
import { KeyboardEventsProvider } from "store/keyBoard.context";
import { STEP_SCHEMAS, STEP_UI_SCHEMAS } from "./MakeAGreetingCard.constants";
import { setSession } from "../store/wizardSessions.slice";

const MakeAGreetingCard = () => {
  const { state, dispatch } = useWizardContext();
  const mapBoxState = useMapBoxSelector(
    (state: GlobalAppState) => state.mapBox
  );
  const dispatchToSessions = useWizardSessionsDispatch();

  const [navigating, setNavigating] = useState<boolean>(false);
  const { createPayload } = useResolvePayload();
  const { sendAnswer, error: answersError } = useAnswers();

  const { sessionId, currentStep, currentStepUISchema } = useSteps(
    "greetingCard",
    STEP_SCHEMAS,
    STEP_UI_SCHEMAS
  );

  const handleWizardChange = useCallback(
    (session: WizardState) => {
      dispatchToSessions(setSession({ id: "greetingCard", state: session }));
    },
    [dispatchToSessions]
  );

  const beforeNext = useCallback(
    async (cb?: (result: WizardStepResult) => void) => {
      const thisStepKey: string | undefined = currentStep?.schemaKey;
      setNavigating(true);
      const answer = state.answer;
      if (thisStepKey && answer) {
        const _payload = await createPayload({
          step: currentStep,
          result: answer,
          uiSchema: currentStepUISchema as StepUISchema,
          sessionId,
        });
        if (_payload) {
          sendAnswer(thisStepKey as WizardStep, _payload)
            .then((response: AnswersResponse | undefined) => {
              switch (response?.schemaKey) {
                case "map":
                  dispatch({
                    type: "setSessionId",
                    value: response.response.id,
                  });
                  break;
              }
              setNavigating(false);
              cb?.(answer);
              dispatch({
                type: "setWizardState",
                value: { key: thisStepKey, value: mapBoxState },
              });
            })
            .catch((e) => {
              setNavigating(false);
              cb?.(answer);
              dispatch({
                type: "setWizardState",
                value: { key: thisStepKey, value: mapBoxState },
              });
            });
        } else {
          console.log("no Payload");
          setNavigating(false);
          cb?.(answer);
          dispatch({
            type: "setWizardState",
            value: {},
          });
        }
      }
    },
    [
      sessionId,
      currentStep,
      currentStepUISchema,
      createPayload,
      dispatch,
      mapBoxState,
      sendAnswer,
      state,
    ]
  );

  return (
    <KeyboardEventsProvider>
      <ToolBarProvider>
        <ShapesProvider>
          <ArtBoardProvider>
            <Wizard
              sessionId="greetingCard"
              onNext={beforeNext}
              onChange={handleWizardChange}
              navigating={navigating}
              error={answersError}
              schemas={{ steps: STEP_SCHEMAS, ui: STEP_UI_SCHEMAS }}
            />
          </ArtBoardProvider>
        </ShapesProvider>
      </ToolBarProvider>
    </KeyboardEventsProvider>
  );
};

export default MakeAGreetingCard;
