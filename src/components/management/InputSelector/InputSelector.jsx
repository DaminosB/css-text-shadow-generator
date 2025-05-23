import styles from "./InputSelector.module.css";

import NumericInputSlider from "@/components/inputs/NumericInputSlider/NumericInputSlider";
import ColorInput from "@/components/inputs/ColorInput/ColorInput";
import SelectInput from "@/components/inputs/SelectInput/SelectInput";

const InputSelector = ({ setValue, config, commit }) => {
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
          value={config.value}
          setValue={setValue}
          format={config.format}
          commit={commit}
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
          value={config.value}
          setValue={setValue}
          disabled={config.toggleOption?.value}
          commit={commit}
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
          commit={commit}
        />
      );

    default:
      break;
  }
};

export default InputSelector;
