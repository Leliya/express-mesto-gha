const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mongoose = require('mongoose');
const router = require('./routes/users');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use('/users', router);
// app.post('/users', (req, res) => {
//   console.log(req.body);
//   res.send(req.body);
// });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
