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
      "name": "Plum House",
      "description": "Lorem ipsum dolor sit amet.",
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
      "name": "Cherry Hill Villa",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 289,
    },
    {
      "ownerId": 3,
      "address": "New Dover Lane",
      "city": "Alphretta",
      "state": "Georgia",
      "country": "United States of America",
      "lat": 20.7645358,
      "lng": -32.4730327,
      "name": "Sunbeam Manor",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 175,
    },
    {
      "ownerId": 1,
      "address": "Maple Tree Lane",
      "city": "San Jose",
      "state": "California",
      "country": "United States of America",
      "lat": 57.7645358,
      "lng": -100.4730327,
      "name": "Maple House",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 100,
    },
    {
      "ownerId": 2,
      "address": "Sugar Hill Lane",
      "city": "Concord",
      "state": "New Hampshire",
      "country": "United States of America",
      "lat": 57.7645358,
      "lng": -100.4730327,
      "name": "Sugar Hill Villa",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 250,
    },
    {
      "ownerId": 4,
      "address": "Aspen Lane",
      "city": "Aspen City",
      "state": "Colorado",
      "country": "United States of America",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Aspen House",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 123,
    },
    {
      "ownerId": 4,
      "address": "Mountain Dr",
      "city": "Mountain City",
      "state": "Arizona",
      "country": "United States of America",
      "lat": 57.7645358,
      "lng": -100.4730327,
      "name": "Mountain Villa",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 289,
    },
    {
      "ownerId": 5,
      "address": "Peach Lane",
      "city": "Peach City",
      "state": "Michigan",
      "country": "United States of America",
      "lat": 20.7645358,
      "lng": -32.4730327,
      "name": "Sunbeam Manor",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 175,
    },
    {
      "ownerId": 2,
      "address": "Maple Tree Lane",
      "city": "San Jose",
      "state": "California",
      "country": "United States of America",
      "lat": 57.7645358,
      "lng": -100.4730327,
      "name": "Maple House",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 100,
    },
    {
      "ownerId": 1,
      "address": "River Lane",
      "city": "Concord",
      "state": "Maine",
      "country": "United States of America",
      "lat": 57.7645358,
      "lng": -100.4730327,
      "name": "Sugar Hill Villa",
      "description": "Lorem ipsum dolor sit amet.",
      "price": 250,
    },
  ], { validate: true });
},

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }, {});
  }
};
