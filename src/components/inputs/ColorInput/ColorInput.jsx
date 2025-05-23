import styles from "./ColorInput.module.css";

import { useRef, useCallback } from "react";

import { validHexColor } from "@/utils/regEx";
import HeadingIcon from "@/components/headers/HeadingIcon/HeadingIcon";

const ColorInput = ({
  inputId,
  name,
  label,
  icon,
  value,
  setValue,
  disabled,
  commit,
}) => {
  const cachedValue = useRef(value);

  const handleOnChange = useCallback(
    (e) => {
      setValue(e.target.value.toLowerCase());
    },
    [setValue]
  );

  const handleOnBlur = useCallback(
    (e) => {
      const matchesPattern = validHexColor.test(e.target.value);

      if (matchesPattern) {
        if (cachedValue.current !== e.target.value.toLowerCase()) {
          if (value !== e.target.value.toLowerCase()) {
            setValue(e.target.value.toLowerCase());
          }

          commit(cachedValue.current, e.target.value.toLowerCase());
        }
      } else {
        setValue(cachedValue.current);
      }
    },
    [commit, value, setValue]
  );

  const handleOnFocus = useCallback((e) => {
    cachedValue.current = e.target.value.toLowerCase();
  }, []);

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
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
        />
      </div>
    </label>
  );
};

export default ColorInput;
