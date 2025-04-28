import styles from "./TextPreview.module.css";

import fontLibrary from "@/config/fonts/googleFonts";

import { useMemo, useContext } from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { updateState } from "@/features/controls/controlsSlice";

const TextPreview = ({ path }) => {
  const { modalContent } = useContext(WorkspaceCtxt);
  const { items, text } = useSelector(({ controls }) => controls);
  const output = useMemo(() => items.data.output, [items.data.output]);
  const generalSettingsData = items.data.generalSettings.data[0];

  const isDemoMode = useMemo(() => modalContent === "demo", [modalContent]);

  const dispatch = useDispatch();

  const updateUserText = (e) => {
    dispatch(
      updateState({
        path,
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

  return (
    <div className={styles.textPreview}>
      <textarea
        id={text.id}
        name="userText"
        style={textStyle}
        className={isDemoMode ? styles.transition : ""}
        value={text.value}
        onChange={updateUserText}
      ></textarea>
    </div>
  );
};

export default TextPreview;
