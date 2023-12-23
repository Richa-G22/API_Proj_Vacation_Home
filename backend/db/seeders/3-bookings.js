'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate ([
  /*  {
       userId: 1,
       spotId: 1,
       startDate: "2021-11-19",
       endDate: "2021-11-24"
    },
    {
      userId: 2,
      spotId: 2,
      startDate: "2022-10-18",
      endDate: "2022-10-25"
    },
    {
      userId: 3,
      spotId: 3,
      startDate: "2023-12-20",
      endDate: "2023-12-27" 
    }*/
  ], { validate: true });
},
  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
