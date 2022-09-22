import { ControlProps } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { DrawingToolBar } from "components/ToolBar/drawingToolBar";
import ArtBoard from "../components/artboard/artboard";

type DrawingRendererProps = ControlProps & {
  data: any;
  handleChange: (path: string, value: any) => void;
  path: string;
};

const DrawingRenderer = (props: DrawingRendererProps) => {
  return (
    <div className="uk-flex">
      <DrawingToolBar />
      <ArtBoard isFinalized={false} />
    </div>
  );
};

export default withJsonFormsControlProps(DrawingRenderer);
