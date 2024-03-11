const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema({
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
    type: Buffer,
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

const Podcasts = mongoose.model("Podcast", PodcastSchema);

module.exports = Podcasts;
