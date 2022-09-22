import { useCallback, useState } from "react";
import UKButton from "./ukButton";
import UKIcon from "./ukIcon";

type CollapseProps = React.HTMLAttributes<HTMLButtonElement> & {
  collapsed?: boolean;
  label: string;
};

const Collapse = ({
  children,
  collapsed,
  label,
}: CollapseProps): JSX.Element => {
  const [collapse, setCollapse] = useState<boolean>(collapsed ?? true);

  const handleToggle = useCallback(() => {
    setCollapse(!collapse);
  }, [collapse]);

  return (
    <>
      <UKButton variant="collapse" onClick={handleToggle}>
        {collapse && (
          <UKIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 256 512"
            >
              <path d="M24.707 38.101L4.908 57.899c-4.686 4.686-4.686 12.284 0 16.971L185.607 256 4.908 437.13c-4.686 4.686-4.686 12.284 0 16.971L24.707 473.9c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L41.678 38.101c-4.687-4.687-12.285-4.687-16.971 0z" />
            </svg>
          </UKIcon>
        )}
        {!collapse && (
          <UKIcon>
            <svg
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z" />
            </svg>
          </UKIcon>
        )}
        <span>{label}</span>
      </UKButton>
      {!collapse && children}
    </>
  );
};

export default Collapse;
