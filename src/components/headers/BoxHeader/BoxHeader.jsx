import styles from "./BoxHeader.module.css";

import HeadingIcon from "../HeadingIcon/HeadingIcon";
import ControlsButtons from "../ControlsButtons/ControlsButtons";

const BoxHeader = ({
  icon,
  label,
  controls,
  actions,
  onPointerDown,
  onClick,
  path,
}) => {
  return (
    <div
      className={`${styles.boxHeader} ${onPointerDown ? "grabbable" : ""}`}
      onPointerDown={onPointerDown ? onPointerDown : null}
    >
      <HeadingIcon icon={icon} label={label} onClick={onClick} />
      <div
        className={styles.buttonsContainer}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <ControlsButtons controls={controls} actions={actions} path={path} />
      </div>
    </div>
  );
};

export default BoxHeader;
