import setOutput from "../actions/setOutput";

const handleUpdateSettings = (store, payload) => {
  if (payload.path[2] === "layers") setOutput(store);
};

export default handleUpdateSettings;
