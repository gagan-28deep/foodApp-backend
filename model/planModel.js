const mongoose = require("mongoose");

let planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Kindly Pass the Name"],
    unique: [true, "Plan name should be unique"],
    maxlength: [40, "Your plan is more than 40 characters"],
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  price: {
    type: Number,
    required: [true, "Number is required"],
  },
  discount: {
    type: Number,
    validate: {
      validator: function () {
        return this.discount < this.price;
      },
      message: "Discount must be less than actual price",
    },
  },
});

const FoodplanModel = mongoose.model("Foodplanmodel", planSchema);

module.exports = FoodplanModel;
