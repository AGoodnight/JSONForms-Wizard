import React, { Ref, useState } from "react";
import { ukError } from "./models/input.models";
import { ukTextColor } from "./models/uk.models";
import UKHelperText from "./ukHelperText";

export type UKRadioOptionDefinition = {
  name: string;
  value: string;
};

export type UKRadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  required: boolean | undefined;
  errors: ukError[] | undefined;
  label: string;
  options: UKRadioOptionDefinition[];
};

const UKRadio = React.forwardRef((props: UKRadioProps, ref: Ref<any>) => {
  const [value, setValue] = useState<
    string | number | readonly string[] | undefined
  >();

  const handleChange = (ev: any) => {
    const _ev = Object.assign({}, ev, {
      target: Object.assign({}, ev.target, {
        value: {
          label: ev.target.dataset.name,
          value: ev.target.value,
        },
      }),
    });
    console.log(_ev);
    props.onChange?.(_ev);
  };
  return (
    <div className="uk-margin-top">
      <label className="uk-form-label">{props.label as string}</label>
      {props.options.map((option) => {
        return (
          <div
            key={`input-wrapper-${option.name}`}
            className="uk-form-controls"
          >
            <input
              ref={ref}
              className="uk-radio"
              type="radio"
              key={`uk-radio-${option.name}`}
              checked={value === option.value}
              data-name={option.name}
              onChange={handleChange}
              value={option.value}
            />
            {option.name}
          </div>
        );
      })}

      {props.errors &&
        props.errors.map((error: ukError) => {
          return (
            <UKHelperText
              key={error.message}
              color={error.severity as ukTextColor}
              size="small"
            >
              {error.message}
            </UKHelperText>
          );
        })}
    </div>
  );
});

export default UKRadio;
