import styles from "./TextStyler.module.css";

import { useState, useMemo } from "react";

import { useSelector, useDispatch } from "react-redux";
import { updateSetting } from "@/features/textSettings/textSettingsSlice";

import InputDisplayer from "@/inputs/InputDisplayer/InputDisplayer";
import SmartButton from "@/inputs/SmartButton/SmartButton";

import parse from "@/utils/parse";

const TextStyler = ({ path }) => {
  const { textConfig } = useSelector((store) => store.textSettings);

  const toggleButton = useMemo(() => textConfig.controls.open, [textConfig]);

  const dispatch = useDispatch();

  const toggleShowContent = (e) => {
    const buttonName = e.currentTarget.name;
    const buttonValue = !parse(e.currentTarget.value);
    const controlPath = [...path, "controls", buttonName, "config"];

    dispatch(
      updateSetting({ path: controlPath, key: "value", value: buttonValue })
    );
  };

  return (
    <div
      className={`${styles.textStyler} ${
        toggleButton.config.value ? "" : styles.closed
      }`}
    >
      <div>
        <h2>text style</h2>
        <SmartButton
          key={toggleButton.id}
          inputId={toggleButton.id}
          name={toggleButton.config.name}
          inputContainerId={`container-${toggleButton.id}`}
          icon={toggleButton.config.icon}
          icons={toggleButton.config.icons}
          onClick={toggleShowContent}
          value={toggleButton.config.value}
        />
      </div>
      <div>
        {Object.entries(textConfig.inputs).map(([inputName, config]) => {
          const inputPath = [...path, "inputs", inputName];
          return (
            <InputDisplayer
              key={config.inputId}
              config={config}
              path={inputPath}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TextStyler;
