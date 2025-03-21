import styles from "./OutputBox.module.css";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const OutputBox = ({ cssOutput }) => {
  const [isOpen, setIsOpen] = useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `text-shadow: ${cssOutput.join(", ")};`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      id="output-box"
      className={`${styles.output} ${!isOpen ? styles.closed : ""}`}
    >
      <div>
        <h2>Output</h2>
        <div>
          <button disabled={cssOutput.length === 0} onClick={copyToClipboard}>
            <FontAwesomeIcon icon={faCopy} />
          </button>
          <button onClick={toggleIsOpen} disabled={cssOutput.length === 0}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      </div>
      <div>
        <pre>
          <code>
            {cssOutput.length > 0 ? (
              <>
                <span className="yellow">text-shadow: </span>
                {cssOutput.map((string, index) => {
                  return (
                    <span
                      key={crypto.randomUUID()}
                      className={index > 0 ? styles.incremented : ""}
                    >
                      {string}
                      {index < cssOutput.length - 1 ? ", " : ";"}
                    </span>
                  );
                })}
              </>
            ) : (
              <span className="yellow">No shadows are currently visible</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default OutputBox;
