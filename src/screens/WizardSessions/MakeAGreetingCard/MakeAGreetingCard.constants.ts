import {
  StepsSchema,
  StepsUISchema,
} from "../../../components/Wizard/wizard.models";

export const STEP_UI_SCHEMAS: StepsUISchema = [
  {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/default/address",
      },
    ],
  },
  {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/default/map",
      },
    ],
  },
  {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/default/artboard",
      },
    ],
  },
];

export const STEP_SCHEMAS: StepsSchema = [
  {
    $id: "address",
    type: "object",
    description: "",
    title: "",
    properties: {
      default: {
        type: "string",
        title: "",
      },
    },
    required: ["default"],
  },
  {
    $id: "map",
    type: "object",
    description: "",
    title: "",
    properties: {
      default: {
        type: "object",
        title: "",
      },
    },
    required: ["default"],
  },
  {
    $id: "artboard",
    type: "object",
    description: "",
    title: "",
    properties: {
      default: {
        type: "string",
        title: "",
      },
    },
    required: ["default"],
  },
];
