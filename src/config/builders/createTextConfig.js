import InputPattern from "@/config/classes/InputPattern";

import fontLibrary from "../fonts/googleFonts";

import {
  faFillDrip,
  faPaintBrush,
  faTextHeight,
  faFont,
} from "@fortawesome/free-solid-svg-icons";

const createTextConfig = () => {
  const inputsPattern = new InputPattern(
    "general-settings",
    "General settings"
  );
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
      labelText: "background",
      icon: faFillDrip,
      format: "hexa",
    })
    .addColorInput("textColor", {
      defaultValue: "#000000",
      labelText: "text",
      icon: faPaintBrush,
      format: "hexa",
    })
    .addSelectInput("textFont", {
      defaultValue: "montserrat",
      labelText: "font",
      icon: faFont,
      list: Object.entries(fontLibrary).map(([fontLabel, font]) => ({
        ...font,
        label: fontLabel,
      })),
    });
  // .addBoolean("pinned", {
  //   labelText: "Pin",
  //   value: false,
  //   trigger: "click",
  //   icons: { on: faThumbtack, off: faThumbTackSlash },
  // })
  // .addBoolean("horizontal", {
  //   labelText: "Change display",
  //   value: true,
  //   icons: { on: faChevronLeft, off: faChevronDown },
  //   trigger: "click",
  // })
  // .addBoolean("open", {
  //   labelText: "close",
  //   value: true,
  //   trigger: "click",
  //   icon: faXmark,
  // });

  return inputsPattern.data;
};

export default createTextConfig;
