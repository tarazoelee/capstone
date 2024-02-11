const mongoose = require("mongoose");

const TopicTableSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  data: {
    type: String,
    required: false,
  },
});

const topics = [
  "international",
  "health",
  "uspolitics",
  "canadiansports",
  "nhl",
  "nba",
  "nfl",
  "mlb",
  "ncaa",
  "collegebasketball",
  "collegefootball",
  "business",
  "economy",
  "technology",
  "topstories",
  "breakingnews",
  "worldnews",
  "arts",
  "canadianpolitics",
];

const topicModels = {};

// Convert topic to a valid collection name
topics.forEach((topic) => {
  topicModels[modelName] = mongoose.model(modelName, TopicTableSchema);
});
Object.values(topicModels).forEach((model) => model.createIndexes());

module.exports = topicModels;
