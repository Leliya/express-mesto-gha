const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
const { STATUS_CODE_404 } = require('./utils/statusCode');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6317a111bc71a05dcbf037c4',
//   };
//   next();
// });

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', (req, res) => {
  res.status(STATUS_CODE_404).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
