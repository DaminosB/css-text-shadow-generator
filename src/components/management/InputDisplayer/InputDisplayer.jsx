import styles from "./InputDisplayer.module.css";

import { useMemo, useCallback } from "react";

import { useDispatch } from "react-redux";
import {
  commitSettings,
  updateSettings,
} from "@/features/workflow/workflowSlice";

import { iconsList } from "@/assets/icons/iconsLibrary";

import InputSelector from "../InputSelector/InputSelector";
import SmartButton from "../../inputs/SmartButton/SmartButton";

import parse from "@/utils/parse";
import resolvePath from "@/utils/resolvePath";

const InputDisplayer = ({ config, path }) => {
  const dispatch = useDispatch();

  const inputContainerClasses = useMemo(
    () =>
      `${styles.inputContainer} ${
        config.toggleOption?.value ? styles.closed : styles.open
      }`,
    [config.toggleOption]
  );

  const patternIndex = useMemo(
    () => (typeof path[4] === "number" ? path[4] : null),
    [path]
  );

  const toggleLink = useCallback(
    (e) => {
      const value = !parse(e.currentTarget.value);

      dispatch(
        updateSettings({ path: [...path, "link"], key: "value", value })
      );

      const commitLabel = `${config.labelText} ${
        value ? "linked" : "unlinked"
      }`;
      const inputIcon = value ? iconsList.LinkSimple : iconsList.LinkBreak;

      dispatch(
        commitSettings({
          category: path[2],
          changedIndex: patternIndex,
          label: commitLabel,
          inputIcon,
        })
      );
    },
    [dispatch, path, config.labelText, patternIndex]
  );

  const toggleInput = useCallback(
    (e) => {
      const value = !parse(e.currentTarget.value);
      dispatch(
        updateSettings({
          path: [...path, "toggleOption"],
          key: "value",
          value,
        })
      );

      const commitLabel = `${config.toggleOption.labelText} ${
        value ? "enabled" : "disabled"
      }`;
      const inputIcon = value ? iconsList.CheckSquare : iconsList.Square;

      dispatch(
        commitSettings({
          category: path[2],
          changedIndex: patternIndex,
          label: commitLabel,
          inputIcon,
        })
      );
    },
    [dispatch, path, patternIndex, config.toggleOption?.labelText]
  );

  const updateValue = useCallback(
    (value, extraPath = []) => {
      dispatch(
        updateSettings({
          path: [...path, ...extraPath],
          key: "value",
          value,
        })
      );
    },
    [dispatch, path]
  );

  const commit = useCallback(
    (startValue, endValue, extraPath = []) => {
      if (startValue !== endValue) {
        const target = resolvePath(config, extraPath);

        const icon = target.icon;
        const commitLabel = `${target.labelText} from ${startValue} to ${endValue}`;

        dispatch(
          commitSettings({
            category: path[2],
            changedIndex: patternIndex,
            label: commitLabel,
            inputIcon: icon,
          })
        );
      }
    },
    [dispatch, config, path, patternIndex]
  );

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
                  icons={{
                    on: iconsList.LinkSimple,
                    off: iconsList.LinkBreak,
                  }}
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

                const groupCommit = (startValue, endValue, inputLabel) => {
                  const extraPath = config.link.value
                    ? []
                    : ["inputs", inputName];

                  commit(startValue, endValue, extraPath);
                };

                return (
                  <InputSelector
                    key={inputConfig.inputId}
                    config={inputConfig}
                    setValue={setGroupValues}
                    commit={groupCommit}
                  />
                );
              })}
            </fieldset>
          </div>
        ) : (
          <InputSelector
            setValue={updateValue}
            config={config}
            commit={commit}
          />
        )}
      </div>
      {config.toggleOption !== undefined && (
        <SmartButton
          inputId={config.toggleOption.inputId}
          inputContainerId={config.toggleOption.inputContainerId}
          name={config.toggleOption.name}
          value={config.toggleOption.value}
          text={config.toggleOption.labelText}
          icons={{ on: iconsList.CheckSquare, off: iconsList.Square }}
          onClick={toggleInput}
          isDimmed={false}
          disabled={false}
        />
      )}
    </div>
  );
};

export default InputDisplayer;
