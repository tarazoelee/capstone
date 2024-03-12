const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
});

const Topics = mongoose.model("Topics", TopicSchema);

module.exports = Topics;
