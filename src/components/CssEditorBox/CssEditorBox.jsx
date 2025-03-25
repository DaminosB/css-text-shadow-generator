import styles from "./CssEditorBox.module.css";

import { useState, useMemo, useRef, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { replaceState } from "@/features/textSettings/textSettingsSlice";

import { validPxValue, validHexColor } from "@/utils/regEx";
import createShadow from "@/config/builders/createShadow";

const CssEditorBox = ({ setIsEditMode, cssOutput }) => {
  const textSettings = useSelector((store) => store.textSettings);
  const dispatch = useDispatch();

  const [cssInput, setCssInput] = useState(
    `${cssOutput.map(({ string }) => string).join(",\n")};`
  );

  const labelContainerRef = useRef(null);

  const updateShadows = useCallback(
    (e) => {
      const string = e.target.value;

      setCssInput(string);
      const shadows = string
        .replaceAll(";", ",")
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry);

      const newTextSettings = { ...textSettings };
      const newShadows = [];

      shadows.forEach((shadow) => {
        const values = shadow.split(" ");

        const shadowColor = values.find((value) => validHexColor.test(value));
        const [xShadowLength, yShadowLength, blurRadius] = values
          .filter((value) => validPxValue.test(value))
          .slice(0, 3)
          .map((value) => parseFloat(value));

        const newShadow = createShadow(null, {
          shadowColor,
          xShadowLength,
          yShadowLength,
          blurRadius,
        });

        if (xShadowLength || yShadowLength || blurRadius) {
          newShadows.push(newShadow);
        }
      });

      newTextSettings.shadows = newShadows;
      dispatch(replaceState(newTextSettings));
    },
    [dispatch, textSettings]
  );

  const translatePropertyName = (e) => {
    const labelContainer = labelContainerRef.current;
    labelContainer.style.transform = `translateY(${-e.target.scrollTop}px)`;
  };

  const closeEditMode = () => {
    setIsEditMode(false);
  };

  return (
    <div className={styles.editorBox}>
      <div ref={labelContainerRef}>
        <span className="yellow">text-shadow</span>
        <span>:</span>
      </div>
      <textarea
        value={cssInput}
        onChange={updateShadows}
        onScroll={translatePropertyName}
        onBlur={closeEditMode}
      ></textarea>
    </div>
  );
};

export default CssEditorBox;
