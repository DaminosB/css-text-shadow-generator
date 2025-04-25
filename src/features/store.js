import { configureStore } from "@reduxjs/toolkit";

import controlsReducer from "./controls/controlsSlice";

export const store = configureStore({
  reducer: {
    controls: controlsReducer,
  },
});
