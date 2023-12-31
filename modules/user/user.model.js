const { default: mongoose, Schema } = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
    unique: true,
  },
  phone_number: {
    type: String,
    match: [
      /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
      "Please add an phone number",
    ],
    unique: true,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "seller", "customer"],
    required: [true, "Please add a role"],
  },
  business: {
    type: String,
    default: "", // Default value for business field
  },
  status: {
    type: String,
    default: "",
    enum: ["approved", "rejected", "pending", ""],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    default: null,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
