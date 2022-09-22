import { isEmail } from "utils/validators/email.validator";
import { globalajv } from "utils/jsonforms/globals";

export const addCustomFormats = () => {
  globalajv.addFormat("emailAddress", isEmail);
  // Add more formats here ...
};
