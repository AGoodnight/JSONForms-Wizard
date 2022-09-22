import { useNavigate } from "react-router";
import UKButton from "shared/ukLibrary/ukButton";
import { ROUTES } from "constants/routes.constants";

const GetStarted = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate(ROUTES.wizard);
  };
  return (
    <div className="uk-margin">
      <UKButton onClick={handleGetStarted}>Start</UKButton>
    </div>
  );
};

export default GetStarted;
