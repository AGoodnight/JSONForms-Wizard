import { JsonForms } from "@jsonforms/react";
import { useCallback, useEffect, useState } from "react";
import Loading from "shared/Loading/Loading";
import Progress from "shared/Progress/Progress";
import UKButton from "shared/ukLibrary/ukButton";
import UKIcon from "shared/ukLibrary/ukIcon";
import { globalajv, globalRenderer } from "utils/jsonforms";
import useSteps from "./hooks/useSteps";
import { useWizardContext } from "./wizard.context";
import {
  StepsSchema,
  StepsUISchema,
  WizardAnswer,
  WizardStepResult,
} from "./wizard.models";

type WizardProps = React.HTMLAttributes<HTMLDivElement> & {
  onNext?: (cb?: (answer: WizardAnswer | undefined) => void) => void;
  onPrevious?: (cb?: (answer: WizardAnswer | undefined) => void) => void;
  onChange?: (answer: unknown, cb?: () => void) => void;
  onReset?: (cb?: () => void) => void;
  error: Error | undefined;
  navigating?: boolean;
  schemas: { steps: StepsSchema; ui: StepsUISchema };
};

const Wizard = ({
  onNext,
  onPrevious,
  onReset,
  navigating,
  error,
  schemas,
}: WizardProps) => {
  const { dispatch } = useWizardContext();
  const [isValid, setIsValid] = useState<boolean>(false);

  const {
    hasNext,
    hasPrevious,
    stepsCompleted,
    currentStepData,
    currentStepUISchema,
    currentStepJSONSchema,
    stepProgress,
    numOfSteps,
  } = useSteps(schemas.steps, schemas.ui);

  useEffect(() => {
    if (error) {
      alert(error.message);
    }
  }, [error]);

  const resetWizard = useCallback(() => {
    onReset?.(() => {
      dispatch({
        type: "resetWizardProgress",
      });
    });
  }, [onReset, dispatch]);

  const handleNext = useCallback(() => {
    onNext?.((result: WizardAnswer | undefined) => {
      dispatch({
        type: "nextStep",
        value: result,
      });
    });
  }, [onNext, dispatch]);

  const handlePrevious = useCallback(async () => {
    onPrevious
      ? onPrevious((result: WizardAnswer | undefined) => {
          dispatch({
            type: "previousStep",
            value: result,
          });
        })
      : dispatch({
          type: "previousStep",
        });
  }, [onPrevious, dispatch]);

  const handleChange = useCallback(
    async (c: any) => {
      const _data = c.data.default?.length! < 1 ? undefined : c.data.default;
      delete _data?.extra;
      console.log(_data);
      dispatch({
        type: "setWizardAnswer",
        value: _data,
      });
      const _isValid = globalajv.validate(currentStepJSONSchema, {
        default: _data,
      });
      setIsValid(_isValid);
    },
    [setIsValid, currentStepJSONSchema, dispatch]
  );

  useEffect(() => {
    console.log(currentStepData);
  }, [currentStepData]);

  return (
    <div className="uk-children-absolute">
      <div className="wizard-container">
        <div className="wizard-header">
          <Progress value={stepProgress} />
          <div className="header-options">
            <div className="progress-details">{`Steps ${stepsCompleted}/${numOfSteps} Completed`}</div>
            <div className="buttons">
              <UKButton variant="text" onClick={resetWizard}>
                <span>Start Over</span>
                <UKIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="20"
                    height="20"
                  >
                    <path d="M483.515 28.485L431.35 80.65C386.475 35.767 324.485 8 256.001 8 119.34 8 7.9 119.525 8 256.185 8.1 393.067 119.095 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.353-12.561.482-17.433l-19.738-19.738c-4.498-4.498-11.753-4.785-16.501-.552C351.787 433.246 306.105 452 256 452c-108.321 0-196-87.662-196-196 0-108.321 87.662-196 196-196 54.163 0 103.157 21.923 138.614 57.386l-54.128 54.129c-7.56 7.56-2.206 20.485 8.485 20.485H492c6.627 0 12-5.373 12-12V36.971c0-10.691-12.926-16.045-20.485-8.486z" />
                  </svg>
                </UKIcon>
              </UKButton>
            </div>
          </div>
        </div>
        <div className="wizard-step">
          <div className="uk-container-small">
            <JsonForms
              renderers={globalRenderer}
              schema={currentStepJSONSchema}
              uischema={currentStepUISchema}
              onChange={handleChange}
              data={currentStepData}
            />
            <div className="uk-margin uk-button-bar horizontal">
              {hasPrevious && (
                <UKButton
                  color={!isValid ? "danger" : undefined}
                  onClick={handlePrevious}
                  disabled={!hasPrevious}
                >
                  Previous
                </UKButton>
              )}
              {hasNext && (
                <UKButton
                  color={!isValid ? "danger" : undefined}
                  onClick={handleNext}
                  disabled={!isValid}
                >
                  Next
                </UKButton>
              )}
            </div>
          </div>
        </div>
      </div>
      {navigating && <Loading display="fill" />}
    </div>
  );
};

export default Wizard;
