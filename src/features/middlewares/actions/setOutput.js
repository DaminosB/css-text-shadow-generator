import { updateOutput } from "@/features/workflow/workflowSlice";

const setOutput = (store) => {
  store.dispatch(updateOutput());
};

export default setOutput;
