import { configureStore } from "@reduxjs/toolkit";

import textSettingsReducer from "./textSettings/textSettingsSlice";

export const store = configureStore({
  reducer: {
    textSettings: textSettingsReducer,
  },
});
