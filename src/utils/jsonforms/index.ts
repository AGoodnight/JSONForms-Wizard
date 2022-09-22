import { addCustomFormats } from "utils/jsonforms/formats";
import {
  globalajv,
  globalCells,
  globalRenderer,
} from "utils/jsonforms/globals";

// We need to add the formats after globalAjv has been created, thus why we run this method here.
addCustomFormats();

export { globalajv, globalCells, globalRenderer };
