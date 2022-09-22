import React, { Ref, useMemo, useState } from "react";
import { ukError } from "./models/input.models";
import { ukTextColor } from "./models/uk.models";
import UKHelperText from "./ukHelperText";

export type UKSelectOptionDefinition = {
  name: string;
  value: string;
};

export type UKSelectProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errors?: ukError[];
  required?: boolean;
  label: string;
  options: UKSelectOptionDefinition[];
};

const UKSelect = React.forwardRef((props: UKSelectProps, ref: Ref<any>) => {
  const baseClassList = "uk-select";
  const [classList, setClassList] = useState<string>("uk-select");
  const [value, setValue] = useState<
    string | number | readonly string[] | undefined
  >();
  const sanitizedProps = useMemo(
    () =>
      Object.keys(props).reduce<Record<string, string>>(
        (propList: Record<string, string>, propKey: string) => {
          switch (propKey) {
            case "className":
              // could be extended to handle severity
              const errorClassList = !!props.errors
                ? props.errors.length > 0
                  ? "uk-form-danger"
                  : ""
                : "";

              setClassList(
                baseClassList + " " + props.className + " " + errorClassList
              );
              return propList;
            case "options":
              return propList;
            case "onChange":
              return propList;
            case "value":
              setValue(
                (propList[propKey] =
                  props[propKey as keyof UKSelectProps]?.value)
              );
              return propList;
            default:
              propList[propKey] = props[propKey as keyof UKSelectProps];
              return propList;
          }
        },
        {}
      ),
    [props]
  );

  const handleChange = (ev: any) => {
    const _ev = Object.assign({}, ev, {
      target: Object.assign({}, ev.target, {
        value: {
          label: ev.target.options[ev.target.selectedIndex].dataset.name,
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
      <select
        {...sanitizedProps}
        ref={ref}
        onChange={handleChange}
        defaultValue={value}
        className={classList}
      >
        <option key="" value="">
          Select a Choice
        </option>
        {props.options.map((optionDef: UKSelectOptionDefinition) => {
          return (
            <option
              data-name={optionDef.name}
              key={optionDef.value}
              value={optionDef.value}
            >
              {optionDef.name}
            </option>
          );
        })}
      </select>

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

export default UKSelect;
