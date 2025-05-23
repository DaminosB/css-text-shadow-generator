export default class ButtonPattern {
  constructor(id) {
    this.buttons = {};
    this.rootIdString = `pattern-${id}`;
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
   * @param {string} config.icon - Default icon for the button.
   * @param {Object} [config.icons] - Icons for toggle states. If provided, overrides `config.icon`.
   * @param {string} config.icons.on - Icon displayed when the button's value is true.
   * @param {string} config.icons.off - Icon displayed when the button's value is false.
   * @param {string} config.trigger - Determines how the button is activated (either "hover" or "click").
   * @param {string} config.commit - Determines how the button is activated (either "hover" or "click").
   */
  addBoolean(name, config) {
    const { value, trigger, icon, icons, shouldCommit = false } = config;

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
      shouldCommit,
    };

    this._addButton(name, buttonData);

    return this;
  }

  /**
   * Adds an action button to the input list.
   *
   * @param {string} name - Unique identifier for the input.
   * @param {Object} config - Configuration object for the button.
   * @param {string} config.labelText - Label displayed on the button.
   * @param {string} config.icon - Default icon for the button.
   * @param {string} config.value - Action triggered by the button.
   */
  addAction(name, config) {
    if (!config.icon) {
      throw new Error("An icon must be provided");
    } else if (!config.value) {
      throw new Error("An action value must be provided");
    }

    const buttonData = {
      ...config,
      trigger: "click",
      name,
      type: "action",
    };

    this._addButton(name, buttonData);

    return this;
  }

  /**
   * Adds a link button to the input list.
   *
   * @param {string} name - Unique identifier for the input.
   * @param {Object} config - Configuration object for the button.
   * @param {string} config.labelText - Label displayed on the button.
   * @param {string} config.icon - Default icon for the button.
   * @param {string} config.value - The url of the link.
   */
  addLink(name, config) {
    if (!config.icon) {
      throw new Error("An icon must be provided");
    } else if (!config.value) {
      throw new Error("An action value must be provided");
    }

    const buttonData = {
      ...config,
      trigger: "click",
      name,
      type: "link",
    };

    this._addButton(name, buttonData);

    return this;
  }

  _addButton(name, config) {
    const target = this.buttons;

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
}
