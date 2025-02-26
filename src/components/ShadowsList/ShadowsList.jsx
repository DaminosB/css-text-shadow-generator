import styles from "./ShadowsList.module.css";

import { useContext } from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { updateShadow } from "@/features/textSettings/textSettingsSlice";

import ShadowStyler from "../ShadowStyler/ShadowStyler";

const ShadowsList = () => {
  const textSettings = useSelector((store) => store.textSettings);
  const { shadows, newShadows } = textSettings;
  // const { shadows } = useSelector((store) => store.textSettings);

  // const { shadowsProperties } = useContext(WorkspaceCtxt);
  return (
    <div className={styles.shadowsList}>
      {shadows.map((shadow, index) => {
        return <ShadowStyler key={shadow.id} shadow={shadow} index={index} />;
      })}
      {/* {shadows.map((shadow, index) => {
        return <ShadowStyler key={shadow.id} shadow={shadow} index={index} />;
      })} */}
      {/* {shadows.map((shadow, index) => {
        return (
          <ShadowStyler key={shadow.id} shadowStyle={shadow} index={index} />
        );
      })} */}
    </div>
  );
};

export default ShadowsList;
