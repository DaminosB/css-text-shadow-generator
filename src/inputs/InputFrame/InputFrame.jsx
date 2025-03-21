import styles from "./InputFrame.module.css";

const InputFrame = ({ inputId, inputContainerId, label, children }) => {
  if (label === "sync x and y axis") {
    console.log(inputId, inputContainerId);
  }
  return (
    <div id={inputContainerId} className={styles.inputFrame}>
      <label htmlFor={inputId}>
        {label && <span>{label}</span>}
        {children}
      </label>
    </div>
  );
};

export default InputFrame;
