'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: 'Good. Could be better.',
        stars: 3,
      },
      {
        spotId: 2,
        userId: 1,
        review: 'We totally enjoyed our stay.',
        stars: 4,
      },
      {
        spotId: 3,
        userId: 2,
        review: 'An awesome spot.',
        stars: 5,
      },
      {
        spotId: 1,
        userId: 3,
        review: 'A nice one',
        stars: 4,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
