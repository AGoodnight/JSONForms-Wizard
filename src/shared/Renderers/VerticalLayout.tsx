import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  Layout,
  UISchemaElement,
} from "@jsonforms/core";
import { JsonFormsDispatch, withJsonFormsLayoutProps } from "@jsonforms/react";
import { FormEvent, useCallback } from "react";

type VerticalFormRendererProps = {
  uischema: UISchemaElement;
  visible: boolean;
  schema: JsonSchema;
  data?: any;
  path: string;
  enabled: boolean;
  renderers?: JsonFormsRendererRegistryEntry[] | undefined;
  cells?: JsonFormsCellRendererRegistryEntry[] | undefined;
};

const VerticalFormRenderer = (props: VerticalFormRendererProps) => {
  // there is a type mismatch, so we are casting the the type that reflects the actual value provided
  const uiSchema = props.uischema as Layout & { label: string };
  // console.log(props.schema);

  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <form className="uk-margin" onSubmit={onSubmit}>
      {props.visible &&
        uiSchema.elements.map((child: any, index: any) => (
          // Each form control is rendered by this dispatch
          <JsonFormsDispatch
            schema={props.schema}
            uischema={child}
            path={props.path}
            enabled={props.enabled}
            renderers={props.renderers}
            cells={props.cells}
            key={index}
          />
        ))}
    </form>
  );
};
export default withJsonFormsLayoutProps(VerticalFormRenderer);
