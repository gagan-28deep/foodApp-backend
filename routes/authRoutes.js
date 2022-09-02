const express = require("express");
const authRouter = express.Router();
const {
  signupController,
  loginController,
  resetPasswordController,
  forgetPasswordController,
  otpController
} = require("../controller/authController");
authRouter.post("/signup", signupController);
// authRouter.post("/api/v1/auth/signup")   // this is the same as above
// login input: email + password:
authRouter.post("/login", loginController);
authRouter.post("/otp" , otpController)
authRouter.patch("/forgetPassword", forgetPasswordController);
authRouter.patch("/resetPassword", resetPasswordController);
module.exports = authRouter;
