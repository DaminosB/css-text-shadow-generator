const interpolate = (template, values) =>
  template.replace(/{(.*?)}/g, (_, key) => values[key] ?? `{${key}}`);

export default interpolate;
