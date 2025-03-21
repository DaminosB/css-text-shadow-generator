import InputPattern from "@/config/classes/InputPattern";

import fontLibrary from "../fonts/googleFonts";

import {
  faFillDrip,
  faPaintBrush,
  faTextHeight,
  faFont,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const createTextConfig = () => {
  const inputsPattern = new InputPattern("text-config");
  inputsPattern
    .addTextInput("userText", "Type your text here")
    .addNumericInput("fontSize", {
      defaultValue: 75,
      labelText: "font size",
      icon: faTextHeight,
      type: "number",
      range: [1, 250],
      minValue: 1,
      format: "px",
    })
    .addColorInput("backgroundColor", {
      defaultValue: "#FFFFFF",
      labelText: "background color",
      icon: faFillDrip,
      format: "hexa",
    })
    .addColorInput("textColor", {
      defaultValue: "#000000",
      labelText: "text color",
      icon: faPaintBrush,
      format: "hexa",
    })
    .addSelectInput("textFont", {
      defaultValue: "montserrat",
      labelText: "text font",
      icon: faFont,
      list: Object.entries(fontLibrary).map(([fontLabel, font]) => ({
        ...font,
        label: fontLabel,
      })),
    })
    .addBoolean("open", {
      value: true,
      trigger: "click",
      icons: { on: faChevronDown, off: faChevronUp },
    });

  return inputsPattern.data;
};

export default createTextConfig;
