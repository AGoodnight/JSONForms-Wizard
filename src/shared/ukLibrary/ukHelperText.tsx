import { ukTextColor, ukTextSize } from "./models/uk.models";

type UKHelperTextProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  color?: ukTextColor;
  size?: ukTextSize;
};

const UKHelperText = (props: UKHelperTextProps) => {
  return (
    <div
      className={`
  uk-text${props.size ? "-" + props.size : ""}
  ${props.color ? " uk-text-" + props.color : ""}
  `}
    >
      {props.children}
    </div>
  );
};

export default UKHelperText;
