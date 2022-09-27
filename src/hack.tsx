import { ToolBarProvider } from "components/ToolBar/toolbar.context";
import Wizard from "./components/Wizard";
import { WizardProvider } from "./components/Wizard/wizard.context";
import { KeyboardEventsProvider } from "store/keyBoard.context";
import { Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import ServiceSignUp from "./screens/Contact/Contact";
import { ServiceSignUpProvider } from "./screens/Contact/Contact.context";
import { ROUTES } from "./constants/routes.constants";
import GetStarted from "./screens/GetStarted/GetStarted";
import { Provider } from "react-redux";
import AppStore from "./store/app.store";
import { ArtBoardProvider } from "components/ArtBoard/artboard.context";
import { ShapesProvider } from "components/ArtBoard/shapes.context";
import MakeAGreetingCard from "screens/MakeAGreetingCard/MakeAGreetingCard";

function Hack() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<GetStarted />} />
        <Route
          path={ROUTES.wizard}
          element={
            <WizardProvider>
              <Provider store={AppStore}>
                <MakeAGreetingCard />
              </Provider>
            </WizardProvider>
          }
        />
        <Route
          path={`${ROUTES.signUp}/:id`}
          element={
            <WizardProvider>
              <ServiceSignUpProvider>
                <ServiceSignUp />
              </ServiceSignUpProvider>
            </WizardProvider>
          }
        />
      </Route>
    </Routes>
  );
}

export default Hack;
