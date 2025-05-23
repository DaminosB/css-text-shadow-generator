import createShadow from "@/config/builders/createShadow";
import DemoPattern from "@/config/models/DemoPattern";

import { iconsList } from "../../assets/icons/iconsLibrary";

import typing from "@/assets/images/typing.gif";
import copy from "@/assets/images/copy.gif";
import fontSize from "@/assets/images/fontSize.gif";
import backgroundColor from "@/assets/images/backgroundColor.gif";
import fontColor from "@/assets/images/fontColor.gif";
import fontChange from "@/assets/images/fontChange.gif";
import shadowLength from "@/assets/images/shadowLength.gif";
import link from "@/assets/images/link.gif";
import unlink from "@/assets/images/unlink.gif";
import shadowLengthInd from "@/assets/images/shadowLengthInd.gif";
import blur from "@/assets/images/blur.gif";
import matchColor from "@/assets/images/matchColor.gif";
import unmatchColor from "@/assets/images/unmatchColor.gif";
import addLayer from "@/assets/images/addLayer.gif";
import settings from "@/assets/images/settings.gif";
import highlight from "@/assets/images/highlight.gif";
import hide from "@/assets/images/hide.gif";
import trashcan from "@/assets/images/trashcan.gif";
import check from "@/assets/images/check.gif";

