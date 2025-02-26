import styles from "./PropertyOutput.module.css";

import { useState, useContext, useMemo } from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const PropertyOutput = () => {
  const textSettings = useSelector((store) => store.textSettings);
  const { shadows } = textSettings;

  const [isOpen, setIsOpen] = useState(true);

  const outputStrings = useMemo(
    () =>
      shadows
        .filter((shadow) => {
          const { xShadowLength, yShadowLength, blurRadius, isVisible } =
            shadow.inputs;
          return (
            isVisible.value &&
            (xShadowLength.value !== 0 ||
              yShadowLength.value !== 0 ||
              blurRadius.value !== 0)
          );
        })
        .map((shadow, index, array) => {
          const {
            xShadowLength,
            yShadowLength,
            blurRadius,
            shadowColor,
            inheritTextColor,
          } = shadow.inputs;

          let output = `${xShadowLength.value}px ${yShadowLength.value}px ${blurRadius.value}px`;

          if (!inheritTextColor.value) output += ` ${shadowColor.value}`;

          if (index < array.length - 1) output += ",\n";
          else output += ";";

          return output;
        }),
    [shadows]
  );

  // const outputStrings = useMemo(
  //   () =>
  //     shadows
  //       .map((shadow) =>
  //         shadow.inputs.reduce(
  //           (acc, input) => ({ ...acc, [input.name]: input.value }),
  //           {}
  //         )
  //       )
  //       .filter(
  //         ({ xShadowLength, yShadowLength, blurRadius, isVisible }) =>
  //           isVisible &&
  //           (xShadowLength !== 0 || yShadowLength !== 0 || blurRadius !== 0)
  //       )
  //       .map((shadow, index, array) => {
  //         const {
  //           xShadowLength,
  //           yShadowLength,
  //           blurRadius,
  //           shadowColor,
  //           inheritTextColor,
  //         } = shadow;

  //         let output = `${xShadowLength}px ${yShadowLength}px ${blurRadius}px`;

  //         if (!inheritTextColor) output += ` ${shadowColor}`;

  //         if (index < array.length - 1) output += ",\n";
  //         else output += ";";

  //         return output;
  //       }),
  //   [shadows]
  // );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `text-shadow: ${outputStrings.join("")}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`${styles.output} ${!isOpen ? styles.closed : ""}`}>
      <div>
        <h2>Output</h2>
        <div>
          <button
            disabled={outputStrings.length === 0}
            onClick={copyToClipboard}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
          <button onClick={toggleIsOpen} disabled={outputStrings.length === 0}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      </div>
      <div>
        <pre>
          <code>
            {outputStrings.length > 0 ? (
              <>
                <span className="yellow">text-shadow: </span>
                {outputStrings.map((string, index, array) => {
                  return (
                    <span
                      key={index}
                      className={index > 0 ? styles.incremented : ""}
                    >
                      {string}
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

export default PropertyOutput;
