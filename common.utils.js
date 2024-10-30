const parseExtraFields = (obj) => {
  const keys = Object.keys(obj).filter((key) => key.startsWith("extra_"));
  const extras = keys.reduce((acc, key) => {
    const newKey = key.replace("extra_", "");
    acc[newKey] = obj[key];
    return acc;
  }, {});

  return extras || null;
};

module.exports = {
  parseExtraFields,
};
