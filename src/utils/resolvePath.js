const resolvePath = (root, path) =>
  path.reduce((acc, entry) => acc[entry], root);

export default resolvePath;
