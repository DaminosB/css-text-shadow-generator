import styles from "./InputDisplayer.module.css";

import { useMemo } from "react";

import { useDispatch } from "react-redux";
import { updateSetting } from "@/features/textSettings/textSettingsSlice";

import {
  faCheckSquare,
  faLink,
  faLinkSlash,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import InputSelector from "../InputSelector/InputSelector";
import SmartButton from "../SmartButton/SmartButton";
import parse from "@/utils/parse";

const InputDisplayer = ({ config, path }) => {
  const dispatch = useDispatch();

  const inputContainerClasses = useMemo(
    () =>
      `${styles.inputContainer} ${
        config.toggleOption?.value ? styles.closed : styles.open
      }`,
    [config.toggleOption]
  );

  const toggleLink = (e) => {
    const value = !parse(e.currentTarget.value);
    dispatch(updateSetting({ path: [...path, "link"], key: "value", value }));
  };

  const toggleInput = (e) => {
    const value = !parse(e.currentTarget.value);
    dispatch(
      updateSetting({
        path: [...path, "toggleOption"],
        key: "value",
        value,
      })
    );
  };

  const updateValue = (value, extraPath = []) => {
    dispatch(
      updateSetting({ path: [...path, ...extraPath], key: "value", value })
    );
  };

  return (
    <div className={styles.inputDisplayer}>
      <div className={inputContainerClasses}>
        {config.type === "group" ? (
          <div
            id={config.inputContainerId}
            className={`${styles.inputGroup} ${
              config.link.value ? styles.grouped : ""
            }`}
          >
            <div>
              <span>{config.labelText}</span>
              <FontAwesomeIcon icon={config.icon} />
            </div>
            <SmartButton
              inputId={config.link.inputId}
              inputContainerId={config.link.inputContainerId}
              name={config.name}
              value={config.link.value}
              text={config.link.text}
              icons={{ on: faLink, off: faLinkSlash }}
              onClick={toggleLink}
              isDimmed={false}
              disabled={false}
            />
            <div>
              {Object.entries(config.inputs).map(([inputName, inputConfig]) => {
                const setGroupValues = (value) => {
                  if (config.link.value) {
                    Object.entries(config.inputs).forEach(
                      ([linkedInputName]) => {
                        updateValue(value, ["inputs", linkedInputName]);
                      }
                    );
                  } else {
                    updateValue(value, ["inputs", inputName]);
                  }
                };
                return (
                  <InputSelector
                    key={inputConfig.inputId}
                    config={inputConfig}
                    setValue={setGroupValues}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <InputSelector setValue={updateValue} config={config} />
        )}
      </div>
      {config.toggleOption !== undefined && (
        <SmartButton
          inputId={config.toggleOption.inputId}
          inputContainerId={config.toggleOption.inputContainerId}
          name={config.toggleOption.name}
          value={config.toggleOption.value}
          text={config.toggleOption.labelText}
          icons={{ on: faCheckSquare, off: faSquare }}
          onClick={toggleInput}
          isDimmed={false}
          disabled={false}
        />
      )}
    </div>
  );
};

export default InputDisplayer;
