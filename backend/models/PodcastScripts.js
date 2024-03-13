const mongoose = require("mongoose");

const PodcastScripts = new mongoose.Schema({
  lcript: {
    type: String,
    required: true,
  },
  date:{
    type:Date,
    required:true,
  },
  users:{
    type:Array,
    required:false,
  }
});

const Scripts = mongoose.model("podcastSCripts", PodcastScripts);

module.exports = Scripts;
