import { and, JsonSchema, schemaMatches, Tester } from "@jsonforms/core";

type JsonSchemaWithComponent = JsonSchema & { component: string };

export const inputTester: Tester = and(
  schemaMatches((schema) => {
    const schemaJson = schema as JsonSchemaWithComponent;
    return (
      schemaJson.hasOwnProperty("component") && schemaJson.component === "input"
    );
  })
);

export const dropdownTester: Tester = and(
  schemaMatches((schema) => {
    const schemaJson = schema as JsonSchemaWithComponent;
    return (
      schemaJson.hasOwnProperty("component") &&
      schemaJson.component === "dropdown"
    );
  })
);

export const radioTester: Tester = and(
  schemaMatches((schema) => {
    const schemaJson = schema as JsonSchemaWithComponent;
    return (
      schemaJson.hasOwnProperty("component") && schemaJson.component === "radio"
    );
  })
);
