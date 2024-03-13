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
});

const Scripts = mongoose.model("scripts", PodcastScripts);

module.exports = Scripts;
