'use strict';

const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://www.nytimes.com/wirecutter/reviews/best-instant-camera/',
      },
      {
        reviewId: 2,
        url: 'https://www.nytimes.com/wirecutter/reviews/best-coffee-maker/',
      },
      {
        reviewId: 3,
        url: 'https://www.nytimes.com/wirecutter/reviews/best-lego-sets-for-kids/',
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
