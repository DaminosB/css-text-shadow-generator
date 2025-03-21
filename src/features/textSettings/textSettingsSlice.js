import { createSlice } from "@reduxjs/toolkit";

import createShadow from "@/config/builders/createShadow";
import createTextConfig from "@/config/builders/createTextConfig";

const initialState = {
  textConfig: createTextConfig(),
  shadows: [createShadow("initial-shadow")],
};

const textSettingsSlice = createSlice({
  name: "textSettings",
  initialState,
  reducers: {
    replaceState: (state, action) => action.payload,

    updateSetting: (state, action) => {
      const { path, key, value } = action.payload;
      const target = path.reduce((acc, entry) => acc[entry], state);
      target[key] = value;
    },

    addShadow: (state, action) => {
      const newShadow = createShadow();
      state.shadows = [...state.shadows, newShadow];
    },

    removeShadow: (state, action) => {
      if (state.shadows.length > 1) {
        state.shadows = state.shadows.filter(
          (shadow) => shadow.id !== action.payload
        );
      }
    },

    moveShadow: (state, action) => {
      const { id, newIndex } = action.payload;

      const shadowIndex = state.shadows.findIndex((shadow) => shadow.id === id);
      if (shadowIndex === -1) return;

      const [shadow] = state.shadows.splice(shadowIndex, 1);

      state.shadows.splice(newIndex, 0, shadow);
    },
  },
});

export const {
  replaceState,
  updateSetting,
  addShadow,
  removeShadow,
  moveShadow,
} = textSettingsSlice.actions;

export default textSettingsSlice.reducer;
