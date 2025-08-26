const bcrypt = require('bcrypt');
const SellerService = require('../services/Seller.service');
const AuthValidator = require('../utils/Auth.validator');
const formatResponse = require('../utils/formatResponse');
const cookiesConfig = require('../config/cookiesConfig');
const generateTokens = require('../utils/generateTokens');

class SellerController {
  static async refreshTokens(req, res) {
    try {
      const { seller } = res.locals;

      const { accessToken, refreshToken } = generateTokens({ seller });

      return res.status(200).cookie('refreshToken', refreshToken, cookiesConfig).json(
        formatResponse(200, 'Successful regenerate tokens', {
          seller,
          accessToken,
        }),
      );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async signUp(req, res) {
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
      const sellerFound = await SellerService.getByEmail(normalizedEmail);

      if (sellerFound) {
        return res
          .status(400)
          .json(formatResponse(400, 'Seller already exists', null, 'Seller already exists'));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newSeller = await SellerService.create({
        email: normalizedEmail,
        password: hashedPassword,
        username,
        phone: normalizedPhone,
        role,
      });

      if (!newSeller) {
        return res
          .status(500)
          .json(formatResponse(500, 'Failed to create seller', null, 'Failed to create seller'));
      }

      const plainSeller = newSeller.get({ plain: true });
      delete plainSeller.password;

      const { accessToken, refreshToken } = generateTokens({
        seller: plainSeller,
      });

      return res
        .status(201)
        .cookie('refreshToken', refreshToken, cookiesConfig)
        .json(
          formatResponse(201, 'Register successful', {
            seller: plainSeller,
            accessToken,
          }),
        );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async signIn(req, res) {
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
      const seller = await SellerService.getByEmail(normalizedEmail);

      if (!seller) {
        return res
          .status(400)
          .json(formatResponse(400, 'Seller not found', null, 'Seller not found'));
      }

      const isPasswordValid = await bcrypt.compare(password, seller.password);

      if (!isPasswordValid) {
        return res
          .status(400)
          .json(formatResponse(400, 'Invalid password', null, 'Invalid password'));
      }

      const plainSeller = seller.get({ plain: true });
      delete plainSeller.password;

      const { accessToken, refreshToken } = generateTokens({
        seller: plainSeller,
      });

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookiesConfig)
        .json(
          formatResponse(200, 'Login successful', {
            seller: plainSeller,
            accessToken,
          }),
        );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async signOut(req, res) {
    try {
      res.clearCookie('refreshToken').json(formatResponse(200, 'Logout successfully'));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  // изменение данных продавца
  static async updateSeller(req, res) {
    const { id } = req.params;
    const { username, email, phone } = req.body;

    const avatar = req.file;

    const { isValid, error } = AuthValidator.validateUpdateSeller({
      username,
      email,
      phone,
      // avatar: avatar ? true : false
    });

    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Validation error', null, error));
    }
    if (email) {
      const sellerFound = await SellerService.getByEmail(email);
      if (sellerFound && sellerFound.id !== parseInt(id)) {
        return res
          .status(400)
          .json(formatResponse(400, 'Email already exists', null, 'Email already exists'));
      }
    }

    try {
      const updateData = {
        ...(username && { username }),
        ...(email && { email: email.toLowerCase() }),
        ...(phone && { phone }),

        ...(avatar && { avatar: `/uploads/${avatar.filename.replace(/\\/g, '/')}` }),
      };

      const updatedSeller = await SellerService.update(id, updateData);
      return res
        .status(200)
        .json(formatResponse(200, 'Seller updated successfully', updatedSeller));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }
}

module.exports = SellerController;
