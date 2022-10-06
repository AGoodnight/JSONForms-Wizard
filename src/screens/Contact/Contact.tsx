import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import ContactDetails, {
  ContactDetailValues,
} from "./components/ContactForm/ContactForm";
import Progress from "shared/Progress/Progress";
import UKAlert from "shared/ukLibrary/ukAlert";
import UKButton from "shared/ukLibrary/ukButton";
import { ROUTES } from "constants/routes.constants";
import { STEP_UI_SCHEMAS } from "screens/WizardSessions/MakeAGreetingCard/MakeAGreetingCard.constants";
import { useServiceSignUpContext } from "screens/Contact/Contact.context";

const ServiceSignUp = () => {
  const { state, dispatch } = useServiceSignUpContext();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: "setValue",
        value: { wizardSessionId: params.id },
      });
    }
  }, [params, dispatch]);

  const invalidSessionError: boolean = useMemo(() => {
    return state.wizardSessionId && state.address ? false : true;
  }, [state]);

  const handlePrevious = () => {
    navigate("/" + ROUTES.wizard);
  };

  const answers: ContactDetailValues = useMemo(() => {
    return {
      address: state.address ?? undefined,
      phone: state.phoneNumber ?? undefined,
      name: state.primaryContact ?? undefined,
      comments: state.comments ?? undefined,
    };
  }, [state]);
  return (
    <div className="uk-children-absolute">
      {!invalidSessionError && (
        <div className="wizard-container">
          <div className="wizard-header">
            <Progress value={100} />
            <div className="header-options">
              <div className="progress-details">{`Steps ${
                Object.keys(STEP_UI_SCHEMAS).length
              }/${Object.keys(STEP_UI_SCHEMAS).length} Completed`}</div>
            </div>
          </div>
          <div className="wizard-step">
            <div className="uk-container-small">
              <ContactDetails answers={answers}></ContactDetails>
            </div>
            <div className="uk-margin uk-button-bar horizontal">
              <UKButton onClick={handlePrevious}>Previous</UKButton>
            </div>
          </div>
        </div>
      )}
      {invalidSessionError && (
        <div className="wizard-container">
          <div className="wizard-step">
            <div className="uk-container-small">
              <UKAlert severity="danger">
                This session is no longer valid
              </UKAlert>
            </div>
            <div className="uk-margin horizontal">
              <UKButton onClick={handlePrevious}>Start Again</UKButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSignUp;
