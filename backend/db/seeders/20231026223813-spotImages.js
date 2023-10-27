'use strict';

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://www.pexels.com/photo/house-beside-trees-and-castle-1831545/',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://www.pexels.com/photo/brown-and-gray-house-1850609/',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://www.pexels.com/photo/architecture-building-countryside-daylight-531234/',
        preview: true,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
