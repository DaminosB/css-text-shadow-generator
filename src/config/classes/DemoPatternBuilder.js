export default class DemoPatternBuilder {
  constructor(initialState) {
    this.initialState = structuredClone(initialState);
    this.steps = [];
  }

  addValueChangeStep(inputName, path, targetValue, demoConfig) {
    this.addStep({
      action: "value-change",
      inputName,
      path,
      targetValue,
      demoConfig,
    });
    return this;
  }

  addAppendValueStep(inputData, path, element, demoConfig) {
    this.addStep({
      action: "append-value",
      path,
      targetValue: element,
      inputData,
      demoConfig,
    });
    return this;
  }

  addRemoveValueStep(inputData, path, index, demoConfig) {
    this.addStep({
      action: "remove-value",
      path,
      targetValue: index,
      inputData,
      demoConfig,
    });
    return this;
  }

  addMultipleValueChangeStep(inputData, path, updates, demoConfig) {
    this.addStep({
      action: "multiple-value-change",
      path,
      updates,
      ...inputData,
      demoConfig,
    });
    return this;
  }

  addStep(step) {
    this.steps.push(step);
    return this;
  }

  build() {
    return this.steps.reduce((acc, step, stepIndex) => {
      const state = structuredClone(
        stepIndex === 0 ? this.initialState : acc[stepIndex - 1].state
      );

      let objectToUpdate = state;

      if (step.path) {
        step.path.forEach((key, keyIndex, pathArray) => {
          if (!objectToUpdate[key]) {
            const formattedPath = pathArray
              .map((pathKey) =>
                typeof pathKey === "number" ? `[${pathKey}]` : pathKey
              )
              .filter((_, pathKeyIndex) => pathKeyIndex < keyIndex)
              .join(".")
              .replace(/\.\[/g, "[");
            const formattedKey = typeof key === "number" ? `[${key}]` : key;

            throw new Error(
              `${formattedKey} is not found in ${formattedPath || "root"}`
            );
          } else {
            objectToUpdate = objectToUpdate[key];
          }
        });
      }

      switch (step.action) {
        case "value-change":
        case "multiple-value-change":
          const updates =
            step.action === "value-change"
              ? [{ inputName: step.inputName, targetValue: step.targetValue }]
              : step.updates;

          updates.forEach(({ inputName, targetValue }) => {
            if (objectToUpdate[inputName] === undefined)
              throw new Error(`${inputName} does not match any input name`);
            else objectToUpdate[inputName].value = targetValue;
          });

          break;

        case "append-value":
          objectToUpdate.push(step.targetValue);
          break;

        case "remove-value":
          objectToUpdate.splice(step.targetValue, 1);
          break;

        default:
          break;
      }

      step.inputData = {
        ...(step.inputName && structuredClone(objectToUpdate[step.inputName])),
        ...step.inputData,
      };

      acc.push({ ...step, state });
      return acc;
    }, []);
  }
}
