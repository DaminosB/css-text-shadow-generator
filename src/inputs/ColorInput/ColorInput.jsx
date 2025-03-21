import styles from "./ColorInput.module.css";

import { useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import InputFrame from "../InputFrame/InputFrame";

const ColorInput = ({
  inputId,
  name,
  label,
  inputContainerId,
  icon,
  value,
  setValue,
  defaultValue,
  disabled,
}) => {
  const handleOnChange = (e) => {
    setValue(e.target.value.toUpperCase());
  };

  const previewStyle = useMemo(() => ({ backgroundColor: value }), [value]);

  const handleOnBlur = (e) => {
    const matchesPattern = stringRegex.test(e.target.value);
    if (matchesPattern) setValue(e.target.value.toUpperCase());
    else setValue(defaultValue);
  };

  return (
    <InputFrame
      inputId={inputId}
      inputContainerId={inputContainerId}
      label={label}
    >
      <div className={styles.inputContainer}>
        <div>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleOnChange}
            disabled={disabled}
            onBlur={handleOnBlur}
            size={8}
          />
        </div>
        <div>
          <div className={styles.preview} style={previewStyle}></div>
        </div>

        <input
          type="color"
          name={name}
          id={inputId}
          value={value}
          disabled={disabled}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
        />
      </div>
    </InputFrame>
  );
};
const stringRegex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

export default ColorInput;
