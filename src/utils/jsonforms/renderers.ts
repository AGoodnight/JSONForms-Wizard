import {
  isStringControl,
  rankWith,
  scopeEndsWith,
  uiTypeIs,
} from "@jsonforms/core";
import AddressRenderer from "shared/Renderers/AddressRenderer";
import MapRenderer from "components/MapBox/renderers/MapRenderer";
import DoneRenderer from "shared/Renderers/DoneRenderer";
import RadioRenderer from "shared/Renderers/RadioRenderer";
import RadioAndOtherRenderer from "shared/Renderers/RadioAndOtherRenderer";
import SelectRenderer from "shared/Renderers/SelectRenderer";
import TextAreaRenderer from "shared/Renderers/TextAreaRenderer";
import TextFieldRenderer from "shared/Renderers/TextFieldRenderer";
import VerticalLayout from "shared/Renderers/VerticalLayout";
import SpeedRenderer from "shared/Renderers/SpeedRenderer";
import ArtBoardRenderer from "components/ArtBoard/renderer/ArtBoardRenderer";

export const customRenderers = [
  // Add more renderers here ...
  {
    tester: rankWith(3, isStringControl),
    renderer: TextFieldRenderer,
  },
  {
    tester: rankWith(3, scopeEndsWith("speed")),
    renderer: SpeedRenderer,
  },
  {
    tester: rankWith(3, scopeEndsWith("textarea")),
    renderer: TextAreaRenderer,
  },
  {
    tester: rankWith(3, scopeEndsWith("address")),
    renderer: AddressRenderer,
  },
  {
    tester: rankWith(5, scopeEndsWith("radio")),
    renderer: RadioRenderer,
  },
  {
    tester: rankWith(5, scopeEndsWith("radio_and_other")),
    renderer: RadioAndOtherRenderer,
  },
  {
    tester: rankWith(5, scopeEndsWith("select")),
    renderer: SelectRenderer,
  },
  {
    tester: rankWith(5, scopeEndsWith("map")),
    renderer: MapRenderer,
  },
  {
    tester: rankWith(5, scopeEndsWith("done")),
    renderer: DoneRenderer,
  },
  {
    tester: rankWith(5, scopeEndsWith("artboard")),
    renderer: ArtBoardRenderer,
  },
  {
    tester: rankWith(5, uiTypeIs("VerticalLayout")),
    renderer: VerticalLayout,
  },
];
