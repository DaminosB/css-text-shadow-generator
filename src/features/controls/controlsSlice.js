import { createSlice } from "@reduxjs/toolkit";

import createInitialState from "@/config/builders/createInitialState";
import createShadowsOutput from "@/utils/createShadowsOutput";

const initialState = createInitialState();

const controlsSlice = createSlice({
  name: "textSettings",
  initialState,
  reducers: {
    replaceState: (state, action) => action.payload,

    updateState: (state, action) => {
      const { path, key, value } = action.payload;

      const target = path.reduce((acc, entry) => acc[entry], state);
      target[key] = value;

      const shouldUpdateOutput = path[2] === "layers";

      if (shouldUpdateOutput) {
        const highlightedShadow = state.items.data.layers.data.find(
          (layer) => layer.controls.highlight.config.value
        );

        const filteredShadows = highlightedShadow
          ? [highlightedShadow]
          : state.items.data.layers.data.filter(
              (layer) => layer.controls.enable.config.value
            );

        state.items.data.output.data = createShadowsOutput(filteredShadows);
      }
    },
  },
});

export const { replaceState, updateState } = controlsSlice.actions;

export default controlsSlice.reducer;
