import styles from "./CssEditorBox.module.css";

import fontLibrary from "@/config/fonts/googleFonts";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { updateState } from "@/features/controls/controlsSlice";

import createShadow from "@/config/builders/createShadow";

import { validPxValue, validHexColor } from "@/utils/regEx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

const CssEditorBox = () => {
  const controls = useSelector((store) => store.controls);
  const output = useMemo(() => controls.items.data.output, [controls]);
  const dispatch = useDispatch();

  const textShadow = useMemo(
    () => output.data.map((o) => o.string).join(", "),
    [output.data]
  );

  const [cssInput, setCssInput] = useState(
    `${controls.items.data.output.data
      .map(({ string }) => string)
      .join(",\n")};`
  );

  const labelContainerRef = useRef(null);

  const updateShadows = useCallback(
    (e) => {
      const string = e.target.value;

      setCssInput(string);
      const layer = string
        .replaceAll(";", ",")
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry);

      const newTextSettings = structuredClone(controls);
      const newLayers = [];

      layer.forEach((shadow) => {
        const values = shadow.split(" ");

        const layerColor = values.find((value) => validHexColor.test(value));

        const [xShadowLength, yShadowLength, blurRadius] = values
          .filter((value) => validPxValue.test(value))
          .slice(0, 3)
          .map((value) => parseFloat(value));

        const newShadow = createShadow(null, {
          shadowColor: layerColor,
          xShadowLength,
          yShadowLength,
          blurRadius,
        });

        if (xShadowLength || yShadowLength || blurRadius) {
          newLayers.push(newShadow);
        }
      });

      newTextSettings.items.data.layers.data = newLayers;
      dispatch(
        updateState({
          path: ["items", "data", "layers"],
          key: "data",
          value: newLayers,
        })
      );
    },
    [dispatch, controls]
  );

  const copyToClipboard = useCallback(
    async (e) => {
      const button = e.currentTarget;

      try {
        await navigator.clipboard.writeText(`text-shadow: ${textShadow};`);

        button.animate(
          [
            { transform: "rotateY(0deg)" },
            { transform: "rotateY(360deg)", color: "green" },
            { transform: "rotateY(360deg)", color: "green" },
            { transform: "rotateY(360deg)" },
          ],
          { duration: 1000, iteration: 1 }
        );
        document.activeElement.blur();
      } catch (error) {
        console.error(error);

        button.animate(
          [
            { transform: "translateX(0px)" },
            { transform: "translateX(-3px)", color: "red" },
            { transform: "translateX(3px)", color: "red" },
            { transform: "translateX(-3px)", color: "red" },
            { transform: "translateX(3px)", color: "red" },
            { transform: "translateX(0px)", color: "red" },
            { transform: "translateX(0px)" },
          ],
          { duration: 1000, iteration: 1 }
        );
      }
    },
    [textShadow]
  );

  useEffect(() => {
    if (controls.items.data.output.isOpen)
      setCssInput(
        `${controls.items.data.output.data
          .map(({ string }) => string)
          .join(",\n")};`
      );
  }, [controls.items.data.output.isOpen, controls.items.data.output.data]);

  return (
    <div className={styles.editorBox}>
      <div>
        <div>
          <FontAwesomeIcon icon={output.icon} />
          <span>{output.label}</span>
        </div>
        <button
          title="copy to clipboard!"
          onClick={copyToClipboard}
          disabled={output.data.length === 0}
        >
          <FontAwesomeIcon icon={faPaperclip} />
        </button>
      </div>
      <div className={fontLibrary.cutiveMono.className}>
        <div ref={labelContainerRef}>
          <span className="yellow">text-shadow</span>
          <span>:</span>
        </div>
        <textarea
          id={output.id}
          className="codebox"
          value={cssInput}
          onChange={updateShadows}
        ></textarea>
      </div>
    </div>
  );
};

export default CssEditorBox;
