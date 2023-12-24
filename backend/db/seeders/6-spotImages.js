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
        url: 'https://cdn.pixabay.com/photo/2012/09/21/17/51/house-57463_1280.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://cdn.pixabay.com/photo/2017/03/10/11/20/mill-2132494_1280.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://cdn.pixabay.com/photo/2013/10/09/02/27/lake-192990_1280.jpg',
        preview: true,
      },
      {
        spotId: 4,
        url: 'https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg',
        preview: true,
      },
      {
        spotId: 5,
        url: 'https://cdn.pixabay.com/photo/2022/12/21/09/39/winter-7669652_1280.jpg',
        preview: true,
      },
      {
        spotId: 6,
        url: 'https://cdn.pixabay.com/photo/2017/05/30/13/01/relax-2356858_1280.jpg',
        preview: true,
      },
      {
        spotId: 7,
        url: 'https://cdn.pixabay.com/photo/2021/12/11/11/48/nature-6862612_1280.jpg',
        preview: true,
      },
      {
        spotId: 8,
        url: 'https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271_1280.jpg',
        preview: true,
      },
      {
        spotId: 9,
        url: 'https://cdn.pixabay.com/photo/2016/08/28/16/43/stilt-house-1626354_1280.jpg',
        preview: true,
      },
      {
        spotId: 10,
        url: 'https://cdn.pixabay.com/photo/2020/10/13/13/28/ameland-5651866_1280.jpg',
        preview: true,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }, {});
  }
};
