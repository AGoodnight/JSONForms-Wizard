import { ControlProps, JsonSchema7 } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useEffect, useMemo, useState } from "react";
import UKSelect, { UKSelectOptionDefinition } from "shared/ukLibrary/ukSelect";
import { ukError } from "shared/ukLibrary/models/input.models";
import { ukOption } from "shared/ukLibrary/models/uk.models";

type SelectRendererProps = ControlProps & {
  data: any;
  handleChange: (path: string, value: any) => void;
  path: string;
};

const SelectRenderer = (props: SelectRendererProps) => {
  const [error, setError] = useState<ukError[]>();
  const [pristine, setPristine] = useState(true);

  const requiredField = useMemo(
    () => props.rootSchema.required?.includes(props.path),
    [props.path, props.rootSchema]
  );
  const schema: JsonSchema7 = useMemo(
    () => props.schema as JsonSchema7,
    [props.schema]
  );
  const selectOptions: UKSelectOptionDefinition[] = useMemo(() => {
    const options: ukOption[] | undefined = schema?.properties?.default?.enum;
    return options
      ? options.map((option: ukOption) => {
          return { name: option.label, value: option.value };
        })
      : [];
  }, [schema]);

  const handleChange = (ev: any) => {
    setPristine(false);
    console.log(ev.target.value);
    props.handleChange(props.path, ev.target.value);
  };

  useEffect(() => {
    if (pristine) {
      return;
    }

    if (props.errors) {
      setError([
        {
          severity: "danger",
          message: schema.errorMessage || props.errors,
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
  }, [props.errors, props.data, schema.errorMessage, requiredField, pristine]);

  return (
    <div className="uk-form-controls">
      <h3>{props.schema.title}</h3>
      <p>{props.schema.description}</p>
      <UKSelect
        errors={error}
        required={requiredField}
        label={props.label || (schema.title as string)}
        value={props.data}
        options={selectOptions}
        onChange={handleChange}
      />
    </div>
  );
};

export default withJsonFormsControlProps(SelectRenderer);
