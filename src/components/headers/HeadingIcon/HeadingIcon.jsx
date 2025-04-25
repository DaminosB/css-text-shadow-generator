import styles from "./HeadingIcon.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeadingIcon = ({ icon, label, format, onClick }) => {
  const handleOnClick = (e) => {
    onClick(e);
  };

  const handleStopPropagation = (e) => {
    e.stopPropagation();
  };
  return (
    <div
      className={`${styles.title} ${onClick ? styles.cursor : ""}`}
      onClick={onClick ? handleOnClick : null}
      onPointerDown={onClick ? handleStopPropagation : null}
    >
      <div>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        {label && (
          <span>
            {label}
            {format && <span className="small">{format}</span>}
          </span>
        )}
      </div>
    </div>
  );
};

export default HeadingIcon;
