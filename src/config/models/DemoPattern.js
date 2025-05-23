import resolvePath from "@/utils/resolvePath";

export default class DemoPattern {
  constructor(initialState) {
    this.currentState = structuredClone(initialState);
    this.steps = [];
  }

  /**
   * Adds a step to the Demo Pattern, applying multiple state updates.
   *
   * @param {Object} demoConfig - Configuration for the demo display.
   * @param {string} demoConfig.alignment - Alignment of the info box relative to the focused input.
   * @param {string} demoConfig.text - Text content to display.
   *
   * @param {Object} demoConfig.target - Metadata about the DOM element that should be focused.
   * @param {string} demoConfig.target.id - The ID of the DOM element to highlight or scroll to.
   * @param {"output" | "generalSettings" | "layers"} [demoConfig.target.category] - The category of the element within the UI workflow.
   * @param {number} [demoConfig.target.index] - The index of the element if it's part of a list (e.g., layer index).
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
      ["alignment", "title", "desc", "target"],
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
      const target = resolvePath(this.currentState, path);
      target[key] = newValue;
    });

    const step = {
      id: `step-${this.steps.length}`,
      demoConfig,
      state: structuredClone(this.currentState),
    };
    this.steps.push(step);

    return this;
  }
}
