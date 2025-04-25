import styles from "./SmartButton.module.css";

import { useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SmartButton = ({
  inputId,
  name,
  value,
  text,
  icons,
  icon,
  onClick,
  onPointerEnter,
  onPointerLeave,
  isDimmed = false,
  disabled = false,
}) => {
  const currentIcon = useMemo(() => {
    if (value && icons?.on) return icons.on;
    else if (!value && icons?.off) return icons.off;
    else return icon;
  }, [icons, icon, value]);

  return (
    <label id={`labelFor-${inputId}`} className={styles.label}>
      <div className={styles.checkbox}>
        <button
          id={inputId}
          className={isDimmed ? "ethereal" : ""}
          name={name}
          onClick={onClick}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          value={value}
          disabled={disabled}
        >
          <FontAwesomeIcon icon={currentIcon} />
        </button>
        {text && <span>{text}</span>}
      </div>
    </label>
  );
};

export default SmartButton;
