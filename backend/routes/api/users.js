const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('firstName')
      .not()
      .isEmpty()
      .withMessage('First Name is required'),
    check('lastName')
      .not()
      .isEmpty()
      .withMessage('Last Name is required'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('email')
      .not()
      .isEmpty()
     // .withMessage('Email or username is required'),
     .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('username')
      .not()
      .isEmpty()
      .withMessage('Username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password is required.'),
    handleValidationErrors
  ];

router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
      const { email, firstName, lastName, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      //Added to check if email already exists 
      const emailExists = await User.findOne({ where: { email: email } });
      if ( emailExists ) {
        const err = new Error("User already exists");
        err.status = 500;
        err.errors = { email: 'User with that email already exists' };
        return next(err);
      };

      //Added to check if username already exists
      const userExists = await User.findOne({ where: { username: username } });
      if ( userExists ) {
        const err = new Error("User already exists");
        err.status = 500;
        err.errors = { username: 'User with that username already exists' };
        return next(err);
      };
      //

      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;