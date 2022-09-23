const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Введенные данные не являются ссылкой.',
    },
  },
  owner: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
    required: true,
  },
  likes: [mongoose.Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('card', cardSchema);
