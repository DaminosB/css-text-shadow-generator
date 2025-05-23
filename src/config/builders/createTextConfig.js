import InputPattern from "@/config/models/InputPattern";

import { iconsList } from "../../assets/icons/iconsLibrary";

import fontLibrary from "../../assets/fonts/googleFonts";

const createTextConfig = (presets = {}) => {
  const { userText, fontSize, backgroundColor, textColor, textFont } = presets;
  const inputsPattern = new InputPattern("general-settings");
  inputsPattern
    .addTextInput("userText", {
      value: userText,
      defaultValue: "Type your text here",
    })
    .addNumericInput("fontSize", {
      defaultValue: 75,
      value: fontSize,
      labelText: "Font size",
      icon: iconsList.Ruler,
      type: "number",
      range: [1, 250],
      minValue: 1,
      format: "px",
    })
    .addColorInput("backgroundColor", {
      defaultValue: "#FFFFFF",
      value: backgroundColor,
      labelText: "Background color",
      icon: iconsList.PaintRoller,
      format: "hexa",
    })
    .addColorInput("textColor", {
      defaultValue: "#000000",
      value: textColor,
      labelText: "Text color",
      icon: iconsList.PaintBrush,
      format: "hexa",
    })
    .addSelectInput("textFont", {
      defaultValue: "montserrat",
      value: textFont,
      labelText: "Font",
      icon: iconsList.TextAa,
      list: Object.entries(fontLibrary).map(([fontLabel, font]) => ({
        ...font,
        label: fontLabel,
      })),
    });

  return {
    id: "general-settings",
    label: "General settings",
    icon: iconsList.SlidersHorizontal,
    inputs: inputsPattern.inputs,
  };
};

export default createTextConfig;
