export type UKAlertProps = React.HTMLAttributes<HTMLDivElement> & {
  severity: "danger" | "warning" | "success" | "primary";
};

const UKAlert = ({ severity, children }: UKAlertProps) => {
  return (
    <div className={severity ? `uk-alert uk-alert-${severity}` : "uk-alert"}>
      {children}
    </div>
  );
};

export default UKAlert;
