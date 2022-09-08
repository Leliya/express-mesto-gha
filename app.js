const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
const mongoose = require('mongoose');
const { STATUS_CODE_404 } = require('./utils/statusCode');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6317a111bc71a05dcbf037c4',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/', (req, res) => {
  res.status(STATUS_CODE_404).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
