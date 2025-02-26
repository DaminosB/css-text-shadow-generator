import { createSlice, nanoid } from "@reduxjs/toolkit";

import TextConfig from "@/config/classes/TextConfig";
import ShadowConfig from "@/config/classes/ShadowConfig";

const initialState = {
  textConfig: TextConfig.createConfig(),
  shadows: [ShadowConfig.createShadow("initial-shadow")],
};

const textSettingsSlice = createSlice({
  name: "textSettings",
  initialState,
  reducers: {
    replaceState: (state, action) => {
      return action.payload;
    },
    updateRootSettings: (state, action) => {
      const { key, value } = action.payload;
      state.textConfig[key].value = value;
    },
    addShadow: (state, action) => {
      state.shadows = [...state.shadows, ShadowConfig.createShadow(nanoid())];
    },
    updateShadow: (state, action) => {
      const { id, key, value } = action.payload;
      state.shadows.find((shadow) => shadow.id === id).inputs[key].value =
        value;
    },
    removeShadow: (state, action) => {
      if (state.shadows.length > 1) {
        state.shadows = state.shadows.filter(
          (shadow) => shadow.id !== action.payload
        );
      }
    },
  },
});

export const {
  replaceState,
  updateRootSettings,
  addShadow,
  updateShadow,
  removeShadow,
} = textSettingsSlice.actions;

export default textSettingsSlice.reducer;
