import styles from "./ControlsButtons.module.css";

import { useCallback } from "react";

import { useDispatch } from "react-redux";
import { updateState } from "@/features/controls/controlsSlice";

import SmartButton from "@/components/inputs/SmartButton/SmartButton";

const ControlsButtons = ({ controls, actions, path }) => {
  const dispatch = useDispatch();

  const toggleValue = useCallback(
    (newValue, buttonPath) => {
      dispatch(
        updateState({
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
      const button = controls[e.currentTarget.name];
      const { trigger, name, value, type } = button.config;
      const buttonPath = [...path, name, "config"];

      let newValue = value ?? null;

      switch (e.type) {
        case "pointerenter":
        case "pointerleave":
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
    },
    [controls, path, actions, toggleValue]
  );

  return Object.entries(controls).map(([buttonName, attributes]) => {
    const { id, config } = attributes;
    return (
      <SmartButton
        key={id}
        inputId={id}
        name={buttonName}
        icon={config.icon}
        icons={config.icons}
        onPointerEnter={handleEvents}
        onPointerLeave={handleEvents}
        onClick={handleEvents}
        value={config.value}
        disabled={
          config.type === "action" ? actions[buttonName].disabled : false
        }
      />
    );
  });
};

export default ControlsButtons;
