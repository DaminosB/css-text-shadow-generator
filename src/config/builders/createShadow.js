import InputPattern from "@/config/classes/InputPattern";

import {
  faBrush,
  faBullseye,
  faChevronDown,
  faChevronUp,
  faHighlighter,
  faRulerCombined,
  faRulerHorizontal,
  faRulerVertical,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faEye,
  faEyeSlash,
  faSquare,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";

const createShadow = (id, presets = {}) => {
  const { xShadowLength, yShadowLength, blurRadius, shadowColor } = presets;

  const inputsPattern = new InputPattern(id);
  inputsPattern
    .addInputsGroup(
      "shadowLength",
      {
        link: { initialState: true, linkText: "sync x and y axis" },
        labelText: "shadow offset",
        icon: faRulerCombined,
      },
      "number"
    )
    .addNumericInput(
      "xShadowLength",
      {
        defaultValue: 0,
        value: xShadowLength,
        range: [-150, 150],
        labelText: "horizontal offset",
        icon: faRulerHorizontal,
        format: "px",
      },
      "shadowLength"
    )
    .addNumericInput(
      "yShadowLength",
      {
        defaultValue: 0,
        value: yShadowLength,
        range: [-150, 150],
        labelText: "vertical offset",
        icon: faRulerVertical,
        format: "px",
      },
      "shadowLength"
    )
    .addNumericInput("blurRadius", {
      defaultValue: 0,
      value: blurRadius,
      labelText: "blur radius",
      icon: faBullseye,
      range: [0, 50],
      minValue: 0,
      format: "px",
    })
    .addColorInput("shadowColor", {
      defaultValue: "#000000",
      value: shadowColor,
      labelText: "shadow color",
      icon: faBrush,
      format: "hexa",
    })
    .setToggleOption("shadowColor", {
      value: true,
      labelText: "use text color",
      icons: { active: faSquareCheck, inactive: faSquare },
    })
    .addBoolean("enable", {
      labelTexts: { on: "Hide layer", off: "Show layer" },
      trigger: "click",
      value: true,
      icons: { on: faEye, off: faEyeSlash },
    })
    .addBoolean("highlight", {
      labelText: "Highlight layer",
      trigger: "hover",
      value: false,
      icon: faHighlighter,
    })
    .addAction("trashcan", {
      labelText: "Remove the layer",
      icon: faTrashCan,
    })
    .addBoolean("open", {
      labelTexts: { on: "Collapse layer", off: "Expand layer" },
      value: true,
      trigger: "click",
      icons: { on: faChevronDown, off: faChevronUp },
    });
  return inputsPattern.data;
};

export default createShadow;
