import DemoPatternBuilder from "@/config/classes/DemoPatternBuilder";
import ShadowConfig from "@/config/classes/ShadowConfig";
import { useMemo } from "react";

const useDemoPattern = (initialState) => {
  const builder = useMemo(() => new DemoPatternBuilder(initialState), []);

  const newShadowId = useMemo(() => crypto.randomUUID(), []);

  const demoPattern = useMemo(
    () =>
      builder
        .addValueChangeStep(
          "userText",
          ["textConfig"],
          "Something cool",
          "Type something cool"
        )
        .addValueChangeStep(
          "fontSize",
          ["textConfig"],
          45,
          "Pump up the characters size"
        )
        .addValueChangeStep(
          "textColor",
          ["textConfig"],
          "#EAEAE5",
          "Make your letters pop"
        )
        .addValueChangeStep(
          "backgroundColor",
          ["textConfig"],
          "#5F67A9",
          "Pick your backdrop"
        )
        .addValueChangeStep(
          "textFont",
          ["textConfig"],
          "Comfortaa",
          "Choose a fresh font"
        )
        .addValueChangeStep(
          "xShadowLength",
          ["shadows", 0, "inputs"],
          15,
          "Slide it sideways..."
        )
        .addValueChangeStep(
          "yShadowLength",
          ["shadows", 0, "inputs"],
          15,
          "...And up and down"
        )
        .addValueChangeStep(
          "blurRadius",
          ["shadows", 0, "inputs"],
          15,
          "Blur it out"
        )
        .addStep({
          path: ["shadows", 0, "inputs"],
          inputName: "inheritTextColor",
          demoText: "Match the text's color",
        })
        .addMultipleValueChangeStep(
          { inputName: "shadowColor" },
          ["shadows", 0, "inputs"],
          [
            { inputName: "inheritTextColor", targetValue: false },
            { inputName: "shadowColor", targetValue: "#E0DC4F" },
          ],
          "...Or choose your own!"
        )
        .addAppendValueStep(
          { inputContainerId: "append-button" },
          ["shadows"],
          ShadowConfig.createShadow(newShadowId),
          "Add a new layer"
        )
        .addMultipleValueChangeStep(
          { inputData: { inputContainerId: newShadowId } },
          ["shadows", 1, "inputs"],
          [
            { inputName: "xShadowLength", targetValue: -15 },
            { inputName: "yShadowLength", targetValue: -15 },
            { inputName: "blurRadius", targetValue: 15 },
          ],
          "Set new parameters"
        )
        .addValueChangeStep(
          "isVisible",
          ["shadows", 1, "inputs"],
          false,
          "Hide or remove the layer"
        )
        .addStep({
          path: ["textConfig"],
          inputName: "userText",
          demoText: "Check the result live",
        })
        .build(),
    []
  );

  return demoPattern;
};

export default useDemoPattern;
