const FooduserModel = require("../model/userModel");

async function profileController(req, res) {
  // User profile data
  try {
    const userId = req.user.id;
    const user = await FooduserModel.findById(userId);
    res.json({
      data: user,
      message: "User profile data",
    });
  } catch (err) {
    res.end(err.message);
  }
}

async function getAllUsersController(req, res) {
  try {
    let users = await FooduserModel.find();
    res.json(users);
  } catch (err) {
    res.end(err.message);
  }
}

async function deleteUserController(req, res) {
  try {
    const userId = req.user.id;
    FooduserModel.findOne({ user: userId });
    FooduserModel.findOneAndRemove({ user: userId });
    res.json({
      message: "User deleted",
    });
  } catch (err) {
    res.end(err.message);
  }
}

module.exports = {
  profileController: profileController,
  getAllUsersController: getAllUsersController,
  deleteUserController: deleteUserController,
};
