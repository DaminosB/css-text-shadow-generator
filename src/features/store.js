import { configureStore } from "@reduxjs/toolkit";

import workflowReducer from "./workflow/workflowSlice";
import wrapper from "./middlewares/wrapper";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wrapper),
});
