const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../utils/bcrypt.utils");

const getClient = () => {
  return new PrismaClient();
};

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = getClient();
} else {
  if (!global.prisma) {
    global.prisma = getClient();
  }
  prisma = global.prisma;
}

prisma.$use(async (params, next) => {
  if (params.model === "User") {
    if (params.action === "create" || params.action === "update") {
      if (params.args.data.password) {
        params.args.data.password = await hashPassword(
          params.args.data.password
        );
      }
    }
  }

  return next(params);
});

module.exports = prisma;
