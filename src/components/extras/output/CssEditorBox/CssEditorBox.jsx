import styles from "./CssEditorBox.module.css";

import fontLibrary from "@/assets/fonts/googleFonts";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  commitSettings,
  updateSettings,
} from "@/features/workflow/workflowSlice";

import BoxHeader from "@/components/headers/BoxHeader/BoxHeader";

import { iconsList } from "@/assets/icons/iconsLibrary";

import createShadow from "@/config/builders/createShadow";
import { validPxValue, validHexColor } from "@/utils/regEx";

const CssEditorBox = () => {
  const workflow = useSelector((store) => store.workflow);

  const output = useMemo(() => workflow.output, [workflow.output]);

  const dispatch = useDispatch();

  const textShadow = useMemo(
    () => output.data.map((o) => o.string).join(", "),
    [output.data]
  );

  const [cssInput, setCssInput] = useState(
    `${output.data.map(({ string }) => string).join(",\n")};`
  );

  const labelContainerRef = useRef(null);
  const cachedTextShadow = useRef("");

  const updateShadows = useCallback(
    (e) => {
      const string = e.target.value;

      setCssInput(string);
      const layer = string
        .replaceAll(";", ",")
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry);

      const newLayers = [];

      layer.forEach((shadow) => {
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
          newLayers.push(newShadow);
        }
      });

      dispatch(
        updateSettings({
          path: ["layers"],
          key: "data",
          value: newLayers,
        })
      );
    },
    [dispatch]
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

  const buttons = useMemo(
    () =>
      Object.entries(output.buttons).reduce((acc, [controlName, data]) => {
        const newConfig = { ...data.config };
        if (newConfig.type === "action") {
          newConfig.action = {
            callback: copyToClipboard,
            disabled: output.data.length === 0,
          };
        }

        acc[controlName] = { ...data, config: newConfig };
        return acc;
      }, {}),
    [output.buttons, copyToClipboard, output.data.length]
  );

  const handleFocus = useCallback(() => {
    cachedTextShadow.current = textShadow;
  }, [textShadow]);

  const handleBlur = useCallback(() => {
    const outputStrings = output.data.map(({ string }) => string);

    setCssInput(`${outputStrings.join(",\n")};`);

    if (cachedTextShadow.current !== outputStrings.join(", ")) {
      const commitLabel = "Manual code update";

      dispatch(
        commitSettings({
          category: "output",
          label: commitLabel,
          inputIcon: iconsList.Keyboard,
        })
      );
    }
  }, [setCssInput, output.data, dispatch]);

  useEffect(() => {
    if (document.activeElement.id !== output.id) {
      setCssInput(`${output.data.map(({ string }) => string).join(",\n")};`);
    }
  }, [output]);

  return (
    <div>
      <div className={styles.editorBox}>
        <BoxHeader
          icon={iconsList[output.icon]}
          label={output.label}
          buttons={buttons}
        />
        <div className={fontLibrary.cutiveMono.className}>
          <div ref={labelContainerRef}>
            <span className="yellow">text-shadow</span>
            <span>:</span>
          </div>
          <textarea
            id={output.id}
            className="codebox"
            value={cssInput}
            onFocus={handleFocus}
            onChange={updateShadows}
            onBlur={handleBlur}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CssEditorBox;
