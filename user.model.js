const prisma = require("../prisma/client");
const { createDefaultCategories } = require("../models/category.model");

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

const createUser = async (data) => {
  const user = await prisma.user.create({
    data: data,
  });

  await createDefaultCategories(user.id);

  return user;
};

const updateUser = async (user, data) => {
  const userData = {};

  if (data.name) {
    userData.name = data.name;
  }

  if (data.email && data.email !== user.email) {
    userData.email = data.email;
  }

  if (data.password) {
    userData.password = data.password;
  }

  if (data.address) {
    userData.address = data.address;
  }

  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: userData,
  });
};

const updateTabs = async (userId, data) => {
  const travel = data.travel ? true : false;
  const job = data.job ? true : false;
  const health = data.health ? true : false;
  const movies = data.movies ? true : false;
  const music = data.music ? true : false;

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      travel,
      job,
      health,
      movies,
      music,
      isFirstTime: false,
    },
  });
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  updateTabs,
};
