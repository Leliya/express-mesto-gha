const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_CODE_400,
  STATUS_CODE_404,
  STATUS_CODE_500,
} = require('../utils/statusCode');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ user }))
    .catch(() => {
      res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_CODE_404)
          .send({ message: 'Такого пользователя не существует' });
      }
      if (err.name === 'CastError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные5' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const getCurrentUser = (req, res) => {
  console.log(req.user._id);
  User.findById(req.user._id).orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_CODE_404)
          .send({ message: 'Такого пользователя не существует' });
      }
      if (err.name === 'CastError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные4' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.send({ user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res
            .status(STATUS_CODE_400)
            .send({ message: 'Переданы некорректные данные3' });
        }
        return res
          .status(STATUS_CODE_500)
          .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
      });
  }).catch((err) => res.status(400).send(err));
};

const updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true },
  ).orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_CODE_404)
          .send({ message: 'Такого пользователя не существует' });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные2' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_CODE_404)
          .send({ message: 'Такого пользователя не существует' });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные1' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    return res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .end();
  })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
