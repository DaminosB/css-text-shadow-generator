import styles from "./Pattern.module.css";

import { useMemo, useRef } from "react";

import { useSelector } from "react-redux";

import BoxHeader from "../../headers/BoxHeader/BoxHeader";
import InputMapper from "../InputMapper/InputMapper";

import resolvePath from "@/utils/resolvePath";
import interpolate from "@/utils/interpolate";

const Pattern = ({ path, actions = {} }) => {
  const pattern = useSelector((store) => resolvePath(store.workflow, path));

  const label = useMemo(
    () => interpolate(pattern.label, { index: path[4] }),
    [pattern.label, path]
  );

  const { onPointerDown, onClick } = useMemo(
    () => ({
      onPointerDown: !actions.onPointerDown?.disabled
        ? actions.onPointerDown?.callback
        : null,
      onClick: !actions.onClick?.disabled ? actions.onClick?.callback : null,
    }),
    [actions]
  );

  const buttons = useMemo(
    () =>
      pattern.buttons
        ? Object.entries(pattern.buttons).reduce((acc, [controlName, data]) => {
            const newConfig = { ...data.config };
            if (newConfig.type === "action") {
              newConfig.action = actions[newConfig.value];
            }

            acc[controlName] = { ...data, config: newConfig };
            return acc;
          }, {})
        : {},
    [pattern.buttons, actions]
  );

  const containerRef = useRef(null);

  return (
    <div
      className={styles.container}
      id={pattern.id}
      data-role="container"
      data-path={JSON.stringify(path)}
      ref={containerRef}
    >
      <BoxHeader
        icon={pattern.icon}
        label={label}
        buttons={buttons}
        path={[...path, "buttons"]}
        onPointerDown={onPointerDown}
        onClick={onClick}
      />
      <div data-role="collapsable">
        <div>
          <InputMapper inputs={pattern.inputs} path={[...path, "inputs"]} />
        </div>
      </div>
    </div>
  );
};

export default Pattern;
