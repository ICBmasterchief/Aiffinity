"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn("Users", "photoUrl");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "photoUrl", {
      type: Sequelize.STRING,
    });
  },
};
