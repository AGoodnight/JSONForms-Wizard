import { REGEX_MATCHING_PATTERNS } from "constants/regexp.constants";

export const isEmail = (email: string) => {
  return new RegExp(REGEX_MATCHING_PATTERNS.email).test(email);
};
