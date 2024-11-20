const { createUser } = require("../models/user.model");
const prisma = require("./client");

const users = [
  {
    name: "John Doe",
    email: "john.doe@mail.com",
    password: "pass1234",
    address: "48 Allen Bridge Rd\nDixmont, Maine(ME), 04932",
  },
  {
    name: "Jane Doe",
    email: "jane.doe@mail.com",
    password: "pass1234",
    address: "760 Warwick Ave\nThousand Oaks, California(CA), 91360",
  },
];

const seed = async () => {
  const existingUsers = await prisma.user.count();
  if (existingUsers === 0) {
    for (let user of users) {
      await createUser(user);
    }
  }
};

seed()
  .then(() => console.info("Sedding complete."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
