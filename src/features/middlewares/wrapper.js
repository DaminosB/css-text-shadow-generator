import resolvePath from "@/utils/resolvePath";

import handleActions from "./handlers/handleActions";
import handleUpdateSettings from "./handlers/handleUpdateSettings";

const wrapper = (store) => (next) => (action) => {
  const result = next(action);

  const handler = resolvePath(handlers, action.type.split("/"));
  if (handler) handler(store, action.payload);

  return result;
};

export default wrapper;

const handlers = {
  workflow: {
    updateSettings: handleUpdateSettings,
    revertSettings: handleActions,
    replaceSettings: handleActions,
    updateCollection: handleActions,
  },
};
