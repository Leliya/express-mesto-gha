const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  User.find({})
    .then((user) => res.send({ user }))
    .catch((err) => res.status(500).send({ message: err.message }));
});

router.get('/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ user }))
    .catch((err) => res.status(500).send({ message: err.message }));
});

router.post('/', (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => res.status(500).send({ message: err.message }));
});

module.exports = router;
