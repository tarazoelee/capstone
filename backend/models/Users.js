const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  topics: [
    {
      type: String,
      required: false,
    },
  ],
  length: {
    type: String,
    required: false,
  },
});

const Users = mongoose.model("users", UserSchema);
Users.createIndexes(); // Ensure any indexes are created, especially if you are using the topics field in queries

module.exports = Users;
