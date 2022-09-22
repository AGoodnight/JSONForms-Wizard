export type ServiceSignUpState = {
  quote: string | null;
  address: string | null;
  wizardSessionId: string | null;
  primaryContact?: string;
  comments?: string;
  phoneNumber?: string;
};

export type ServiceSignUpValue = Record<string, unknown>;
export type ServiceSignUpTypes = "setValue";

export type ServiceSignUpDispatch = (action: ServiceSignUpAction) => void;
export type ServiceSignUpRedux = {
  state: ServiceSignUpState;
  dispatch: ServiceSignUpDispatch;
};

export type ServiceSignUpAction = {
  type: ServiceSignUpTypes;
  value?: ServiceSignUpValue;
};
