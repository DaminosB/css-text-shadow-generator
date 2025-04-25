import styles from "./ColorInput.module.css";

import { validHexColor } from "@/utils/regEx";
import HeadingIcon from "@/components/headers/HeadingIcon/HeadingIcon";

const ColorInput = ({
  inputId,
  name,
  label,
  icon,
  value,
  setValue,
  defaultValue,
  disabled,
}) => {
  const handleOnChange = (e) => {
    setValue(e.target.value.toUpperCase());
  };

  const handleOnBlur = (e) => {
    const matchesPattern = validHexColor.test(e.target.value);
    if (matchesPattern) setValue(e.target.value.toUpperCase());
    else setValue(defaultValue);
  };

  return (
    <label
      id={`labelFor-${inputId}`}
      className={styles.label}
      title={`${label} color`}
    >
      <div className={styles.inputContainer}>
        <HeadingIcon icon={icon} label={label} />
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
    </label>
  );
};

export default ColorInput;
