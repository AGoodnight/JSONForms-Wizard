type ProgressProps = {
  value: number;
};

const Progress = (props: ProgressProps) => {
  return (
    <progress
      id="js-progressbar"
      className="uk-progress"
      value={props.value}
      max="100"
    ></progress>
  );
};

export default Progress;
