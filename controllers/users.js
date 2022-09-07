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
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_CODE_404)
          .send({ message: 'Пользователь не найден' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(STATUS_CODE_404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные' });
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
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(STATUS_CODE_404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
