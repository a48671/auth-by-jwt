const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const ApiError = require('../exeptions/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors));
      }

      const { email, password } = req.body;

      const userData = await userService.registration(email, password);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const userData = await userService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      await userService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.json({ message: 'User is unauthorized' });
    } catch (e) {
      next(e);
    }
  }
  async activateLink(req, res, next) {
    try {
      await userService.activate(req.params.link);

      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
