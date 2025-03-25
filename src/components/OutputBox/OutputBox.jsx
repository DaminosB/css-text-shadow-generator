import styles from "./OutputBox.module.css";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import CssCodeBox from "../CssCodeBox/CssCodeBox";
import CssEditorBox from "../CssEditorBox/CssEditorBox";

const OutputBox = ({ cssOutput, textShadow }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`text-shadow: ${textShadow};`);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleModes = (e) => {
    switch (e.currentTarget.name) {
      case "edit":
        setIsEditMode((prev) => !prev);
        break;

      case "expand":
        setIsOpen((prev) => !prev);
        break;

      default:
        break;
    }
  };

  return (
    <div
      id="output-box"
      className={`${styles.output} ${!isOpen ? styles.closed : ""}`}
    >
      <div>
        <h2>Output</h2>
        <div>
          <button
            name="copy"
            disabled={cssOutput.length === 0}
            onClick={copyToClipboard}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
          <button name="edit" onClick={toggleModes}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button name="expand" onClick={toggleModes}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      </div>
      <div>
        <pre>
          {isEditMode ? (
            <CssEditorBox setIsEditMode={setIsEditMode} cssOutput={cssOutput} />
          ) : (
            <CssCodeBox setIsEditMode={setIsEditMode} cssOutput={cssOutput} />
          )}
        </pre>
      </div>
    </div>
  );
};

export default OutputBox;
