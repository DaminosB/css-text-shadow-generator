import styles from "./HeadingIcon.module.css";

import { useMemo } from "react";

import { Icons } from "@/assets/icons/iconsLibrary";

const HeadingIcon = ({ icon, label, format, onClick }) => {
  const handleOnClick = (e) => {
    onClick(e);
  };

  const handleStopPropagation = (e) => {
    e.stopPropagation();
  };

  const Icon = useMemo(() => Icons[icon], [icon]);

  return (
    <div
      className={`${styles.title} ${onClick ? styles.cursor : ""}`}
      onClick={onClick ? handleOnClick : null}
      onPointerDown={onClick ? handleStopPropagation : null}
    >
      <div>
        <Icon />
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
