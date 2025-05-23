import styles from "./TextPreview.module.css";

import fontLibrary from "@/assets/fonts/googleFonts";

import { useSelector, useDispatch } from "react-redux";
import {
  commitSettings,
  updateControls,
  updateSettings,
} from "@/features/workflow/workflowSlice";

import { useMemo, useRef } from "react";
import { iconsList } from "@/assets/icons/iconsLibrary";

const TextPreview = () => {
  const workflow = useSelector((store) => store.workflow);

  const output = useMemo(() => workflow.output, [workflow.output]);

  const generalSettingsData = useMemo(
    () => workflow.data.settings.generalSettings.data,
    [workflow.data.settings.generalSettings.data]
  );

  const text = useMemo(
    () => generalSettingsData.inputs.userText,
    [generalSettingsData.inputs.userText]
  );
  const isDemoMode = useMemo(
    () => workflow.controls.demo.step != null,
    [workflow.controls.demo.step]
  );

  const dispatch = useDispatch();

  const cachedValue = useRef(text.value);

  const updateUserText = (e) => {
    dispatch(
      updateSettings({
        path: ["generalSettings", "data", "inputs", "userText"],
        key: "value",
        value: e.target.value,
      })
    );
  };
  const textShadow = useMemo(
    () => output.data.map((o) => o.string).join(", "),
    [output.data]
  );

  const textStyle = useMemo(
    () => ({
      ...fontLibrary[generalSettingsData.inputs.textFont.value].style,
      fontSize: `${generalSettingsData.inputs.fontSize.value}px`,
      color: generalSettingsData.inputs.textColor.value,
      backgroundColor: generalSettingsData.inputs.backgroundColor.value,
      textShadow,
    }),
    [generalSettingsData, textShadow]
  );

  const handleOnBlur = (e) => {
    if (e.target.value === cachedValue.current) {
      return;
    } else if (e.target.value) {
      const commitLabel = `Text: ${text.value}`;
      dispatch(
        commitSettings({
          category: "generalSettings",
          label: commitLabel,
          inputIcon: iconsList.Pencil,
        })
      );
      cachedValue.current = e.target.value;
    } else {
      dispatch(
        updateSettings({
          path: ["generalSettings", "data", "inputs", "userText"],
          key: "value",
          value: cachedValue.current,
        })
      );
    }
  };

  const handlePointerOut = (e) => {
    if (document.activeElement === e.currentTarget) {
      e.currentTarget.blur();
    }
  };

  const closeSidebar = () => {
    if (workflow.controls.sidebar.isOpen) {
      dispatch(
        updateControls({ target: "sidebar", key: "isOpen", value: false })
      );
    }
  };

  return (
    <div className={styles.textPreview}>
      <textarea
        id={text.inputId}
        name="userText"
        autoFocus
        style={textStyle}
        className={isDemoMode ? styles.transition : ""}
        value={text.value}
        onFocus={closeSidebar}
        onChange={updateUserText}
        onBlur={handleOnBlur}
        onPointerOut={handlePointerOut}
      ></textarea>
    </div>
  );
};

export default TextPreview;
