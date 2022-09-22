import { useMemo } from "react";

type LoadingProps = {
  display: "block" | "fill";
};

const Loading = ({ display = "block" }: LoadingProps) => {
  const containerClassList = useMemo(() => {
    return display === "block" ? "" : "uk-flex ec-backdrop-fill";
  }, [display]);
  return (
    <div className={containerClassList}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
