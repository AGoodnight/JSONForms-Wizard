import { useMemo } from "react";

type UKButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "text" | "menu" | "collapse" | "outlined" | "card";
  color?: "danger" | "caution" | "success" | "default";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};

const UKButton = (props: UKButtonProps) => {
  const sanitizedProps = useMemo(() => {
    return Object.keys(props).reduce(
      (propList: UKButtonProps, prop: string) => {
        switch (prop) {
          case "variant":
            return propList;
          case "color":
            return propList;
          case "size":
            return propList;
          default:
            propList[prop as keyof UKButtonProps] =
              props[prop as keyof UKButtonProps];
            return propList;
        }
      },
      {}
    );
  }, [props]);

  const classes: string = useMemo(() => {
    const classList = [];
    classList.push(props.variant ? `uk-button-${props.variant}` : "");
    classList.push(
      props.color ? `uk-button-${props.color}` : "uk-button-primary"
    );
    classList.push(props.size ? `uk-button-${props.size}` : "");

    return !props.disabled
      ? classList.join(" ")
      : "uk-button uk-button-disabled";
  }, [props.variant, props.color, props.size, props.disabled]);

  return (
    <button
      {...sanitizedProps}
      disabled={props.disabled}
      className={`uk-button ${
        props.disabled ? "uk-button-default" : ""
      } ${classes}`}
    >
      {props.children}
    </button>
  );
};

export default UKButton;
