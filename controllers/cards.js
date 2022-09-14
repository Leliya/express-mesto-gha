const Card = require('../models/card');
const {
  STATUS_CODE_400,
  STATUS_CODE_404,
  STATUS_CODE_403,
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
  Card.findById(req.params.cardId)
    .orFail(() => { throw new Error('NotFound'); })
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        return res
          .status(STATUS_CODE_403)
          .send({ message: 'Можно удалять только свои карточки' });
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Пост удалён' }))
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_CODE_400)
          .send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_CODE_404)
          .send({ message: 'Карточки не существует или она уже была удалена' });
      }
      return res
        .status(STATUS_CODE_500)
        .send({ message: 'Внутренняя ошибка. Попробуйте еще раз' });
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
  ).orFail(() => { throw new Error('NotFound'); })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_CODE_404)
          .send({ message: 'Карточка не найдена' });
      }
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
  ).orFail(() => { throw new Error('NotFound'); })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_CODE_404)
          .send({ message: 'Карточка не найдена' });
      }
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
