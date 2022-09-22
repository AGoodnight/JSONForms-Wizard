import { createAjv } from "@jsonforms/core";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import { customRenderers } from "utils/jsonforms/renderers";

export const globalCells = vanillaCells;
export const globalRenderer = [...vanillaRenderers, ...customRenderers];

export const globalajv = createAjv({
  allErrors: true,
});
