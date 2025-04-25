import createShadowsOutput from "@/utils/createShadowsOutput";

export default class DemoPattern {
  constructor(initialState) {
    this.currentState = initialState;
    this.steps = [];
  }

  /**
   * Adds a step to the Demo Pattern, applying multiple state updates.
   *
   * @param {Object} demoConfig - Configuration for the demo display.
   * @param {string} demoConfig.alignment - Alignment of the info box relative to the focused input.
   * @param {string} demoConfig.text - Text content to display.
   * @param {any} demoConfig.targetId - The ID of the DOM element to focus on.
   *
   * @param {...Object} actions - List of state update instructions.
   * @param {Array} actions[].path - Path to the target key in the state.
   * @param {string} actions[].key - Key to modify.
   * @param {any} actions[].newValue - New value to apply
   *
   * @throws {Error} If any required field in `demoConfig` is missing.
   * @returns {this} The current instance for method chaining.
   */
  addStep(demoConfig, ...actions) {
    const validateFields = (obj, requiredFields, errorMessage) => {
      const missingFields = requiredFields.filter(
        (field) => obj[field] == null
      );
      if (missingFields.length) {
        throw new Error(`${errorMessage}: ${missingFields.join(", ")}.`);
      }
    };

    validateFields(
      demoConfig,
      ["alignment", "text", "targetId"],
      `Missing required fields in demoConfig for step ${this.steps.length + 1}`
    );

    actions.forEach((action, index) => {
      validateFields(
        action,
        ["path", "key", "newValue"],
        `Missing required fields in action #${index + 1} for step ${
          this.steps.length + 1
        }`
      );

      const { path, key, newValue } = action;
      const target = path.reduce((acc, entry) => acc[entry], this.currentState);
      target[key] = newValue;

      const shouldUpdateOutput = path[2] === "layers";

      if (shouldUpdateOutput) {
        this.currentState.items.data.output.data = createShadowsOutput(
          this.currentState.items.data.layers.data
        );
      }
    });

    const step = { demoConfig, state: structuredClone(this.currentState) };
    this.steps.push(step);

    return this;
  }
}
