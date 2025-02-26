import {
  faArrowDownLong,
  faArrowRightLong,
  faBrush,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";

export default class ShadowConfig {
  static defaultValues = [
    {
      name: "xShadowLength",
      value: 0,
      type: "number",
      range: [-150, 150],
      labelText: "vertical offset",
      icon: faArrowRightLong,
    },
    {
      name: "yShadowLength",
      value: 0,
      labelText: "horizontal offset",
      icon: faArrowDownLong,
      type: "number",
      range: [-150, 150],
    },
    {
      name: "blurRadius",
      value: 0,
      labelText: "blur radius",
      icon: faBullseye,
      type: "number",
      range: [0, 50],
      minValue: 0,
    },
    {
      name: "inheritTextColor",
      value: true,
      labelText: "use text color",
      type: "boolean",
    },
    {
      name: "shadowColor",
      value: "#000000",
      labelText: "shadow color",
      icon: faBrush,
      type: "color",
      depedency: "inheritTextColor",
    },
    {
      name: "isVisible",
      value: true,
      type: "boolean",
    },
  ];

  static createShadowItem(config, id, bool) {
    if (bool) console.log(config, id);

    return {
      get inputId() {
        return `shadow-${id}_input-${config.name}`;
      },
      get inputContainerId() {
        return `shadow-${id}_container-${config.name}`;
      },
      get defaultValue() {
        return config.value;
      },
      ...config,
    };
  }

  static createShadow(id) {
    const configMap = new Map();
    this.defaultValues.forEach((config) => {
      configMap.set(config.name, this.createShadowItem(config, id));
    });

    return {
      id,
      inputs: Object.fromEntries(configMap),
    };
  }
}
