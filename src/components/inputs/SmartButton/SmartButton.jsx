import styles from "./SmartButton.module.css";

import { useMemo } from "react";

import { Icons } from "@/assets/icons/iconsLibrary";

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
  const Icon = useMemo(() => {
    if (value && icons?.on) return Icons[icons.on];
    else if (!value && icons?.off) return Icons[icons.off];
    else return Icons[icon];
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
          <Icon onClick={(e) => e.preventDefault()} />
        </button>
        {text && <span>{text}</span>}
      </div>
    </label>
  );
};

export default SmartButton;
