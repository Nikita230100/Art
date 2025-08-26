const bcrypt = require('bcrypt');
const BuyerService = require('../services/Buyer.service');
const AuthValidator = require('../utils/Auth.validator');
const formatResponse = require('../utils/formatResponse');
const cookiesConfig = require('../config/cookiesConfig');
const generateTokensBuyer = require('../utils/generateTokensBuyer');
const CartService = require('../services/Cart.service');
const fs = require('fs').promises;
const path = require('path');

class BuyerController {
  static async refreshTokensBuyer(req, res) {
    try {
      const { buyer } = res.locals;
      const { accessToken, refreshToken } = generateTokensBuyer({ buyer });

      return res.status(200).cookie('refreshTokenBuyer', refreshToken, cookiesConfig).json(
        formatResponse(200, 'Successful regenerate tokens', {
          buyer,
          accessToken,
        }),
      );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async signUpBuyer(req, res) {
    const { username, email, password, phone, role } = req.body;

    // Нормализация номера телефона
    const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');

    const { isValid, error } = AuthValidator.validateSignUp({
      username,
      email,
      password,
      phone: normalizedPhone,
      role,
    });

    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Validation error', null, error));
    }

    const normalizedEmail = email.toLowerCase();
    try {
      const buyerFound = await BuyerService.getByEmail(normalizedEmail);

      if (buyerFound) {
        return res
          .status(400)
          .json(formatResponse(400, 'Buyer already exists', null, 'Buyer already exists'));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newBuyer = await BuyerService.create({
        email: normalizedEmail,
        password: hashedPassword,
        username,
        phone: normalizedPhone,
        role,
      });

      if (!newBuyer) {
        return res
          .status(500)
          .json(formatResponse(500, 'Failed to create user', null, 'Failed to create user'));
      }

      const plainBuyer = newBuyer.get({ plain: true });
      delete plainBuyer.password;

      const { accessToken, refreshToken } = generateTokensBuyer({
        buyer: plainBuyer,
      });

      return res
        .status(201)
        .cookie('refreshTokenBuyer', refreshToken, cookiesConfig)
        .json(
          formatResponse(201, 'Register successful', {
            buyer: plainBuyer,
            accessToken,
          }),
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)

        .json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async signInBuyer(req, res) {
    const { email, password } = req.body;

    const { isValid, error } = AuthValidator.validateSignIn({
      email,
      password,
    });

    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Validation error', null, error));
    }

    const normalizedEmail = email.toLowerCase();
    try {
      const buyer = await BuyerService.getByEmail(normalizedEmail);

      if (!buyer) {
        return res
          .status(400)
          .json(formatResponse(400, 'Buyer not found', null, 'Buyer not found'));
      }

      const isPasswordValid = await bcrypt.compare(password, buyer.password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json(formatResponse(400, 'Invalid password', null, 'Invalid password'));
      }

      const plainBuyer = buyer.get({ plain: true });
      delete plainBuyer.password;

      const { accessToken, refreshToken } = generateTokensBuyer({
        buyer: plainBuyer,
      });

      return res
        .status(200)
        .cookie('refreshTokenBuyer', refreshToken, cookiesConfig)
        .json(
          formatResponse(200, 'Login successful', {
            buyer: plainBuyer,
            accessToken,
          }),
        );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async signOutBuyer(req, res) {
    try {
      res.clearCookie('refreshTokenBuyer').json(formatResponse(200, 'Logout successfully'));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async updateBuyer(req, res) {
    try {
      const { buyer } = res.locals;
      const { username, email, phone } = req.body;

      const existingBuyer = await BuyerService.getById(buyer.id);
      if (!existingBuyer) {
        return res
          .status(404)
          .json(formatResponse(404, 'Buyer not found', null, 'Buyer not found'));
      }

      let avatarPath = existingBuyer.avatar;
      if (req.file) {
        if (existingBuyer.avatar) {
          const oldAvatarPath = path.join(__dirname, '../../public', existingBuyer.avatar);
          try {
            await fs.unlink(oldAvatarPath);
          } catch (error) {
            console.error('Error deleting old avatar:', error);
          }
        }
        avatarPath = `/uploads/${req.file.filename}`;
      }

      const updatedBuyer = await BuyerService.update(buyer.id, {
        username: username || existingBuyer.username,
        email: email || existingBuyer.email,
        phone: phone || existingBuyer.phone,
        avatar: avatarPath,
      });

      const plainBuyer = updatedBuyer.get({ plain: true });
      delete plainBuyer.password;

      return res.status(200).json(formatResponse(200, 'Profile updated successfully', plainBuyer));
    } catch (error) {
      console.error('Error updating buyer profile:', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, error.message));
    }
  }
}

module.exports = BuyerController;
