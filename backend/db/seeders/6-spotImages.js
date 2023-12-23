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
        url: 'https://media.istockphoto.com/id/479767332/photo/idyllic-home-with-covered-porch.webp?b=1&s=170667a&w=0&k=20&c=8WsZVz6uBs31BhBJ0xzTFgbBixVyG0biRGftge7nfe4=',
        preview: true,
      },
    /*  {
        spotId: 1,
        url: 'https://www.pexels.com/photo/house-beside-trees-and-castle-1831545/',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://www.pexels.com/photo/house-beside-trees-and-castle-1831545/',
        preview: true,
      },*/
   /*   {
        spotId: 2,
        url: 'https://media.istockphoto.com/id/178988183/photo/house-in-bad-summer-thunderstorm.webp?b=1&s=170667a&w=0&k=20&c=GCKr4PR2gErNiBLYPnH75IbcHEl1PcCVbmoqRUfCAKs=',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://media.istockphoto.com/id/1269776313/photo/suburban-house.webp?b=1&s=170667a&w=0&k=20&c=US41XP4y05JtczMaJWEk1RE4gsrxGdOYEbIh2qr5lw4=',
        preview: true,
      },
      {
        spotId: 4,
        url: 'https://media.istockphoto.com/id/1026205392/photo/beautiful-luxury-home-exterior-at-twilight.webp?b=1&s=170667a&w=0&k=20&c=-PZY6ObjW0B-GN0Tgm6gaYKhwYP_KtAgSlGwsTzYUlQ=',
        preview: true,
      },
      {
        spotId: 5,
        url: 'https://media.istockphoto.com/id/1255835529/photo/modern-custom-suburban-home-exterior.webp?b=1&s=170667a&w=0&k=20&c=DB7ylL21zmnUqzO191HDQFVNasUcmOMDPXofCiHkz34=',
        preview: true,
      }*/
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
