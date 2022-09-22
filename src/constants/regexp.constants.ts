// What do these REGEXP mean?
// -----------
//email: alphanumeric characters and/or any number of ". _ % + -" characters
//... that end with @ with alphabetical characters followe by a dot and at least two characters.
// mfaCode: 6 digits
// password: at least one UPPERCASE letter, at least one lowercase letter, at least one number,
//... at least one special character: ~!@#$%^*()_-+={}[]|:;”,?, do not use <>& or ',
//... at least 8, but no more than 32 characters.

export const REGEX_MATCHING_PATTERNS: Record<string, RegExp> = {
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/im,
  mfaCode: /^[0-9]{6}$/,
  password:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-~!@#$%^*()_+={}[\]|:;”,?])(?!.*?[<>&']).{8,32}$/,
};
