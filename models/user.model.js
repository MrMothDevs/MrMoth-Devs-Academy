const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  pfp: {
    type: String,
    data: Buffer,
    required: true,
  },
  status: {
    type: String, 
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  confirmationCode: { 
    type: String, 
    unique: true },
  permissions: [
    {
      type: String,
      default: 'User'
    }
  ],
  inventory: {
    type: Array
}
});

module.exports = new mongoose.model("User", UserSchema);