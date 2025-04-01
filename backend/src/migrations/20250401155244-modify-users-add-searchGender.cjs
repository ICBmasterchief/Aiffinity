"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE Users 
      SET gender = 'hombre' 
      WHERE gender NOT IN ('hombre', 'mujer') OR gender IS NULL
    `);

    await queryInterface.changeColumn("Users", "gender", {
      type: Sequelize.ENUM("hombre", "mujer"),
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "searchGender", {
      type: Sequelize.ENUM("hombres", "mujeres", "ambos"),
      allowNull: false,
      defaultValue: "ambos",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "searchGender");

    await queryInterface.changeColumn("Users", "gender", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
