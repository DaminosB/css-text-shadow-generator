import InputPattern from "@/config/models/InputPattern";
import ButtonPattern from "../models/ButtonPattern";

import { iconsList } from "../../assets/icons/iconsLibrary";

const createShadow = (id, presets = {}) => {
  const { xShadowLength, yShadowLength, blurRadius, shadowColor } = presets;
  const patternId = id ?? crypto.randomUUID();
  // const patternId  id ?? Math.random(),

  const inputsPattern = new InputPattern(patternId);
  inputsPattern
    .addInputsGroup(
      "shadowLength",
      {
        link: { initialState: true, linkText: "sync x and y axis" },
        labelText: "Shadow offsets",
        icon: iconsList.VectorTwo,
      },
      "number"
    )
    .addNumericInput(
      "xShadowLength",
      {
        defaultValue: 0,
        value: xShadowLength,
        range: [-150, 150],
        labelText: "Horizontal offset",
        icon: iconsList.ArrowsOutLineHorizontal,
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
        labelText: "Vertical offset",
        icon: iconsList.ArrowsOutLineVertical,
        format: "px",
      },
      "shadowLength"
    )
    .addNumericInput("blurRadius", {
      defaultValue: 0,
      value: blurRadius,
      labelText: "Blur radius",
      icon: iconsList.CircleDashed,
      range: [0, 50],
      minValue: 0,
      format: "px",
    })
    .addColorInput("shadowColor", {
      defaultValue: "#000000",
      value: shadowColor,
      labelText: "Shadow color",
      icon: iconsList.Palette,
      format: "hexa",
    })
    .setToggleOption("shadowColor", {
      value: shadowColor ? false : true,
      labelText: "Use text color",
      icons: { active: iconsList.CheckSquare, inactive: iconsList.Square },
    });

  const buttonPattern = new ButtonPattern(patternId);

  buttonPattern
    .addBoolean("enable", {
      labelTexts: { on: "show layer", off: "hide layer" },
      trigger: "click",
      shouldCommit: true,
      value: true,
      icons: { on: iconsList.Eye, off: iconsList.EyeClosed },
    })
    .addBoolean("highlight", {
      labelText: "Highlight layer",
      trigger: "hover",
      shouldCommit: false,
      value: false,
      icon: iconsList.Highlighter,
    })
    .addAction("trashcan", {
      labelText: "Remove the layer",
      icon: iconsList.Trash,
      trigger: "click",
      value: "removePattern",
    });

  return {
    id: patternId,
    label: "Layer #{index}",
    icon: iconsList.StackSimple,
    inputs: inputsPattern.inputs,
    buttons: buttonPattern.buttons,
  };
};

export default createShadow;
