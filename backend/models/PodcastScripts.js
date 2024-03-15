const mongoose = require("mongoose");

const PodcastScripts = new mongoose.Schema({
  script: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  users: {
    type: Array,
    required: false,
  },
  refID: {
    type: String,
    required: false,
  },
});

const Scripts = mongoose.model("podcastScripts", PodcastScripts);

module.exports = Scripts;
