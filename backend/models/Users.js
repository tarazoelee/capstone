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
  voice:{
    type:String,
    require:false
  },
  speakingRate:{
    type:String,
    require:false
  }
});

const Users = mongoose.model("users", UserSchema);
Users.createIndexes(); // Ensure any indexes are created, especially if you are using the topics field in queries

module.exports = Users;
