import styles from "./BoxHeader.module.css";

import { useCallback } from "react";

import { useDispatch } from "react-redux";
import {
  commitSettings,
  updateSettings,
} from "@/features/workflow/workflowSlice";

import HeadingIcon from "../HeadingIcon/HeadingIcon";
import SmartButton from "@/components/inputs/SmartButton/SmartButton";

const BoxHeader = ({ icon, label, buttons, onPointerDown, onClick, path }) => {
  const dispatch = useDispatch();

  const toggleValue = useCallback(
    (buttonConfig) => {
      const { labelTexts, labelText, icons, icon, shouldCommit, name, value } =
        buttonConfig;
      const buttonPath = [...path, name, "config"];
      const newValue = !value;

      dispatch(
        updateSettings({
          path: buttonPath,
          key: "value",
          value: newValue,
        })
      );

      if (shouldCommit) {
        let commitLabel = labelText;
        if (newValue && labelTexts?.on) commitLabel = labelTexts.on;
        else if (!newValue && labelTexts?.off) commitLabel = labelTexts.off;

        let inputIcon = icon;
        if (newValue && icons?.on) inputIcon = icons.on;
        else if (!newValue && icons?.off) inputIcon = icons.off;

        dispatch(
          commitSettings({
            category: path[2],
            changedIndex: path[4],
            label: commitLabel,
            inputIcon,
          })
        );
      }
    },
    [path, dispatch]
  );

  const handler = useCallback(
    (e) => {
      const { config } = buttons[e.currentTarget.name];

      switch (config.type) {
        case "action":
          if (!config.action.disabled) config.action.callback(e);
          break;

        case "boolean":
          toggleValue(config);
          break;

        default:
          break;
      }
    },
    [buttons, toggleValue]
  );

  return (
    <div
      className={`${styles.boxHeader} ${onPointerDown ? "grabbable" : ""}`}
      onPointerDown={onPointerDown ? onPointerDown : null}
    >
      <HeadingIcon icon={icon} label={label} onClick={onClick} />
      <div
        className={styles.buttonsContainer}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {Object.entries(buttons).map(([buttonName, attributes]) => {
          const { id, config } = attributes;

          const { onPointerEnter, onPointerLeave, onClick } = {
            onPointerEnter:
              config.trigger === "hover" ? (e) => handler(e) : null,
            onPointerLeave:
              config.trigger === "hover" ? (e) => handler(e) : null,
            onClick: config.trigger === "click" ? (e) => handler(e) : null,
          };

          return (
            <SmartButton
              key={id}
              inputId={id}
              name={buttonName}
              icon={config.icon}
              icons={config.icons}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
              onClick={onClick}
              value={config.value}
              disabled={
                config.type === "action" ? config.action?.disabled : false
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default BoxHeader;
