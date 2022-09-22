import React, { Ref, useMemo, useState } from "react";
import { ukError } from "./models/input.models";
import { ukTextColor } from "./models/uk.models";
import UKHelperText from "./ukHelperText";

export type UKTextAreaProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errors?: ukError[];
  required?: boolean;
  label: string;
};

const UKTextArea = React.forwardRef((props: UKTextAreaProps, ref: Ref<any>) => {
  const baseClassList = "uk-textarea";
  const [classList, setClassList] = useState<string>("uk-textarea");
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
            case "value":
              setValue(props[propKey]);
              return propList;
            default:
              propList[propKey] = props[propKey as keyof UKTextAreaProps];
              return propList;
          }
        },
        {}
      ),
    [props]
  );

  return (
    <div className="uk-margin-top">
      <label className="uk-form-label">{props.label as string}</label>
      <div>
        <textarea
          ref={ref}
          value={value}
          className={classList}
          rows={10}
          {...sanitizedProps}
        />
      </div>

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

export default UKTextArea;
