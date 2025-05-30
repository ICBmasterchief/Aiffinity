"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Users",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        age: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        gender: {
          type: Sequelize.ENUM("hombre", "mujer"),
          allowNull: true,
        },
        photoUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      { timestamps: true }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};
