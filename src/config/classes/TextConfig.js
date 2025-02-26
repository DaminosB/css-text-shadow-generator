import {
  faFillDrip,
  faPaintBrush,
  faTextHeight,
  faFont,
} from "@fortawesome/free-solid-svg-icons";

export default class TextConfig {
  static defaultValues = [
    {
      name: "userText",
      value: "Type your text here",
      type: "text",
    },
    {
      name: "fontSize",
      value: 75,
      labelText: "font size",
      icon: faTextHeight,
      type: "number",
      range: [1, 250],
      minValue: 1,
    },
    {
      name: "textColor",
      value: "#000000",
      labelText: "text color",
      icon: faPaintBrush,
      type: "color",
    },
    {
      name: "backgroundColor",
      value: "#FFFFFF",
      labelText: "background color",
      icon: faFillDrip,
      type: "color",
    },
    {
      name: "textFont",
      value: "Montserrat",
      labelText: "text font",
      icon: faFont,
      type: "select",
    },
  ];

  static createTextItem(config) {
    return {
      get inputId() {
        return `textConfig-input-${this.name}`;
      },
      get inputContainerId() {
        return `textConfig-container-${this.name}`;
      },
      get defaultValue() {
        return config.value;
      },
      ...config,
    };
  }

  static createConfig() {
    const configMap = new Map();
    this.defaultValues.forEach((config) => {
      configMap.set(config.name, this.createTextItem(config));
    });

    return Object.fromEntries(configMap);
  }
}
