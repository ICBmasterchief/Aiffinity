"use strict";
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];
    const totalUsers = 50;
    const fixedPassword = "patata";
    const hashedPassword = bcrypt.hashSync(fixedPassword, 12);

    for (let i = 0; i < totalUsers; i++) {
      const gender = faker.helpers.arrayElement(["hombre", "mujer"]);
      const firstName = faker.person.firstName(
        gender === "hombre" ? "male" : "female"
      );
      const lastName = faker.person.lastName();

      const searchGender = faker.helpers.arrayElement([
        "hombres",
        "mujeres",
        "ambos",
      ]);

      const randomNumber = faker.number.int({ min: 0, max: 99 });
      const photoUrl =
        gender === "hombre"
          ? `https://randomuser.me/api/portraits/men/${randomNumber}.jpg`
          : `https://randomuser.me/api/portraits/women/${randomNumber}.jpg`;

      const email = `${firstName.toLowerCase()}@${lastName.toLowerCase()}.com`;

      users.push({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        age: faker.number.int({ min: 18, max: 65 }),
        gender,
        searchGender,
        photoUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
