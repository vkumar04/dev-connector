const gravatar = require('gravatar');
const passport = require('../../config/passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const keys = require('../../config/keys');
const router = express.Router();

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test @desc    Tests users route @access  Public
router.get('/test', (req, res) => res.json({msg: "Users Works"}))

// @route   GET api/users/register @desc    Register User @access  Public
router.post('/register', (req, res) => {
  User
    .findOne({email: req.body.email})
    .then(user => {
      if (user) {} else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });

        const newUser = new User({name: req.body.name, email: req.body.email, avatar, password: req.body.password});

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) 
              throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route   GET api/users/login @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password;

  // Find user by email
  User
    .findOne({email})
    .then(user => {
      // Check for user
      if (!user) {
        return res
          .status(404)
          .json({email: "User does not exist"});
      }
      // Check password
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            } //Create JWT Payload
            // Sign token
            jwt.sign(payload, keys.secretOrKey, {
              expiresIn: 3600
            }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            });
          } else {
            res
              .status(400)
              .json({password: 'Password incorrect'});
          }
        })
    })
})

// @route   GET api/users/current @desc    Return current user @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({msg: 'success'})
})

module.exports = router;