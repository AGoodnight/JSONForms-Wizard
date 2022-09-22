/**
 * Loads custom environment variable or returns empty string, if not found.
 *
 * All custom environment variables must be prefixed with REACT_APP_
 * @link https://create-react-app.dev/docs/adding-custom-environment-variables/
 */
const env = (key: string) => process.env[`REACT_APP_${key}`] ?? "";

/**
 * Environment variables are injected from .env at build-time via dotenv.
 * @link https://github.com/motdotla/dotenv
 */
const ENV = {
  quote: env("QUOTE_ENDPOINT"),
  shapes: env("SHAPES_ENDPOINT"),
  answers: env("ANSWERS_ENDPOINT"),
};

export default ENV;
