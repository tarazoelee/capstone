const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema({
  date_created: {
    type: Date,
    required: true,
  },
  topic_1: {
    type: String,
    required: true,
  },
  topic_2: {
    type: String,
    required: true,
  },
  topic_3: {
    type: String,
    required: true,
  },
  length: {
    type: String,
    required: true,
  },
  audio_file: {
    type: Buffer, // You may choose to store the file reference instead of the binary
    contentType: String,
  },
  corresponding_users: [
    {
      type: String,
      match: /.+@.+\..+/, // Simple validation for emails
      index: true, // This creates an index on the corresponding_users field
    },
  ],
});

const Podcast = mongoose.model("Podcast", podcastSchema);
