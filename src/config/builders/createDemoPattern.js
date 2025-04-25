import createShadow from "@/config/builders/createShadow";
import createTextConfig from "@/config/builders/createTextConfig";

import DemoPattern from "@/config/classes/DemoPattern";
import createInitialState from "./createInitialState";

const initialState = createInitialState();

const demoPattern = new DemoPattern(initialState);
demoPattern
  .addStep(
    {
      alignment: "left",
      text: "Type something cool",
      targetId: demoPattern.currentState.text.id,
    },
    {
      path: ["text"],
      key: "value",
      newValue: "Something cool",
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Pump up the characters size",
      targetId: `labelFor-${demoPattern.currentState.items.data.generalSettings.data[0].inputs.fontSize.inputId}`,
    },
    {
      path: [
        "items",
        "data",
        "generalSettings",
        "data",
        0,
        "inputs",
        "fontSize",
      ],
      key: "value",
      newValue: 100,
    },
    { path: ["items"], key: "isOpen", newValue: true }
  )
  .addStep(
    {
      alignment: "right",
      text: "Pick your backdrop",
      targetId: `labelFor-${demoPattern.currentState.items.data.generalSettings.data[0].inputs.backgroundColor.inputId}`,
    },
    {
      path: [
        "items",
        "data",
        "generalSettings",
        "data",
        0,
        "inputs",
        "backgroundColor",
      ],
      key: "value",
      newValue: "#5F67A9",
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Make your letters pop",
      targetId: `labelFor-${demoPattern.currentState.items.data.generalSettings.data[0].inputs.textColor.inputId}`,
    },
    {
      path: [
        "items",
        "data",
        "generalSettings",
        "data",
        0,
        "inputs",
        "textColor",
      ],
      key: "value",
      newValue: "#EAEAE5",
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Choose a fresh font",
      targetId: `labelFor-${demoPattern.currentState.items.data.generalSettings.data[0].inputs.textFont.inputId}`,
    },
    {
      path: [
        "items",
        "data",
        "generalSettings",
        "data",
        0,
        "inputs",
        "textFont",
      ],
      key: "value",
      newValue: "comfortaa",
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Link the shadow offsets",
      targetId:
        demoPattern.currentState.items.data.layers.data[0].inputs.shadowLength
          .link.inputId,
    },
    {
      path: ["items", "data", "layers"],
      key: "isOpen",
      newValue: true,
    },
    {
      path: ["items", "data", "generalSettings"],
      key: "isOpen",
      newValue: false,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "And slide them together",
      targetId: `containerFor-${demoPattern.currentState.items.data.layers.data[0].inputs.shadowLength.inputId}`,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        0,
        "inputs",
        "shadowLength",
        "inputs",
        "xShadowLength",
      ],
      key: "value",
      newValue: 30,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        0,
        "inputs",
        "shadowLength",
        "inputs",
        "yShadowLength",
      ],
      key: "value",
      newValue: 30,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Or unlink the shadow offsets",
      targetId:
        demoPattern.currentState.items.data.layers.data[0].inputs.shadowLength
          .link.inputId,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        0,
        "inputs",
        "shadowLength",
        "link",
      ],
      key: "value",
      newValue: false,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "And slide them indepedently",
      targetId: `containerFor-${demoPattern.currentState.items.data.layers.data[0].inputs.shadowLength.inputId}`,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        0,
        "inputs",
        "shadowLength",
        "inputs",
        "xShadowLength",
      ],
      key: "value",
      newValue: -10,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        0,
        "inputs",
        "shadowLength",
        "inputs",
        "yShadowLength",
      ],
      key: "value",
      newValue: 45,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Blur it out",
      targetId: `labelFor-${demoPattern.currentState.items.data.layers.data[0].inputs.blurRadius.inputId}`,
    },
    {
      path: ["items", "data", "layers", "data", 0, "inputs", "blurRadius"],
      key: "value",
      newValue: 15,
    }
  )
  .addStep({
    alignment: "right",
    text: "Match the text's color",
    targetId: `labelFor-${demoPattern.currentState.items.data.layers.data[0].inputs.shadowColor.toggleOption.inputId}`,
  })
  .addStep(
    {
      alignment: "right",
      text: "...Or choose your own!",
      targetId: `labelFor-${demoPattern.currentState.items.data.layers.data[0].inputs.shadowColor.inputId}`,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        0,
        "inputs",
        "shadowColor",
        "toggleOption",
      ],
      key: "value",
      newValue: false,
    },
    {
      path: ["items", "data", "layers", "data", 0, "inputs", "shadowColor"],
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
      path: ["items", "data", "layers"],
      key: "data",
      newValue: [
        ...demoPattern.currentState.items.data.layers.data,
        createShadow(),
      ],
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Set it as you like",
      targetId: demoPattern.currentState.items.data.layers.data[1].id,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        1,
        "inputs",
        "shadowLength",
        "inputs",
        "xShadowLength",
      ],
      key: "value",
      newValue: 5,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        1,
        "inputs",
        "shadowLength",
        "inputs",
        "yShadowLength",
      ],
      key: "value",
      newValue: 5,
    },
    {
      path: ["items", "data", "layers", "data", 1, "inputs", "blurRadius"],
      key: "value",
      newValue: 10,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Highlight the active layer",
      targetId: `labelFor-${demoPattern.currentState.items.data.layers.data[1].controls.highlight.id}`,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        1,
        "controls",
        "highlight",
        "config",
      ],
      key: "value",
      newValue: true,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Toggle the layer's visibility",
      targetId: `labelFor-${demoPattern.currentState.items.data.layers.data[1].controls.enable.id}`,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        1,
        "controls",
        "enable",
        "config",
      ],
      key: "value",
      newValue: false,
    },
    {
      path: [
        "items",
        "data",
        "layers",
        "data",
        1,
        "controls",
        "highlight",
        "config",
      ],
      key: "value",
      newValue: false,
    }
  )
  .addStep({
    alignment: "right",
    text: "Or remove it completely",
    targetId: `labelFor-${demoPattern.currentState.items.data.layers.data[1].controls.trashcan.id}`,
  })
  .addStep(
    {
      alignment: "left",
      text: "Check the result live",
      targetId: demoPattern.currentState.text.id,
    },
    {
      path: ["items"],
      key: "isOpen",
      newValue: false,
    }
  )
  .addStep(
    {
      alignment: "right",
      text: "Copy the CSS code",
      targetId: demoPattern.currentState.items.data.output.id,
    },
    {
      path: ["items"],
      key: "isOpen",
      newValue: true,
    },
    {
      path: ["items", "data", "layers"],
      key: "isOpen",
      newValue: false,
    },
    {
      path: ["items", "data", "output"],
      key: "isOpen",
      newValue: true,
    }
  );

export default demoPattern.steps;
