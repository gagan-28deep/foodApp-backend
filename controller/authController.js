const jwt = require("jsonwebtoken");
// const secrets = require("../secrets");
const secrets = process.env || require("../secrets");
const FooduserModel = require("../model/userModel");

const mailSender = require("../utilities/mailSender");

// ************************controller functions************************

async function signupController(req, res) {
  try {
    let data = req.body;
    let { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        result: "Please Enter ALl the Fields",
      });
    }
    console.log(data);
    // To create new doc in user
    let newUser = await FooduserModel.create(data);
    console.log(newUser);
    res.status(201).json({
      result: "user signup successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      result: err.message,
    });
  }
}

async function loginController(req, res) {
  try {
    let data = req.body;
    let { email, password } = data;
    if (email && password) {
      let user = await FooduserModel.findOne({ email: email });
      if (user) {
        if (user.password == password) {
          // create JWT ->-> payload, secret text
          // ,algorithms-> SHA256
          const token = jwt.sign(
            {
              data: user["_id"],
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            },
            secrets.JWTSECRET
          );
          // put token into cookies
          res.cookie("JWT", token);
          // send the token
          user.password = undefined;
          user.confirmPassword = undefined;
          // Everything is fine
          res.status(200).json({
            user,
          });
        } else {
          // email or  password doesn't match
          res.status(401).json({
            response: "Email or  Password doesn't match",
          });
        }
      } else {
        // email doesn't exist or user not found
        res.status(404).json({
          result: "User not found",
        });
      }
    } else {
      // email or password is missing
      res.status(400).json({
        // result : "Please enter email and password"
        result: "Please enter email and password",
      });
    }
  } catch (err) {
    // Server error
    res.status(500).json({
      result: err.message,
    });
  }
}

async function resetPasswordController(req, res) {
  try {
    let { otp, password, confirmPassword, email } = req.body;
    // search -> get the user
    let user = await FooduserModel.findOne({ email });
    let currentTime = Date.now();
    if (currentTime > user.otpExpiry) {
      // delete user.otp;
      // delete user.otpExpiry;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      res.status(401).json({
        message: "Otp Expired",
      });
    } else {
      if (user.otp != otp) {
        res.status(400).json({
          message: "Otp doesn't match",
        });
      } else {
        user = await FooduserModel.findOneAndUpdate(
          { otp, email },
          { password, confirmPassword },
          {
            runValidators: true,
            new: true,
          }
        );
        // delete user.otp;
        // delete user.otpExpiry;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        //////////////////////////////////////////////////////////////
        res.status(200).json({
          user: user,
          message: "User password reset",
        });
      }
    }
    // key delete -> get the document obj -> modify that object by removing useless keys
    // save to save this doc in db
    console.log(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
}
async function forgetPasswordController(req, res) {
  try {
    let { email } = req.body;
    let user = await FooduserModel.findOne({ email });
    if (user) {
      let otp = otpGenerator();
      let afterFiveMin = Date.now() + 5 * 60 * 1000;
      user.otp = otp;
      user.otpExpiry = afterFiveMin;
      await mailSender(email, otp);
      await user.save();
      res.status(204).json({
        data: user,
        message: "Otp sent to your email",
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}
//    mail
// by default -> FindAndUpdate -> not updated send document,
// new =true -> you will get updated doc
// let user = await FooduserModel.findOneAndUpdate(
//   { email: email },
//   { otp: otp, otpExpiry: afterFiveMin },
//   { new: true }
// );
// console.log(user);
// res.json({
//   data: user,
//   message: "Otp send to your mail",
// });

// *************************helper functions************************

async function otpController(req, res) {
  try {
    let { email, otp } = req.body;
    let currentTime = Date.now();
    let user = await FooduserModel.findOne({ email });
    if (currentTime > user.otpExpiry) {
      // delete user.otp;
      // delete user.otpExpiry;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      res.status(401).json({
        message: "Otp Expired",
      });
    } else {
      if (user.otp != otp) {
        res.status(400).json({
          message: "Otp doesn't match",
        });
      } else {
        res.status(200).json({
          message: "Otp Matches",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

function protectRoute(req, res, next) {
  try {
    const cookies = req.cookies;
    const JWT = cookies.JWT;
    if (cookies.JWT) {
      console.log("protect Route Encountered");
      // you are logged In then it will
      // allow next fn to run
      let token = jwt.verify(JWT, secrets.JWTSECRET);
      console.log("Jwt decrypted", token);
      let userId = token.data;
      console.log("userId", userId);
      req.userId = userId;

      next();
    } else {
      res.send("You are not logged In Kindly Login");
    }
  } catch (err) {
    console.log(err);
    if (err.message == "invalid signature") {
      res.send("TOken invalid kindly login");
    } else {
      res.send(err.message);
    }
  }
}
function otpGenerator() {
  return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
  signupController,
  loginController,
  resetPasswordController,
  forgetPasswordController,
  protectRoute,
  otpController,
};
