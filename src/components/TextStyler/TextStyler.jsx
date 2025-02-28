import styles from "./TextStyler.module.css";

import { useContext, useState } from "react";
import { WorkspaceCtxt } from "@/components/Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { updateRootSettings } from "@/features/textSettings/textSettingsSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import NumericInputSlider from "@/inputs/NumericInputSlider/NumericInputSlider";
import ColorInput from "@/inputs/ColorInput/ColorInput";
import FontSelector from "@/inputs/FontSelector/FontSelector";

const TextStyler = () => {
  const [showContent, setShowContent] = useState(true);

  const textSettings = useSelector((store) => store.textSettings);

  const toggleShowContent = () => {
    setShowContent((prev) => !prev);
  };

  const dispatch = useDispatch();

  const dispatchRootUpdate = (newKey) => {
    dispatch(updateRootSettings(newKey));
  };

  return (
    <div className={`${styles.textStyler} ${showContent ? "" : styles.closed}`}>
      <div>
        <h2>text style</h2>
        <button onClick={toggleShowContent}>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>
      <div>
        {Object.entries(textSettings.textConfig).map((input) => {
          const [inputName, config] = input;
          switch (config.type) {
            case "number":
              return (
                <NumericInputSlider
                  key={config.inputId}
                  inputId={config.inputId}
                  inputContainerId={config.inputContainerId}
                  name={inputName}
                  label={config.labelText}
                  icon={config.icon}
                  value={config.value}
                  defaultValue={config.defaultValue}
                  unit={"px"}
                  minValue={config.minValue}
                  maxValue={config.maxValue}
                  range={config.range}
                  setValue={dispatchRootUpdate}
                />
              );

            case "color":
              return (
                <ColorInput
                  key={config.inputId}
                  inputId={config.inputId}
                  inputContainerId={config.inputContainerId}
                  name={inputName}
                  label={config.labelText}
                  icon={config.icon}
                  value={config.value}
                  defaultValue={config.defaultValue}
                  setValue={dispatchRootUpdate}
                />
              );

            case "select":
              return (
                <FontSelector
                  key={config.inputId}
                  inputId={config.inputId}
                  inputContainerId={config.inputContainerId}
                  name={inputName}
                  label={config.labelText}
                  icon={config.icon}
                  value={config.value}
                  defaultValue={config.defaultValue}
                  setValue={dispatchRootUpdate}
                />
              );

            default:
              break;
          }
        })}
      </div>
    </div>
  );
};

export default TextStyler;
