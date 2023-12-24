'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        firstName: 'Demo',
        lastName: 'User',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        firstName: 'Fake1',
        lastName: 'User1',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user2@user.io',
        firstName: 'Fake2',
        lastName: 'User2',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user3@user.io',
        firstName: 'Fake3',
        lastName: 'User3',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user4@user.io',
        firstName: 'Fake4',
        lastName: 'User4',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4'] }
    }, {});
  }
};