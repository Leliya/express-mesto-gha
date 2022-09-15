const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/me', getCurrentUser);

userRouter.get('/:userId', getUser);

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateAvatar);

userRouter.get('', getUsers);

module.exports = userRouter;
