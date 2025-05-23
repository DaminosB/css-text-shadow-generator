import { createSlice } from "@reduxjs/toolkit";

import { iconsList } from "@/assets/icons/iconsLibrary";

import ButtonPattern from "@/config/models/ButtonPattern";

import createShadow from "@/config/builders/createShadow";
import createTextConfig from "@/config/builders/createTextConfig";
import createDemoPattern from "@/config/builders/createDemoPattern";
import createShadowsOutput from "@/config/builders/createShadowsOutput";

import resolvePath from "@/utils/resolvePath";

const initialState = {
  data: {
    id: "first-commit",
    label: "First commit",
    commitData: {},
    settings: {
      generalSettings: {
        id: "generalSettings",
        label: "General settings",
        icon: iconsList.SlidersHorizontal,
        data: createTextConfig(),
      },
      layers: {
        id: "layers",
        label: "Shadow layers",
        icon: iconsList.Stack,
        data: [createShadow("layer-0")],
      },
    },
  },
  controls: {
    sidebar: {
      isOpen: false,
      isPinned: false,
      content: "generalSettings",
      buttons: new ButtonPattern("sidebar")
        .addAction("append", {
          labelText: "Add a layer",
          icon: iconsList.StackPlus,
          value: "addShadowAndScroll",
          trigger: "click",
        })
        .addAction("demo", {
          labelText: "Demo mode",
          icon: iconsList.Play,
          value: "openDemoMode",
          trigger: "click",
        })
        .addLink("learn", {
          labelText: "Learn",
          icon: iconsList.BookOpenUser,
          value: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow",
        })
        .addAction("about", {
          labelText: "About",
          icon: iconsList.DotsThree,
          value: "openModale",
        }).buttons,
    },
    history: { content: null },
    demo: {
      isOpen: false,
      cache: null,
      step: null,
      get content() {
        return createDemoPattern(initialState);
      },
      buttons: new ButtonPattern("sidebar")
        .addBoolean("dark", {
          icon: iconsList.Moon,
          icons: { on: iconsList.Sun, off: iconsList.Moon },
          value: false,
          trigger: "click",
        })
        .addAction("close", {
          icon: iconsList.X,
          value: "closeDemoMode",
          trigger: "click",
        }).buttons,
    },
  },
  get commits() {
    return [
      {
        ...this.data,
        commitData: {
          category: "generalSettings",
          targetIndex: 0,
          categoryIcon: iconsList.GitCommit,
        },
      },
    ];
  },
  output: {
    id: "output",
    label: "Output",
    icon: iconsList.Code,
    data: [],
    buttons: new ButtonPattern("output").addAction("copy", {
      icon: iconsList.Paperclip,
      value: "copyToClipboard",
      trigger: "click",
    }).buttons,
  },
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    updateControls: (state, action) => {
      const { target, key, value } = action.payload;
      state.controls[target][key] = value;
    },

    replaceSettings: (state, action) => {
      state.data.settings = action.payload;
    },

    updateSettings: (state, action) => {
      const { path, key, value } = action.payload;

      const target = resolvePath(state, path);
      target[key] = value;
    },

    updateCollection: (state, action) => {
      const { category, target, newIndex } = action.payload;

      const collection = state.data.settings[category].data;

      const indexOfTarget = collection.findIndex(
        (entry) => entry.id === target.id
      );

      if (indexOfTarget !== -1) {
        collection.splice(indexOfTarget, 1);
      }

      if (newIndex != null) {
        collection.splice(newIndex, 0, target);
      }
    },

    commitSettings: (state, action) => {
      const { category, targetIndex, changedIndex, label, inputIcon } =
        action.payload;

      const commitIndex = state.commits.findIndex(
        (commit) => commit.id === state.data.id
      );

      const categoryIcon = state.data.settings[category]?.icon ?? null;

      const newSettings = {
        ...state.data,
        id: crypto.randomUUID(),
        label,
        commitData: {
          category,
          changedIndex,
          targetIndex: targetIndex ?? changedIndex,
          inputIcon,
          categoryIcon,
        },
      };

      state.data = newSettings;

      state.commits = [...state.commits.slice(0, commitIndex + 1), newSettings];
    },

    revertSettings: (state, action) => {
      state.data = state.commits[action.payload];

      state.controls.sidebar.isOpen =
        state.data.commitData.inputLabel !== "userText" &&
        state.data.commitData.id !== "first-commit";

      state.controls.sidebar.content = state.data.commitData.category;
    },

    updateOutput: (state) => {
      const { data } = state;
      const highlightedShadow = data.settings.layers.data.find(
        (layer) => layer.buttons.highlight.config.value
      );

      const filteredShadows = highlightedShadow
        ? [highlightedShadow]
        : data.settings.layers.data.filter(
            (layer) => layer.buttons.enable.config.value
          );

      state.output.data = createShadowsOutput(filteredShadows);
    },
  },
});

export const {
  updateControls,
  replaceSettings,
  updateSettings,
  commitSettings,
  updateCollection,
  revertSettings,
  updateOutput,
} = workflowSlice.actions;

export default workflowSlice.reducer;
