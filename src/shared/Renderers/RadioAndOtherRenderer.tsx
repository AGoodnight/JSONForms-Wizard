import { ControlProps, JsonSchema7 } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UKRadioOptionDefinition } from "shared/ukLibrary/ukRadio";
import { ukError } from "shared/ukLibrary/models/input.models";
import UKRadio from "shared/ukLibrary/ukRadio";
import { ukOption } from "shared/ukLibrary/models/uk.models";
import UKTextArea from "shared/ukLibrary/ukTextArea";

type RadioAndOtherRendererProps = ControlProps & {
  data: any;
  handleChange: (path: string, value: any) => void;
  path: string;
};

const RadioAndOtherRenderer = (props: RadioAndOtherRendererProps) => {
  const [error, setError] = useState<ukError[]>();
  const [pristine, setPristine] = useState(true);
  const [otherValue, setOtherValue] = useState<string | undefined>();
  const [radioValue, setRadioValue] = useState<
    { label: string; value: string } | undefined
  >();

  const requiredField = useMemo(
    () => props.rootSchema.required?.includes(props.path),
    [props.path, props.rootSchema]
  );
  const schema: JsonSchema7 = useMemo(
    () => props.schema as JsonSchema7,
    [props.schema]
  );
  const radioOptions: UKRadioOptionDefinition[] = useMemo(() => {
    const options: ukOption[] | undefined = schema?.properties?.default?.enum;
    return options
      ? options.map((option: ukOption) => {
          return { name: option.label, value: option.value };
        })
      : [];
  }, [schema]);

  const handleChange = useCallback(
    (ev: any) => {
      setRadioValue(ev.target.value);
      setPristine(false);
      const payload = {
        label: ev.target.value.label,
        value: ev.target.value.value,
        extra: otherValue,
      };
      console.log(payload);
      props.handleChange(props.path, payload);
    },
    [props, otherValue]
  );

  const handleOtherChange = useCallback(
    (ev: any) => {
      setOtherValue(ev.target.value);
      setPristine(false);
      const payload = {
        label: radioValue?.label,
        value: radioValue?.value,
        extra: ev.target.value,
      };
      console.log(payload);
      props.handleChange(props.path, payload);
    },
    [props, radioValue]
  );

  useEffect(() => {
    if (props.data?.label && props.data?.value) {
      setRadioValue({ label: props.data.label, value: props.data.value });
    }
    if (props.data?.extra) {
      setOtherValue(props.data.extra);
    }
  }, [props.data]);

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
    <>
      <h3>{schema.title}</h3>
      <p>{schema.description}</p>
      <UKRadio
        errors={undefined}
        required={requiredField}
        label={""}
        value={props.data}
        options={radioOptions}
        onChange={handleChange}
      />
      <h5>Further Instructions</h5>
      <UKTextArea
        onChange={handleOtherChange}
        value={props?.data?.extra}
        label={""}
      />
    </>
  );
};

export default withJsonFormsControlProps(RadioAndOtherRenderer);
