import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CheckboxButton.module.css";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import InputFrame from "../InputFrame/InputFrame";

const CheckboxButton = ({
  inputId,
  inputContainerId,
  name,
  onClick,
  value,
  text,
}) => {
  return (
    <InputFrame inputId={inputId} inputContainerId={inputContainerId}>
      <div className={styles.checkbox}>
        <button id={inputId} name={name} onClick={onClick} value={value}>
          <FontAwesomeIcon icon={value ? faSquareCheck : faSquare} />
        </button>
        <span>{text}</span>
      </div>
    </InputFrame>
  );
};

export default CheckboxButton;
