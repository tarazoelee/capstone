const express = require("express");
const app = express();
const axios = require("axios");

const scriptsModel = require("../models/PodcastScripts");

app.post("/addScript", async (req, res) => {
  try {
    const script = req.body.script;
    const users = [req.body.users];
    const date = new Date();

    const newScript = {
      $set: {
        script: script,
        date: date,
        users: users,
      },
    };

    // Attempt to update the user
    const posting = await scriptsModel.insertOne(newScript);
    await posting.save();
    console.log("script added");
  } catch (e) {
    res.status(400).send("could not add");
  }
});

/**GET ALL SCRIPTS CREATED TODAY */
const today = new Date();
const startOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);
const endOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1
);

app.get("/", async (req, res) => {
  try {
    const scripts = await scriptsModel.find({});
    // {
    //   date: {
    //     $gte: startOfDay,
    //     $lt: endOfDay
    //   }
    // }
    res.send(scripts);
    synthesize(scripts); //turn them into audio files

    console.log(scripts);
  } catch (e) {
    res.status(500).send("Unable to find scripts");
    console.error("Error occurred while retrieving scripts:", e);
  }
});

//create audio file of text
async function synthesize(s) {
  // Array to store audio responses for each item
  const audioResponses = [];

  const apikey = "AIzaSyA888cSZgCc2lMDxqy7g4r7byJOsGfi8GA";
  const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apikey}`;

  for (const item of s) {
    const script = item.script;
    const payload = {
      audioConfig: {
        audioEncoding: "MP3",
        effectsProfileId: ["small-bluetooth-speaker-class-device"],
        pitch: 0,
        speakingRate: 1,
      },
      input: {
        text: script,
      },
      voice: {
        languageCode: "en-US",
        name: "en-US-Standard-A",
      },
    };
    try {
      const response = await axios.post(endpoint, payload);
      audioResponses.push(response.data);
    } catch (error) {
      console.error("Error occurred while synthesizing audio:", error);
      // Handle error if necessary
    }
  }
  return audioResponses;
}

// app.post("/synthesize", async (req,res)=>{
//     const text = req.body.text;
//     const apikey = "AIzaSyA888cSZgCc2lMDxqy7g4r7byJOsGfi8GA"
//     const endpoint =`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apikey}`
//     const payload =
//         {
//             "audioConfig": {
//                 "audioEncoding": "MP3",
//                 "effectsProfileId": [
//                 "small-bluetooth-speaker-class-device"
//                 ],
//                 "pitch": 0,
//                 "speakingRate": 1
//             },
//             "input": {
//                 "text": text
//             },
//             "voice": {
//                 "languageCode": "en-US",
//                 "name": "en-US-Standard-A"
//             }
//             }
//         const response = await axios.post(endpoint, payload)
//         res.json(response.data); //going to contain the base64 audio content to be consumed by frontend
// })

module.exports = app;
