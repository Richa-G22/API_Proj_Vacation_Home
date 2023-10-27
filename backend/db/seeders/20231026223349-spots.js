'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate ([
    {
      "ownerId": 1,
      "address": "123 Disney Lane",
      "city": "San Francisco",
      "state": "California",
      "country": "United States of America",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "App Academy",
      "description": "Place where web developers are created",
      "price": 123,
    },
    {
      "ownerId": 2,
      "address": "Green Hollow Lane",
      "city": "Edison",
      "state": "New Jersey",
      "country": "United States of America",
      "lat": 57.7645358,
      "lng": -100.4730327,
      "name": "Edison Tower",
      "description": "Place where Edison invented bulb",
      "price": 456,
    },
    {
      "ownerId": 3,
      "address": "Sugar Hill Lane",
      "city": "Alphretta",
      "state": "Georgia",
      "country": "United States of America",
      "lat": 20.7645358,
      "lng": -32.4730327,
      "name": "Coke Factory",
      "description": "Place where soda is manufactured",
      "price": 789,
    }
  ], { validate: true });
},

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
