const mongoose = require("mongoose");

const PodcastScripts = new mongoose.Schema({
  Script: {
    type: String,
    required: true,
  },
  Date:{
    type:Date,
    required:true,
  },
  CorrespondingUsers:{
    type:Array,
    required:false,
  }
});

const Scripts = mongoose.model("podcastSCripts", PodcastScripts);

module.exports = Scripts;
