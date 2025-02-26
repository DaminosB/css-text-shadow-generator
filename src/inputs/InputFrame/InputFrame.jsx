import styles from "./InputFrame.module.css";

const InputFrame = ({ inputId, inputContainerId, label, children }) => {
  return (
    <div id={inputContainerId} className={styles.inputFrame}>
      <label htmlFor={inputId}>
        <span>{label}</span>
        {children}
      </label>
    </div>
  );
};

export default InputFrame;
