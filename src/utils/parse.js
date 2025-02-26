const parse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export default parse;
