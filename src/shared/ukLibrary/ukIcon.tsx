import { ReactNode } from "react";

type UKIconProps = React.HTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const UKIcon = ({ children }: UKIconProps) => {
  return <span className="uk-icon">{children}</span>;
};

export default UKIcon;
