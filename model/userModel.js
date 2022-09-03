const mongoose = require("mongoose");

// Schema -> set of features and rules a certain entity should follow
// Connect to my app -> mongoose

// let secret = require("../secrets");
let DB_LINK = process.env.DB_LINK || require("../secrets").DB_LINK;
mongoose
  // .connect(secret.DB_LINK)
  .connect(DB_LINK)
  .then(function () {
    console.log("Connected");
  })
  .catch(function (err) {
    console.log("Error ", err);
  });

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is not sent"],
  },
  password: {
    type: String,
    required: [true, "password is missing"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is missing"],
    // Custom Validator
    validate: {
      validator: function () {
        // this refers to current entry
        return this.password == this.confirmPassword;
      },
      message: "Password miss match",
    },
  },
  email: {
    type: String,
    required: [true, "email is missing"],
  },
  phoneNumber: {
    type: String,
    minLength: [10, "less than 10 digits"],
    maxLength: [10, "more than 10 digits"],
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  pic: {
    type: String,
    default: "dp.png",
  },
  //   otp: {
  //     type: String,
  //   },
  //   address: {
  //     type: String,
  //   },
});

// product Knowledge
// user data -> store
// name,
// email,
// phonenumber,
// pic,
// password,
// address
// ?? -> ??
// model is similar to your collection

const FooduserModel = mongoose.model("FooduserModel", userSchema);
// name of the collection, the set of rules this collection should follow

module.exports = FooduserModel;
