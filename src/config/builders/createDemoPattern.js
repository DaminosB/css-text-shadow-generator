import createShadow from "@/config/builders/createShadow";
import createTextConfig from "@/config/builders/createTextConfig";

import DemoPattern from "@/config/classes/DemoPattern";

const initialState = {
  textConfig: createTextConfig(),
  shadows: [createShadow("demo-shadow", {})],
};

const demoPattern = new DemoPattern(initialState);
demoPattern
  .addStep(
    {
      alignment: "left",
      text: "Type something cool",
      targetId:
        demoPattern.currentState.textConfig.inputs.userText.inputContainerId,
    },
    {
      path: ["textConfig", "inputs", "userText"],
      key: "value",
      newValue: "Something cool",
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Pump up the characters size",
      targetId:
        demoPattern.currentState.textConfig.inputs.fontSize.inputContainerId,
    },
    {
      path: ["textConfig", "inputs", "fontSize"],
      key: "value",
      newValue: 100,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Pick your backdrop",
      targetId:
        demoPattern.currentState.textConfig.inputs.backgroundColor
          .inputContainerId,
    },
    {
      path: ["textConfig", "inputs", "backgroundColor"],
      key: "value",
      newValue: "#5F67A9",
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Make your letters pop",
      targetId:
        demoPattern.currentState.textConfig.inputs.textColor.inputContainerId,
    },
    {
      path: ["textConfig", "inputs", "textColor"],
      key: "value",
      newValue: "#EAEAE5",
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Choose a fresh font",
      targetId:
        demoPattern.currentState.textConfig.inputs.textFont.inputContainerId,
    },
    {
      path: ["textConfig", "inputs", "textFont"],
      key: "value",
      newValue: "comfortaa",
    }
  )
  .addStep({
    alignment: "right",
    text: "Link the shadow offsets",
    targetId:
      demoPattern.currentState.shadows[0].inputs.shadowLength.link
        .inputContainerId,
  })
  .addStep(
    {
      alignment: "right",
      text: "And slide them together",
      targetId:
        demoPattern.currentState.shadows[0].inputs.shadowLength
          .inputContainerId,
    },
    {
      path: ["shadows", 0, "inputs", "shadowLength", "inputs", "xShadowLength"],
      key: "value",
      newValue: 30,
    },
    {
      path: ["shadows", 0, "inputs", "shadowLength", "inputs", "yShadowLength"],
      key: "value",
      newValue: 30,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Or unlink the shadow offsets",
      targetId:
        demoPattern.currentState.shadows[0].inputs.shadowLength.link
          .inputContainerId,
    },
    {
      path: ["shadows", 0, "inputs", "shadowLength", "link"],
      key: "value",
      newValue: false,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "And slide them indepedently",
      targetId:
        demoPattern.currentState.shadows[0].inputs.shadowLength
          .inputContainerId,
    },
    {
      path: ["shadows", 0, "inputs", "shadowLength", "inputs", "xShadowLength"],
      key: "value",
      newValue: -10,
    },
    {
      path: ["shadows", 0, "inputs", "shadowLength", "inputs", "yShadowLength"],
      key: "value",
      newValue: -45,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Blur it out",
      targetId:
        demoPattern.currentState.shadows[0].inputs.blurRadius.inputContainerId,
    },
    {
      path: ["shadows", 0, "inputs", "blurRadius"],
      key: "value",
      newValue: 15,
    }
  )
  .addStep({
    alignment: "right",
    text: "Match the text's color",
    targetId:
      demoPattern.currentState.shadows[0].inputs.shadowColor.toggleOption
        .inputContainerId,
  })
  .addStep(
    {
      alignment: "right",
      text: "...Or choose your own!",
      targetId:
        demoPattern.currentState.shadows[0].inputs.shadowColor.inputContainerId,
    },
    {
      path: ["shadows", 0, "inputs", "shadowColor", "toggleOption"],
      key: "value",
      newValue: false,
    },
    {
      path: ["shadows", 0, "inputs", "shadowColor"],
      key: "value",
      newValue: "#E0DC4F",
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Add a new layer",
      targetId: "append-button",
    },
    {
      path: [],
      key: "shadows",
      newValue: [...demoPattern.currentState.shadows, createShadow()],
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Set it as you like",
      targetId: demoPattern.currentState.shadows[1].id,
    },
    {
      path: ["shadows", 1, "inputs", "shadowLength", "inputs", "xShadowLength"],
      key: "value",
      newValue: 5,
    },
    {
      path: ["shadows", 1, "inputs", "shadowLength", "inputs", "yShadowLength"],
      key: "value",
      newValue: 5,
    },
    {
      path: ["shadows", 1, "inputs", "blurRadius"],
      key: "value",
      newValue: 10,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Highlight the active layer",
      targetId: `container-${demoPattern.currentState.shadows[1].controls.highlight.id}`,
    },
    {
      path: ["shadows", 1, "controls", "highlight", "config"],
      key: "value",
      newValue: true,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Toggle the layer's visibility",
      targetId: `container-${demoPattern.currentState.shadows[1].controls.enable.id}`,
    },
    {
      path: ["shadows", 1, "controls", "enable", "config"],
      key: "value",
      newValue: false,
    },
    {
      path: ["shadows", 1, "controls", "highlight", "config"],
      key: "value",
      newValue: false,
    }
  )
  .addStep({
    alignment: "right",
    text: "Or remove it completely",
    targetId: `container-${demoPattern.currentState.shadows[1].controls.trashcan.id}`,
  })
  .addStep({
    alignment: "left",
    text: "Check the result live",
    targetId:
      demoPattern.currentState.textConfig.inputs.userText.inputContainerId,
  })
  .addStep({
    alignment: "left",
    text: "Copy the CSS code",
    targetId: "output-box",
  });

export default demoPattern.steps;
