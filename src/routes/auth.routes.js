const express = require('express');
// const nodemailer = require('nodemailer');
const router = express.Router();
const { validate } = require('../services/utils');
const { check, validationResult } = require('express-validator');
const sgMail = require('@sendgrid/mail');
var generator = require('generate-password');
const bcrypt = require('bcryptjs');
sgMail.setApiKey(
  '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'
);

const CheckIns = require('../models/UsersCheckIns.models');
const User = require('../models/user.model');

const shops = [
  {
    shopName: 'Polar',
    instagram: 'Polarlounge',
    address: '16/F, Lockhart road 459',
    time: '2-10pm',
    logo: 'https://res.cloudinary.com/bkarshehbaz-com/image/upload/v1652789201/WhatsApp_Image_2022-05-16_at_5.48.58_PM_rj7eqr.jpg',
  },
  {
    shopName: 'Onfall',
    instagram: 'Onfallll',
    address: '8/F, Aura on Pennington, Causeway Bay',
    time: '5-10pm',
    logo: 'https://res.cloudinary.com/bkarshehbaz-com/image/upload/v1652789201/WhatsApp_Image_2022-05-16_at_5.48.24_PM_umaojs.jpg',
  },
  {
    shopName: '14:41',
    instagram: '1441.hk',
    address: 'G/F., 41 Peel Street, Central',
    time: '12-10pm',
    logo: 'https://res.cloudinary.com/bkarshehbaz-com/image/upload/v1652789201/WhatsApp_Image_2022-05-16_at_5.50.21_PM_mjxuou.jpg',
  },
  {
    shopName: 'Teddy Bear',
    instagram: 'Teddy.bear.hk',
    address: 'Cosmos Building (Unit 803), 8-11 Lan Kwai Fong, Central',
    time: '6-10pm',
    logo: 'https://res.cloudinary.com/bkarshehbaz-com/image/upload/v1652789201/WhatsApp_Image_2022-05-16_at_5.51.14_PM_i9xq3p.jpg',
  },

  {
    shopName: 'Dark Leaf Shisha',
    instagram: 'Darkleafhk',
    address: '726 Nathan Road ,Mong Kok',
    time: '12-10pm(tbc)',
    logo: 'https://res.cloudinary.com/bkarshehbaz-com/image/upload/v1652789201/WhatsApp_Image_2022-05-16_at_5.50.21_PM_mjxuou.jpg',
  },
];

const {
  validateRules,
  SignUp,
  Login,
} = require('../controllers/auth.controller');

router.post('/signup', validateRules('SignUp'), validate, SignUp);

router.post('/login', validateRules('Login'), validate, Login);

// @route    GET api/auth
// @desc     Re-Send User Password
// @access   Public
router.post(
  '/resendpassword',

  check('email', 'Please include a valid email').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User does't exist" }] });
      } else {
        //  create new password
        let password = await generator.generate({
          length: 10,
          numbers: true,
        });
        console.log('new password is ', password);
        let textpassword = password;
        const salt = await bcrypt.genSalt(10);

        password = await bcrypt.hash(password, salt);
        // store that password in that user's database

        let UpdatedUser = await User.findOneAndUpdate(
          { email: req.body.email },
          { password: password }
        );
        const msg = {
          to: req.body.email, // Change to your recipient
          from: 'bkarshehbaz@gmail.com', // Change to your verified sender
          subject: 'Password Reset',
          text: 'Here is your New Password',
          html: `<strong>Your New Password is: ${textpassword}</strong>`,
        };

        sgMail
          .send(msg)
          .then((response) => {
            return res
              .status(200)
              .json({ msg: 'Password has been reset and sent to email' });
            console.log(response[0].statusCode);
            console.log(response[0].headers);
          })
          .catch((error) => {
            console.error(error);
          });
        //
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// router.post(
//   '/forgetPassword',
//   check('email', 'Email is required').notEmpty(),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     User.findOne({ email: req.body.email })
//       .then((response) => {
//         if (response === null) {
//           return res.status(400).json({ errors: 'User Does not Exist' });
//         } else {

//           const msg = {
//             to: req.body.email, // Change to your recipient
//             from: 'bkarshehbaz@gmail.com', // Change to your verified sender
//             subject: 'Password Reset',
//             text: 'and easy to do anywhere, even with Node.js',
//             html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//           };

//           sgMail
//             .send(msg)
//             .then((response) => {
//               console.log(response[0].statusCode);
//               console.log(response[0].headers);
//             })
//             .catch((error) => {
//               console.error(error);
//             });
//           return res.status(200).json(response);
//         }
//       })
//       .catch((error) => {
//         return res.status(400).json({ errors: 'User Does not Exist' });
//       });

//   }
// );

router.post(
  '/Addcheck',

  check('username', 'userName is required').notEmpty(),
  check('shopname', 'shopName is required').notEmpty(),
  async (req, res) => {
    let OriginalShop = {};
    let RecordValidated = false;
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    for (let index = 0; index < shops.length; index++) {
      console.log(shops[index].shopName, '===', req.body.shopname);
      if (shops[index].shopName === req.body.shopname) {
        // If we have shopname in our Server or not
        OriginalShop = shops[index];
        RecordValidated = true;
        break;
      }
    }

    setTimeout(function () {
      console.log(RecordValidated);
      if (RecordValidated === true) {
        CheckIns.find({
          userName: req.body.username,
          shopName: req.body.shopname,
        }).then((response) => {
          console.log('response', response.length);
          // User already checked in this Shop
          if (response.length === 0) {
            // User checkingIn this job first time
            const newCheckIn = new CheckIns({
              userName: req.body.username,

              shopName: OriginalShop.shopName,
              instagram: OriginalShop.instagram,
              address: OriginalShop.address,
              time: OriginalShop.time,
              logo: OriginalShop.logo,
            });
            try {
              newCheckIn.save();
              return res.status(200).json({ message: 'User CheckIn Added !' });
            } catch (error) {
              return res.status(400).json({ error });
            }
          } else {
            return res
              .status(200)
              .json({ message: 'User Already been CheckedIn' });
          }
        });
      } else {
        return res
          .status(200)
          .json({ message: 'Please Enter the right QR code' });
      }
    }, 1500);

    // return res.status(400).json({ message: 'Please Enter Right QR code' });
  }
);
router.post(
  '/AllChecks',
  check('username', 'username is required').notEmpty(),
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    CheckIns.find({ userName: req.body.username })
      .then((response) => {
        return res.status(200).json({ response });
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

module.exports = router;
