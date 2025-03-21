import styles from "./ToolBar.module.css";

import { useRef, useState, useCallback } from "react";

import { useDispatch } from "react-redux";
import { updateSetting } from "@/features/textSettings/textSettingsSlice";

import SmartButton from "@/inputs/SmartButton/SmartButton";

const ToolBar = ({ controls, actions, path }) => {
  const dispatch = useDispatch();
  const [infoText, setInfoText] = useState("");

  const infoTextElemRef = useRef(null);

  const toggleValue = useCallback(
    (newValue, buttonPath) => {
      dispatch(
        updateSetting({
          path: buttonPath,
          key: "value",
          value: newValue,
        })
      );
    },
    [dispatch]
  );

  const handleEvents = useCallback(
    (e) => {
      const infoTextElem = infoTextElemRef.current;
      const button = controls[e.currentTarget.name];
      const { trigger, name, value, labelTexts, labelText, type } =
        button.config;
      const buttonPath = [...path, name, "config"];

      let newValue = value ?? null;

      switch (e.type) {
        case "pointerenter":
        case "pointerleave":
          infoTextElem.classList.toggle("hidden", e.type === "pointerleave");

          if (trigger === "hover" && type === "boolean") {
            newValue = !newValue;
            toggleValue(newValue, buttonPath);
          }
          break;

        case "click":
          if (type === "action") {
            actions[name].action();
          } else if (type === "boolean" && trigger === "click") {
            newValue = !newValue;
            toggleValue(newValue, buttonPath);
          }
          break;

        default:
          break;
      }

      setInfoText(
        (newValue ? labelTexts?.on : labelTexts?.off) || labelText || ""
      );
    },
    [controls, path, actions, toggleValue]
  );

  return (
    <div className={styles.toolBar}>
      <div className={styles.infoText} ref={infoTextElemRef}>
        <span>{infoText}</span>
      </div>
      <div className={styles.buttonsContainer}>
        {Object.entries(controls).map(([buttonName, attributes]) => {
          const { id, config } = attributes;

          return (
            <SmartButton
              key={id}
              inputId={id}
              name={buttonName}
              inputContainerId={`container-${id}`}
              icon={config.icon}
              icons={config.icons}
              onPointerEnter={handleEvents}
              onPointerLeave={handleEvents}
              onClick={handleEvents}
              value={config.value}
              disabled={actions[buttonName]?.disabled}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ToolBar;