const createDemoPattern = (initialState) => {
  const demoPattern = new DemoPattern(initialState.data.settings);

  const shortcut = (segment) => demoPattern.currentState[segment];

  return demoPattern
    .addStep(
      {
        img: typing,
        alignment: "left",
        title: "Type something cool",
        desc: "Start by typing your text in the textarea.",
        icon: iconsList.Keyboard,
        target: {
          id: shortcut("generalSettings").data.inputs.userText.inputId,
        },
      },
      {
        path: ["generalSettings", "data", "inputs", "userText"],
        key: "value",
        newValue: "Something cool",
      }
    )
    .addStep(
      {
        img: fontSize,
        alignment: "right",
        title: "Make the text bigger",
        desc: "Choose a font size that fits your design needs.",
        icon: iconsList.PencilRuler,
        target: {
          id: `labelFor-${
            shortcut("generalSettings").data.inputs.fontSize.inputId
          }`,
          category: "generalSettings",
        },
      },
      {
        path: ["generalSettings", "data", "inputs", "fontSize"],
        key: "value",
        newValue: 100,
      }
    )
    .addStep(
      {
        img: backgroundColor,
        alignment: "right",
        title: "Pick a background color",
        desc: "Pick a background color to contrast with your text.",
        icon: iconsList.PaintRoller,
        target: {
          id: `labelFor-${
            shortcut("generalSettings").data.inputs.backgroundColor.inputId
          }`,
          category: "generalSettings",
        },
      },
      {
        path: ["generalSettings", "data", "inputs", "backgroundColor"],
        key: "value",
        newValue: "#5F67A9",
      }
    )
    .addStep(
      {
        img: fontColor,
        alignment: "right",
        title: "Make your text stand out",
        desc: "Select a color for your text that matches your style.",
        icon: iconsList.PaintBrush,
        target: {
          id: `labelFor-${
            shortcut("generalSettings").data.inputs.textColor.inputId
          }`,
          category: "generalSettings",
        },
      },
      {
        path: ["generalSettings", "data", "inputs", "textColor"],
        key: "value",
        newValue: "#EAEAE5",
      }
    )
    .addStep(
      {
        img: fontChange,
        alignment: "right",
        title: "Choose a fresh font",
        desc: "Browse and pick from a wide range of font families.",
        icon: iconsList.TextAa,
        target: {
          id: `labelFor-${
            shortcut("generalSettings").data.inputs.textFont.inputId
          }`,
          category: "generalSettings",
        },
      },
      {
        path: ["generalSettings", "data", "inputs", "textFont"],
        key: "value",
        newValue: "comfortaa",
      }
    )
    .addStep({
      img: link,
      alignment: "right",
      title: "Link the shadow offsets",
      desc: "By default, the shadow's X and Y offsets are linked together.",
      icon: iconsList.LinkSimple,
      target: {
        id: shortcut("layers").data[0].inputs.shadowLength.link.inputId,
        category: "layers",
        index: 0,
      },
    })
    .addStep(
      {
        img: shadowLength,
        alignment: "right",
        title: "And slide them together",
        desc: "When linked, shadows move diagonally, keeping symmetry.",
        icon: iconsList.VectorTwo,
        target: {
          id: `containerFor-${
            shortcut("layers").data[0].inputs.shadowLength.inputId
          }`,
          category: "layers",
          index: 0,
        },
      },
      {
        path: [
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
        img: unlink,
        alignment: "right",
        title: "Or unlink the shadow offsets",
        desc: "Click the link icon to toggle between linked and free movement.",
        icon: iconsList.LinkBreak,
        target: {
          id: shortcut("layers").data[0].inputs.shadowLength.link.inputId,
          category: "layers",
          index: 0,
        },
      },
      {
        path: ["layers", "data", 0, "inputs", "shadowLength", "link"],
        key: "value",
        newValue: false,
      }
    )
    .addStep(
      {
        img: shadowLengthInd,
        alignment: "right",
        title: "Move X and Y separately",
        desc: "Now you can move the shadow freely on both axes, independently.",
        icon: iconsList.ArrowElbowRight,
        target: {
          id: `containerFor-${
            shortcut("layers").data[0].inputs.shadowLength.inputId
          }`,
          category: "layers",
          index: 0,
        },
      },
      {
        path: [
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
        img: blur,
        alignment: "right",
        title: "Blur it out",
        desc: "Adjust the blur radius. Higher values give a softer, more diffused shadow.",
        icon: iconsList.CircleDashed,
        target: {
          id: `labelFor-${
            shortcut("layers").data[0].inputs.blurRadius.inputId
          }`,
          category: "layers",
          index: 0,
        },
      },
      {
        path: ["layers", "data", 0, "inputs", "blurRadius"],

        key: "value",
        newValue: 15,
      }
    )
    .addStep({
      img: matchColor,
      alignment: "right",
      title: "Match the text's color",
      desc: "By default, the shadow uses the same color as your text.",
      icon: iconsList.EyedropperSample,
      target: {
        id: `labelFor-${
          shortcut("layers").data[0].inputs.shadowColor.toggleOption.inputId
        }`,
        category: "layers",
        index: 0,
      },
    })
    .addStep(
      {
        img: unmatchColor,
        alignment: "right",
        title: "...Or choose your own!",
        desc: "Check the box to choose a custom color for your shadow.",
        icon: iconsList.Eyedropper,
        target: {
          id: `labelFor-${
            shortcut("layers").data[0].inputs.shadowColor.inputId
          }`,
          category: "layers",
          index: 0,
        },
      },
      {
        path: ["layers", "data", 0, "inputs", "shadowColor", "toggleOption"],
        key: "value",
        newValue: false,
      },
      {
        path: ["layers", "data", 0, "inputs", "shadowColor"],

        key: "value",
        newValue: "#E0DC4F",
      }
    )
    .addStep(
      {
        img: addLayer,
        alignment: "right",
        title: "Add a new layer",
        desc: "Add as many shadow layers as you like to create complex effects.",
        icon: iconsList.StackPlus,
        target: {
          id: initialState.controls.sidebar.buttons.append.id,
          category: "layers",
          index: 1,
        },
      },
      {
        path: ["layers"],

        key: "data",
        newValue: [...shortcut("layers").data, createShadow()],
      }
    )
    .addStep(
      {
        img: settings,
        alignment: "right",
        title: "Set it as you like",
        desc: "Tweak each input to fine-tune your design exactly how you want it.",
        icon: iconsList.SlidersHorizontal,
        target: {
          id: shortcut("layers").data[1].id,
          category: "layers",
          index: 1,
        },
      },
      {
        path: [
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
        path: ["layers", "data", 1, "inputs", "blurRadius"],

        key: "value",
        newValue: 10,
      }
    )
    .addStep(
      {
        img: highlight,
        alignment: "right",
        title: "Highlight the active layer",
        desc: "Hover over this button to temporarily isolate and preview this shadow layer.",
        icon: iconsList.Highlighter,
        target: {
          id: `labelFor-${shortcut("layers").data[1].buttons.highlight.id}`,
          category: "layers",
          index: 1,
        },
      },
      {
        path: ["layers", "data", 1, "buttons", "highlight", "config"],
        key: "value",
        newValue: true,
      }
    )
    .addStep(
      {
        img: hide,
        alignment: "right",
        title: "Toggle the layer's visibility",
        desc: "If you're unsure about a layer, disable it without deleting it.",
        icon: iconsList.Eye,
        target: {
          id: `labelFor-${shortcut("layers").data[1].buttons.enable.id}`,
          category: "layers",
          index: 1,
        },
      },
      {
        path: ["layers", "data", 1, "buttons", "enable", "config"],
        key: "value",
        newValue: false,
      },
      {
        path: ["layers", "data", 1, "buttons", "highlight", "config"],
        key: "value",
        newValue: false,
      }
    )
    .addStep({
      img: trashcan,
      alignment: "right",
      title: "Or remove it completely",
      desc: "You can reorder layers or remove them completely as needed.",
      icon: iconsList.Trash,
      target: {
        id: `labelFor-${shortcut("layers").data[1].buttons.trashcan.id}`,
        category: "layers",
        index: 1,
      },
    })
    .addStep({
      img: check,
      alignment: "left",
      title: "Check the result live",
      desc: "Preview your result live to see how your settings affect the final look.",
      icon: iconsList.CheckCircle,
      target: {
        id: shortcut("generalSettings").data.inputs.userText.inputId,
        category: "generalSettings",
      },
    })
    .addStep({
      img: copy,
      alignment: "right",
      title: "Copy the CSS code",
      desc: "Once you're happy, copy the generated code or paste your own to reverse-engineer the effect.",
      icon: iconsList.Code,
      target: { id: initialState.output.id, category: "output" },
    }).steps;
};

export default createDemoPattern;
