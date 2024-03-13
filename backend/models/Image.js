const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  filename: {
    required: true,
    type: String,
  },
  contentType: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
