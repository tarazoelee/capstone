const mongoose = require("mongoose");

const VoiceSchema = new mongoose.Schema({
  voice: {
    type: String,
    required: true,
  },
});

const Voices = mongoose.model("voiceoptions", VoiceSchema);

module.exports = Voices;
