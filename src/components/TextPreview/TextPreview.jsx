import styles from "./TextPreview.module.css";

import { useMemo, useContext } from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { updateRootSettings } from "@/features/textSettings/textSettingsSlice";
import OutputBox from "../OutputBox/OutputBox";

const TextPreview = () => {
  const { fontLibrary, highlightedShadow, modaleContent } =
    useContext(WorkspaceCtxt);

  const isDemoMode = useMemo(() => modaleContent === "demo", [modaleContent]);

  const { shadows, textConfig } = useSelector((store) => store.textSettings);

  const dispatch = useDispatch();

  const dispatchRootUpdate = (e) => {
    dispatch(updateRootSettings({ key: e.target.name, value: e.target.value }));
  };

  const textStyle = useMemo(
    () => ({
      ...fontLibrary[textConfig.textFont.value].style,
      fontSize: `${textConfig.fontSize.value}px`,
      color: textConfig.textColor.value,
      backgroundColor: textConfig.backgroundColor.value,
      textShadow: shadows
        .map((shadow, index) => {
          const {
            xShadowLength,
            yShadowLength,
            blurRadius,
            shadowColor,
            isVisible,
            inheritTextColor,
          } = shadow.inputs;

          if (
            !isVisible.value ||
            (highlightedShadow !== null && highlightedShadow !== index)
          )
            return;

          const colorString = inheritTextColor.value
            ? textConfig.textColor.value
            : shadowColor.value;

          return `${xShadowLength.value}px ${yShadowLength.value}px ${blurRadius.value}px ${colorString}`;
        })
        .filter((shadowString) => shadowString)
        .join(", "),
    }),
    [shadows, textConfig, highlightedShadow, fontLibrary]
  );

  return (
    <div
      id={textConfig.userText.inputContainerId}
      className={styles.textPreview}
    >
      <textarea
        id="userText"
        name="userText"
        style={textStyle}
        className={isDemoMode ? styles.transition : ""}
        value={textConfig.userText.value}
        onChange={dispatchRootUpdate}
      ></textarea>
      <OutputBox />
    </div>
  );
};

export default TextPreview;
