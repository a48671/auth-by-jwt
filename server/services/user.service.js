const UserModel = require('../models/user.model');
const emailService = require('../services/email.service');
const tokenService = require('../services/token.service');
const UserDto = require('../dtos/user.dto');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const ApiError = require("../exeptions/api-error");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      ApiError.BadRequest(`User with email ${email} already exists`)
    }

    const passwordHash = await bcrypt.hash(password, Number(process.env.SALT));
    const activationLink = uuid.v4();

    const user = await UserModel.create({ email, passwordHash, activationLink });
    await emailService.sendActivationLink(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return ({
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      user: {
        email: userDto.email,
        id: userDto.id,
        isActivated: userDto.isActivated
      }
    });
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      ApiError.BadRequest('User with this email did not find');
    }

    const isPassEquals = await bcrypt.compare(password, user.passwordHash);

    if (!isPassEquals) {
      ApiError.BadRequest('Email or password is wrong');
    }

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return ({
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      user: {
        email: userDto.email,
        id: userDto.id,
        isActivated: userDto.isActivated
      }
    });
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      ApiError.BadRequest('The activation link is wrong');
    }

    user.isActivated = true;

    await user.save();
  }

  async logout(refreshToken) {
    await tokenService.removeRefreshToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenDataFromDB = tokenService.findRefreshToken(refreshToken);

    if (!userData || !tokenDataFromDB) {
      ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return ({
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      user: {
        email: userDto.email,
        id: userDto.id,
        isActivated: userDto.isActivated
      }
    });
  }

  async getAllUsers() {
    const users = await UserModel.find();

    return users.map(u => new UserDto(u));
  }
}

module.exports = new UserService();
