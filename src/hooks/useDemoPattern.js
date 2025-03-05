import DemoPatternBuilder from "@/config/classes/DemoPatternBuilder";
import ShadowConfig from "@/config/classes/ShadowConfig";
import { useMemo } from "react";

const useDemoPattern = (initialState) => {
  const demoPattern = useMemo(() => {
    const newShadowId = crypto.randomUUID();
    const builder = new DemoPatternBuilder(initialState);

    return builder
      .addValueChangeStep("userText", ["textConfig"], "Something cool", {
        alignment: "left",
        text: "Type something cool",
      })
      .addValueChangeStep("fontSize", ["textConfig"], 100, {
        alignment: "right",
        text: "Pump up the characters size",
      })
      .addValueChangeStep("backgroundColor", ["textConfig"], "#5F67A9", {
        alignment: "right",
        text: "Pick your backdrop",
      })
      .addValueChangeStep("textColor", ["textConfig"], "#EAEAE5", {
        alignment: "right",
        text: "Make your letters pop",
      })
      .addValueChangeStep("textFont", ["textConfig"], "comfortaa", {
        alignment: "right",
        text: "Choose a fresh font",
      })
      .addValueChangeStep("xShadowLength", ["shadows", 0, "inputs"], 30, {
        alignment: "right",
        text: "Slide it sideways...",
      })
      .addValueChangeStep("yShadowLength", ["shadows", 0, "inputs"], 30, {
        alignment: "right",
        text: "...And up and down",
      })
      .addValueChangeStep("blurRadius", ["shadows", 0, "inputs"], 15, {
        alignment: "right",
        text: "Blur it out",
      })
      .addStep({
        path: ["shadows", 0, "inputs"],
        inputName: "inheritTextColor",
        demoConfig: { alignment: "right", text: "Match the text's color" },
      })
      .addMultipleValueChangeStep(
        { inputName: "shadowColor" },
        ["shadows", 0, "inputs"],
        [
          { inputName: "inheritTextColor", targetValue: false },
          { inputName: "shadowColor", targetValue: "#E0DC4F" },
        ],
        { alignment: "right", text: "...Or choose your own!" }
      )
      .addAppendValueStep(
        { inputContainerId: "append-button" },
        ["shadows"],
        ShadowConfig.createShadow(newShadowId),
        { alignment: "right", text: "Add a new layer" }
      )
      .addMultipleValueChangeStep(
        { inputData: { inputContainerId: newShadowId } },
        ["shadows", 1, "inputs"],
        [
          { inputName: "xShadowLength", targetValue: -15 },
          { inputName: "yShadowLength", targetValue: -15 },
          { inputName: "blurRadius", targetValue: 15 },
        ],
        { alignment: "right", text: "Set new parameters" }
      )
      .addValueChangeStep("isVisible", ["shadows", 1, "inputs"], false, {
        alignment: "right",
        text: "You can hide a layer",
      })
      .addStep({
        inputData: {
          inputContainerId: `shadow-${newShadowId}-remove-button`,
        },
        demoConfig: { alignment: "right", text: "Or remove it completely" },
      })
      .addStep({
        path: ["textConfig"],
        inputName: "userText",
        demoConfig: { alignment: "left", text: "Check the result live" },
      })
      .addStep({
        inputData: { inputContainerId: "output-box" },
        demoConfig: { alignment: "left", text: "Copy the CSS property" },
      })
      .build();
  }, []);

  return demoPattern;
};

export default useDemoPattern;
