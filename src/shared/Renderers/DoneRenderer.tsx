import { ControlProps } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useWizardContext } from "components/Wizard/wizard.context";
import { ROUTES } from "constants/routes.constants";
import UKButton from "shared/ukLibrary/ukButton";

type DoneRendererProps = ControlProps & {
  data: any;
  handleChange: (path: string, value: any) => void;
  path: string;
};

const DoneRenderer = (props: DoneRendererProps) => {
  const { state: wizardState } = useWizardContext();
  const navigate = useNavigate();

  const wizardId = useMemo(() => {
    return wizardState.sessionId ?? undefined;
  }, [wizardState.sessionId]);

  const handleAccepted = useCallback(() => {
    navigate(`/${ROUTES.signUp}/${wizardId}`);
  }, [wizardId, navigate]);

  const handleNotAccepted = useCallback(() => {}, []);

  return (
    <div>
      <div>
        <h2>Your Done</h2>
        <UKButton variant="card" size="large" onClick={handleAccepted}>
          Looks Good
        </UKButton>
        <UKButton
          variant="outlined"
          color="danger"
          size="large"
          onClick={handleNotAccepted}
        >
          No Thanks
        </UKButton>
      </div>
    </div>
  );
};

export default withJsonFormsControlProps(DoneRenderer);
