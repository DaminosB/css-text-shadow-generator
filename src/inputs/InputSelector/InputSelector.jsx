import styles from "./InputSelector.module.css";

import NumericInputSlider from "@/inputs/NumericInputSlider/NumericInputSlider";
import ColorInput from "@/inputs/ColorInput/ColorInput";
import SelectInput from "@/inputs/SelectInput/SelectInput";

const InputSelector = ({ setValue, config }) => {
  switch (config.type) {
    case "number":
      return (
        <NumericInputSlider
          inputId={config.inputId}
          name={config.name}
          label={config.labelText}
          inputContainerId={config.inputContainerId}
          icon={config.icon}
          range={config.range}
          minValue={config.minValue}
          maxValue={config.maxValue}
          defaultValue={config.defaultValue}
          value={config.value}
          setValue={setValue}
          unit={config.unit}
        />
      );

    case "color":
      return (
        <ColorInput
          inputId={config.inputId}
          inputContainerId={config.inputContainerId}
          name={config.name}
          label={config.labelText}
          icon={config.icon}
          defaultValue={config.defaultValue}
          value={config.value}
          setValue={setValue}
          disabled={config.toggleOption?.value}
        />
      );

    case "select":
      return (
        <SelectInput
          key={config.inputId}
          inputId={config.inputId}
          inputContainerId={config.inputContainerId}
          name={config.name}
          label={config.labelText}
          icon={config.icon}
          value={config.value}
          setValue={setValue}
          list={config.list}
          defaultValue={config.defaultValue}
          // path={config.path}
        />
      );

    default:
      break;
  }
};

export default InputSelector;
