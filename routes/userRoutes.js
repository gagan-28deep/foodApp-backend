const express = require("express");
const userRouter = express.Router();
const {
  getAllUsersController,
  profileController,
  deleteUserController,
} = require("../controller/userController");
const { protectRoute } = require("../controller/authController");
// users -> get all the users from db -> sensitive route -> protected route -> logged in i will only allow that person
userRouter.get("/users", protectRoute, getAllUsersController);
// logged in user
userRouter.get("/user", protectRoute, profileController);

// Delete User
userRouter.delete("/user", protectRoute, deleteUserController);

module.exports = userRouter;
