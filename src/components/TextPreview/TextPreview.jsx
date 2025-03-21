import styles from "./TextPreview.module.css";

import fontLibrary from "@/config/fonts/googleFonts";

import { useMemo, useContext } from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "@/features/textSettings/textSettingsSlice";

import OutputBox from "../OutputBox/OutputBox";

const TextPreview = ({ path }) => {
  const { modaleContent } = useContext(WorkspaceCtxt);

  const isDemoMode = useMemo(() => modaleContent === "demo", [modaleContent]);

  const { shadows, textConfig } = useSelector((store) => store.textSettings);

  const dispatch = useDispatch();

  const updateUserText = (e) => {
    dispatch(
      updateSetting({
        path: [...path, "inputs", "userText"],
        key: "value",
        value: e.target.value,
      })
    );
  };

  const cssOutput = useMemo(() => {
    const highlightedShadow = shadows.find(
      (shadow) => shadow.controls.highlight.config.value
    );

    const filteredShadows = highlightedShadow
      ? [highlightedShadow]
      : shadows.filter((shadow) => shadow.controls.enable.config.value);

    return createShadowOutput(filteredShadows);
  }, [shadows]);

  const textStyle = useMemo(
    () => ({
      ...fontLibrary[textConfig.inputs.textFont.value].style,
      fontSize: `${textConfig.inputs.fontSize.value}px`,
      color: textConfig.inputs.textColor.value,
      backgroundColor: textConfig.inputs.backgroundColor.value,
      textShadow: cssOutput.join(", "),
    }),
    [textConfig, cssOutput]
  );

  return (
    <div
      id={textConfig.inputs.userText.inputContainerId}
      className={styles.textPreview}
    >
      <textarea
        id="userText"
        name="userText"
        style={textStyle}
        className={isDemoMode ? styles.transition : ""}
        value={textConfig.inputs.userText.value}
        onChange={updateUserText}
      ></textarea>
      <OutputBox cssOutput={cssOutput} />
    </div>
  );
};

const createShadowOutput = (shadows) =>
  shadows
    .map((shadow) => {
      const { blurRadius, xShadowLength, yShadowLength, shadowColor } =
        Object.entries(shadow.inputs).reduce((acc, [inputName, config]) => {
          if (config.toggleOption?.value) {
            return { ...acc, [inputName]: null };
          } else if (config.type === "group") {
            return {
              ...acc,
              ...Object.entries(config.inputs).reduce(
                (subAcc, [subInputName, subConfig]) => ({
                  ...subAcc,
                  [subInputName]: {
                    value: subConfig.value,
                    format: subConfig.format,
                  },
                }),
                {}
              ),
            };
          } else {
            return {
              ...acc,
              [inputName]: { value: config.value, format: config.format },
            };
          }
        }, {});

      if (blurRadius.value || xShadowLength.value || yShadowLength.value) {
        let output = "";

        output += `${xShadowLength.value}${xShadowLength.format}`;
        output += ` ${yShadowLength.value}${yShadowLength.format}`;
        if (blurRadius.value)
          output += ` ${blurRadius.value}${blurRadius.format}`;
        if (shadowColor) output += ` ${shadowColor.value}`;

        return output;
      }
    })
    .filter((output) => output);

export default TextPreview;
