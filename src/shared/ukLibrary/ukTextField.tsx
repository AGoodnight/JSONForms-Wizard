import React, { Ref, useMemo, useState } from "react";
import { ukError } from "./models/input.models";
import { ukTextColor } from "./models/uk.models";
import UKHelperText from "./ukHelperText";

export type UKTextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errors?: ukError[];
  required?: boolean;
  label?: string;
  icon?: JSX.Element;
};

const UKTextField = React.forwardRef(
  (props: UKTextFieldProps, ref: Ref<any>) => {
    const baseClassList = "uk-input";
    const [classList, setClassList] = useState<string>("uk-input");
    const [value, setValue] = useState<
      string | number | readonly string[] | undefined
    >();
    console.log("text");
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
              case "value":
                setValue(props[propKey]);
                return propList;
              case "onChange":
                return propList;
              default:
                propList[propKey] = props[propKey as keyof UKTextFieldProps];
                return propList;
            }
          },
          {}
        ),
      [props]
    );

    const handleChange = (ev: any) => {
      setValue(ev.target.value);
      props?.onChange?.(ev);
    };

    return (
      <div className="uk-margin-top">
        <label className="uk-form-label">{props.label as string}</label>
        {props.icon && <span className="uk-form-icon">{props.icon}</span>}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          className={classList}
          {...sanitizedProps}
        />

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
  }
);

export default UKTextField;
