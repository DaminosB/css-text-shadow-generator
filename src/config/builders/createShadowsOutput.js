const createShadowsOutput = (layers) =>
  layers
    .map((shadow) => {
      const { blurRadius, xShadowLength, yShadowLength, shadowColor } =
        Object.entries(shadow.inputs).reduce((acc, [inputName, config]) => {
          if (config.toggleOption?.value) {
            return { ...acc, [inputName]: null };
          } else if (config.type === "group") {
            return {
              ...acc,
              ...Object.entries(config.inputs).reduce(
                (subAcc, [subInputName, subConfig]) => ({
                  ...subAcc,
                  [subInputName]: {
                    value: subConfig.value,
                    format: subConfig.format,
                  },
                }),
                {}
              ),
            };
          } else {
            return {
              ...acc,
              [inputName]: { value: config.value, format: config.format },
            };
          }
        }, {});

      let string = "";
      if (blurRadius.value || xShadowLength.value || yShadowLength.value) {
        string += `${xShadowLength.value}${xShadowLength.format}`;
        string += ` ${yShadowLength.value}${yShadowLength.format}`;
        if (blurRadius.value)
          string += ` ${blurRadius.value}${blurRadius.format}`;
        if (shadowColor) string += ` ${shadowColor.value}`;
      }
      return { id: shadow.id, string };
    })
    .filter((output) => output.string);

export default createShadowsOutput;
