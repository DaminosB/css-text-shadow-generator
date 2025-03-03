import styles from "./UtilityButtons.module.css";

import { useState, useRef } from "react";
import { useContext } from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faEllipsis,
  faGraduationCap,
  faQuestion,
  faSchool,
  faTerminal,
  faUserGraduate,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const UtilityButtons = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [infoText, setInfoText] = useState("");

  const { modaleContent, setModaleContent } = useContext(WorkspaceCtxt);

  const infoTextElemRef = useRef(null);

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const displayInfoText = (e) => {
    const infoTextElem = infoTextElemRef.current;

    if (e.type === "pointerenter") {
      infoTextElem.classList.remove("hidden");
      switch (e.currentTarget.value) {
        case "demo":
          setInfoText("Open demo mode");
          break;

        case "learn":
          setInfoText("About this property");
          break;

        case "about":
          setInfoText("About this app");
          break;

        case "toggle":
          setInfoText(isOpen ? "Close" : "More infos");
          break;

        default:
          break;
      }
    } else if (e.type === "pointerleave") {
      infoTextElem.classList.add("hidden");
    }
  };

  const toggleModaleContent = (e) => {
    setModaleContent(e.currentTarget.value);
  };

  return (
    <div className={`${styles.utilityButtons} ${isOpen ? styles.open : ""}`}>
      <div className={`${styles.infoText} hidden`} ref={infoTextElemRef}>
        <span>{infoText}</span>
      </div>
      <button
        value="toggle"
        onPointerEnter={displayInfoText}
        onPointerLeave={displayInfoText}
        onClick={toggleIsOpen}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <div>
        <div className={styles.buttonsContainer}>
          <button
            onPointerEnter={displayInfoText}
            onPointerLeave={displayInfoText}
            onClick={toggleModaleContent}
            value="demo"
          >
            <FontAwesomeIcon icon={faQuestion} />
          </button>
          <button
            onPointerEnter={displayInfoText}
            onPointerLeave={displayInfoText}
            value="learn"
          >
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow"
              target="_blank"
            >
              <FontAwesomeIcon icon={faCode} />
            </a>
          </button>
          <button
            onPointerEnter={displayInfoText}
            onPointerLeave={displayInfoText}
            onClick={toggleModaleContent}
            value={"about"}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilityButtons;
