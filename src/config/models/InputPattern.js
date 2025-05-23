export default class InputPattern {
  constructor(id) {
    this.inputs = {};
    this.rootIdString = `input-${this.id}`;
  }

  /**
   * Adds a text input to the input list.
   *
   * @param {string} name - Unique name of the input.
   * @param {Object} config - Configuration object for the numeric input.
   * @param {number} config.value - Default value of the input.
   * @param {string} group - (Optional) Specifies the group for the new input if provided.
   */
  addTextInput(name, config, group) {
    const inputData = { ...config, name, type: "text" };
    this._addInput(name, inputData, group);
    return this;
  }

  /**
   * Adds a select input to the input list.
   *
   * @param {string} name - Unique name of the input.
   * @param {Object} config - Configuration object for the numeric input.
   * @param {number} config.value - Default value of the input.
   * @param {string} config.labelText - Label displayed for the input.
   * @param {string} config.icon - Icon associated with the input.
   * @param {Array} config.list - The list of settings to display.
   * @param {string} group - (Optional) Specifies the group for the new input if provided.
   */
  addSelectInput(name, config, group) {
    const inputData = { ...config, name, type: "select" };
    this._addInput(name, inputData, group);
    return this;
  }

  /**
   * Adds a numeric input to the input list.
   *
   * @param {string} name - Unique name of the input.
   * @param {Object} config - Configuration object for the numeric input.
   * @param {number} config.value - Default value of the input.
   * @param {string} config.labelText - Label displayed for the input.
   * @param {string} config.icon - Icon associated with the input.
   * @param {[number, number]} config.range - Min and max range values.
   * @param {number} config.minValue - Minimum allowed value.
   * @param {number} config.maxValue - Maximum allowed value.
   * @param {string} config.format - Unit of measurement (e.g., "px").
   * @param {string} group - (Optional) Specifies the group for the new input if provided.
   */
  addNumericInput(name, config, group) {
    const inputData = { ...config, name, type: "number" };
    this._addInput(name, inputData, group);
    return this;
  }

  /**
   * Adds a color input to the input list.
   *
   * @param {string} name - Unique name of the input.
   * @param {Object} config - Configuration object for the numeric input.
   * @param {number} config.value - Default value of the input.
   * @param {string} config.labelText - Label displayed for the input.
   * @param {string} config.icon - Icon associated with the input.
   * @param {string} config.format - The format of the color (hexa, rgb, rgba).
   * @param {string} group - (Optional) Specifies the group for the new input if provided.
   */
  addColorInput(name, config, group) {
    const inputData = { ...config, name, type: "color" };
    this._addInput(name, inputData, group);
    return this;
  }

  /**
   * Sets an option to disable a given input.
   *
   * @param {string} inputName - The name of the input.
   * @param {Object} parameters - The parameters defining the toggle option.
   * @param {boolean} parameters.value - The initial state of the toggle option.
   * @param {string} parameters.labelText - The label displayed for the toggle option.
   * @param {Object} parameters.icons - Icons associated with the toggle option.
   * @param {string} parameters.icons.active - The icon displayed when the input is active.
   * @param {string} parameters.icons.inactive - The icon displayed when the input is inactive.
   */
  setToggleOption(inputName, parameters) {
    if (!this.inputs[inputName])
      throw new Error(`No input named ${inputName} was found`);

    const idString = this.inputs[inputName].inputId;

    this.inputs[inputName].toggleOption = {
      ...parameters,
      inputId: `${idString}_toggleOption_value`,
      inputContainerId: `${idString}_toggleOption_container`,
      name: "toggleOption",
    };
    return this;
  }

  /**
   * Sets a group of inputs and adds to the input list.
   *
   * @param {string} name - Unique name of the input.
   * @param {Object} config - Configuration object for the group input.
   * @param {string} config.link - Link between the children inputs enabled.
   * @param {string} config.labelText - Label displayed for the group.
   * @param {string} config.linkText - Label displayed next to the link button.
   * @param {string} config.icon - Icon associated with the group.
   */
  addInputsGroup(name, config, inputsType) {
    const groupData = {
      ...config,
      link: {
        value: config.link.initialState,
        inputId: `${this.rootIdString}_group-${name}_link_value`,
        inputContainerId: `${this.rootIdString}_group-${name}_link_container`,
        text: config.link.linkText,
      },
      name,
      inputsType,
      inputs: {},
      type: "group",
    };

    this._addInput(name, groupData);
    return this;
  }

  _addInput(name, config, group) {
    let target = this.inputs;
    let idString = `${this.rootIdString}_${config.name}`;

    if (group) {
      if (!target[group]) {
        throw new Error(`No group named ${group} was found`);
      } else if (target[group].inputsType !== config.type) {
        throw new Error(
          `The new input type (${config.type}) differs from the group's expected type (${target[group].inputsType})`
        );
      } else {
        idString += `_input-${target[group].name}_toggleOption`;
        target = target[group].inputs;
      }
    }

    if (target[name]) {
      throw new Error(
        `An input named ${name} already exists${group ? ` in ${group}` : ""}`
      );
    } else {
      target[name] = {
        ...config,
        name,
        inputId: `${idString}_input`,
        inputContainerId: `${idString}_container`,
        value: config.value ?? config.defaultValue,
      };
    }
  }
}
