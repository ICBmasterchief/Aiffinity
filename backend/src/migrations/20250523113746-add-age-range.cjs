"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "searchMinAge", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 18,
    });
    await queryInterface.addColumn("Users", "searchMaxAge", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 99,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "searchMinAge");
    await queryInterface.removeColumn("Users", "searchMaxAge");
  },
};
