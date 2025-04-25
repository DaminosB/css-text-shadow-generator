import styles from "./InputDisplayer.module.css";

import { useMemo } from "react";

import { useDispatch } from "react-redux";
import { updateState } from "@/features/controls/controlsSlice";

import {
  faCheckSquare,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";

import InputSelector from "../InputSelector/InputSelector";
import SmartButton from "../../inputs/SmartButton/SmartButton";

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

    dispatch(updateState({ path: [...path, "link"], key: "value", value }));
  };

  const toggleInput = (e) => {
    const value = !parse(e.currentTarget.value);
    dispatch(
      updateState({
        path: [...path, "toggleOption"],
        key: "value",
        value,
      })
    );
  };

  const updateValue = (value, extraPath = []) => {
    dispatch(
      updateState({ path: [...path, ...extraPath], key: "value", value })
    );
  };

  return (
    <div className={styles.inputDisplayer}>
      <div className={inputContainerClasses}>
        {config.type === "group" ? (
          <div
            id={`containerFor-${config.inputId}`}
            className={`${styles.inputGroup} ${
              config.link.value ? styles.grouped : ""
            }`}
          >
            <fieldset>
              <legend>
                <SmartButton
                  inputId={config.link.inputId}
                  name={config.name}
                  value={config.link.value}
                  text={config.labelText}
                  icons={{ on: faLock, off: faLockOpen }}
                  onClick={toggleLink}
                  isDimmed={false}
                  disabled={false}
                />
              </legend>
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
            </fieldset>
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
