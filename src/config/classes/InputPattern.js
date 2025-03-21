export default class InputPatternBuilder {
  constructor(id) {
    this.data = {
      id: id ?? crypto.randomUUID(),
      inputs: {},
      controls: {},
    };
    this.rootIdString = `pattern-${this.data.id}`;
  }

  /**
   * Adds a boolean toggle button to the input list.
   *
   * @param {string} name - Unique identifier for the input.
   * @param {Object} config - Configuration object for the button.
   * @param {string} config.labelText - Label displayed on the button.
   * @param {Object} [config.labelTexts] - Labels for toggle states. If provided, overrides `config.labelText`.
   * @param {string} config.labelTexts.on - label displayed when the button's value is true.
   * @param {string} config.labelTexts.off - label displayed when the button's value is false.
   * @param {Boolean} config.value - The initial value of the button.
   * @param {any} config.icon - Default icon for the button.
   * @param {Object} [config.icons] - Icons for toggle states. If provided, overrides `config.icon`.
   * @param {any} config.icons.on - Icon displayed when the button's value is true.
   * @param {any} config.icons.off - Icon displayed when the button's value is false.
   * @param {string} config.trigger - Determines how the button is activated (either "hover" or "click").
   */
  addBoolean(name, config) {
    const { value, trigger, icon, icons } = config;

    if (!icon && (!icons.on || !icons.off)) {
      throw new Error(
        "If no default icon is set, both 'on' and 'off' icons must be provided"
      );
    } else if (trigger !== "hover" && trigger !== "click") {
      throw new Error(
        `'config.trigger' must be either 'hover' or 'click', but received ${
          trigger ?? "empty"
        }.`
      );
    }

    const buttonData = {
      ...config,
      type: "boolean",
      value: value ?? false,
      name,
    };

    this._addControl(name, buttonData);

    return this;
  }

  /**
   * Adds a boolean toggle button to the input list.
   *
   * @param {string} name - Unique identifier for the input.
   * @param {Object} config - Configuration object for the button.
   * @param {string} config.labelText - Label displayed on the button.
   * @param {any} config.icon - Default icon for the button.
   */
  addAction(name, config) {
    if (!config.icon) {
      throw new Error("An icon must be provided");
    }

    const buttonData = {
      ...config,
      name,
      type: "action",
    };

    this._addControl(name, buttonData);

    return this;
  }

  _addControl(name, config) {
    let target = this.data.controls;

    if (!name) {
      throw new Error("A name must be provided");
    } else if (target[name]) {
      throw new Error(`A button named ${name} already exists`);
    } else {
      target[name] = {
        id: `${this.rootIdString}_button_${name}`,
        config: {
          ...config,
          name,
        },
      };
    }
  }

  /**
   * Adds a text input to the input list.
   *
   * @param {string} name - Unique name of the input.
   * @param {string} value - Default value of the input.
   * @param {string} group - (Optional) Specifies the group for the new input if provided.
   */
  addTextInput(name, value, group) {
    const inputData = { value, name, type: "text" };
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
   * @param {any} config.icon - Icon associated with the input.
   * @param {Array} config.list - The list of items to display.
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
   * @param {any} config.icon - Icon associated with the input.
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
   * @param {any} config.icon - Icon associated with the input.
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
   * @param {any} parameters.icons.active - The icon displayed when the input is active.
   * @param {any} parameters.icons.inactive - The icon displayed when the input is inactive.
   */
  setToggleOption(inputName, parameters) {
    if (!this.data.inputs[inputName])
      throw new Error(`No input named ${inputName} was found`);

    const idString = this.data.inputs[inputName].inputId;

    this.data.inputs[inputName].toggleOption = {
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
   * @param {any} config.icon - Icon associated with the group.
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
    let target = this.data.inputs;
    let idString = this.rootIdString;

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
        inputId: `${idString}_input-${config.name}`,
        inputContainerId: `${idString}_container-${config.name}`,
        value: config.value ?? config.defaultValue,
      };
    }
  }
}
