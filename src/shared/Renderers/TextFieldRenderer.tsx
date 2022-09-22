import { ControlProps, JsonSchema7 } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useEffect, useState } from "react";
import UKTextField from "shared/ukLibrary/ukTextField";
import { ukError } from "shared/ukLibrary/models/input.models";

type TextFieldRendererProps = ControlProps & {
  data: any;
  handleChange: (path: string, value: any) => void;
  path: string;
};

const TextFieldRenderer = (props: TextFieldRendererProps) => {
  const [error, setError] = useState<ukError[]>();
  const [pristine, setPristine] = useState(true);

  const schema = props.schema as JsonSchema7;
  const requiredField = props.rootSchema.required?.includes(props.path);
  const handleChange = (ev: any) => {
    setPristine(false);
    props.handleChange(props.path, String(ev.target.value));
  };

  useEffect(() => {
    if (pristine) {
      return;
    }

    if (props.errors) {
      const propSchema = props.rootSchema.properties?.[
        props.path
      ] as JsonSchema7;
      setError([
        {
          severity: "danger",
          message: propSchema.errorMessage || props.errors,
          error: "default",
        },
      ]);
    } else if (requiredField && props.data.length < 1) {
      setError([
        {
          severity: "danger",
          message: "is a required property",
          error: "default",
        },
      ]);
    } else {
      setError(undefined);
    }
  }, [
    props.path,
    props.errors,
    props.rootSchema,
    props.data,
    requiredField,
    pristine,
  ]);

  return (
    <div className="uk-form-controls">
      <UKTextField
        errors={error}
        required={requiredField}
        label={props.label || (schema.title as string)}
        value={props.data}
        onChange={handleChange}
      />
    </div>
  );
};

export default withJsonFormsControlProps(TextFieldRenderer);
