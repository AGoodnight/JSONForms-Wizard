import React, { Ref, useMemo, useState } from "react";
import { ukError } from "./models/input.models";
import { ukTextColor } from "./models/uk.models";
import UKHelperText from "./ukHelperText";

export type UKNumberProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errors?: ukError[];
  required?: boolean;
  label?: string;
  unitIcon?: any;
};

const UKNumber = React.forwardRef((props: UKNumberProps, ref: Ref<any>) => {
  const baseClassList = "uk-input";
  const [classList, setClassList] = useState<string>("uk-input");
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
            case "onChange":
              return propList;
            case "unitIcon":
              return propList;
            default:
              propList[propKey] = props[propKey as keyof UKNumberProps];
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
      <div className="uk-block">
        <div className="uk-inline">
          {props.unitIcon && (
            <span className="uk-form-icon uk-form-icon-flip">
              <small>{props.unitIcon}</small>
            </span>
          )}
          <input
            ref={ref}
            type="number"
            value={value}
            onChange={handleChange}
            className={classList}
            {...sanitizedProps}
          />
        </div>
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

export default UKNumber;
