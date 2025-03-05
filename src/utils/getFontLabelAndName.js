const getFontLabelAndName = (fontFamily) => {
  const response = {
    fontName: fontFamily.split(",")[0].replaceAll("'", "").trim(),
    get fontLabel() {
      return this.fontName
        .toLowerCase()
        .split(" ")
        .map((word, i) =>
          i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");
    },
  };

  return {
    fontName: fontFamily.split(",")[0].replaceAll("'", "").trim(),
    get fontLabel() {
      return this.fontName
        .toLowerCase()
        .split(" ")
        .map((word, i) =>
          i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");
    },
  };
};

export default getFontLabelAndName;
