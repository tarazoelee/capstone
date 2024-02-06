const mongoose = require("mongoose");

// Replace with your actual connection string
const mongoDBUri =
  "mongodb+srv://azhitkev:dltImV1IGgFvxXje@capstone.8mdcviu.mongodb.net/capstoneDB";

mongoose
  .connect(mongoDBUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected Successfully"))

  .catch((err) => {
    console.error(err);
  });

const topicSchema = new mongoose.Schema({ topic: String });
const Topic = mongoose.model("Topic", topicSchema);

const createTopicCollection = async (topicName) => {
  let collectionName = topicName.replace(/\s/g, ""); // Remove spaces for collection name
  collectionName = collectionName.toLowerCase(); // Collection names should be in lowercase

  const collectionExists = await mongoose.connection.db
    .listCollections({ name: collectionName })
    .hasNext();

  if (!collectionExists) {
    const topicCollectionSchema = new mongoose.Schema(
      { date: Date, data: String },
      { strict: false }
    );
    mongoose.model(collectionName, topicCollectionSchema, collectionName);
    console.log(`Collection created for topic: ${collectionName}`);
  } else {
    console.log(`Collection already exists for topic: ${collectionName}`);
  }
};

const initializeTopicCollections = async () => {
  try {
    const topics = await Topic.find({}); // Fetch all topics
    for (const topic of topics) {
      await createTopicCollection(topic.topic);
    }
    console.log("All collections checked/created.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

initializeTopicCollections().then(() => {
  mongoose.disconnect();
});
