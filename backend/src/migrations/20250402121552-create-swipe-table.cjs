"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Swipes",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        targetUserId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        liked: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      { timestamps: true }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Swipes");
  },
};
