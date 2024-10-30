const { Ajv } = require("ajv");
const allFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
allFormats(ajv);
require("ajv-errors")(ajv);

module.exports = ajv;
