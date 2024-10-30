const { hash, compare } = require("bcrypt");

const hashPassword = async (password) => {
  return await hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
