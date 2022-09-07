const Card = require('../models/card');
const {
  STATUS_CODE_400,
  STATUS_CODE_404,
  STATUS_CODE_500,
} = require('../utils/statusCode');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ cards }))
    .catch(() => {
      res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((response) => {
      if (response) {
        res.send({ message: 'Пост удалён' });
      } else {
        res.status(404).send('Карточки не существует или она уже была удалена');
      }
    })
    .catch(() => {
      res.status(500).send('Что-то пошло не так');
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(STATUS_CODE_404).send('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(STATUS_CODE_404).send('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
