"use strict";
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
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

      const email = `${firstName.toLowerCase()}@${lastName.toLowerCase()}.com`;

      const age = faker.number.int({ min: 18, max: 65 });

      const description = `Hola, me llamo ${firstName} ${lastName} y tengo ${age} años. Estoy aquí buscando ${
        searchGender == "ambos" ? "ambos géneros" : searchGender
      } :D`;

      users.push({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        age,
        gender,
        searchGender,
        description,
        searchMinAge: 18,
        searchMaxAge: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
