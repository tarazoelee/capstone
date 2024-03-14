const express = require("express");
const app = express();
const axios = require("axios");
const FormData = require('form-data');
const scriptsModel = require("../models/PodcastScripts");
const fs = require('fs');
const path = require('path');

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
    const scripts = await scriptsModel.find();
    // {
    //   date: {
    //     $gte: startOfDay,
    //     $lt: endOfDay
    //   }
    // }
    res.send(scripts);
   // synthesize(scripts); //turn them into audio files

    //console.log(scripts);
  } catch (e) {
    res.status(500).send("Unable to find scripts");
    console.error("Error occurred while retrieving scripts:", e);
  }
});

//create audio file of text
async function synthesize(s) {
  const audioResponses = [];
  const filePaths = [];
  const apikey = "AIzaSyA888cSZgCc2lMDxqy7g4r7byJOsGfi8GA";
  const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apikey}`;
  const uploadEndpoint = "http://localhost:5001/upload";

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
        const audioContent = response.data.audioContent;
        const audioBuffer = Buffer.from(audioContent, 'base64');

        const formData = new FormData();
        formData.append('file', audioBuffer, 'audio.mp3'); // 'audio.mp3' is the filename

        const uploadResponse = await axios.post(uploadEndpoint, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });

          console.log('Upload response:', uploadResponse.data);

        /**-------FOR TESTING THE MP3 FILES----- */
        // const response = await axios.post(endpoint, payload);
        // const audioData = response.data.audioContent;
        // // Generate a unique file name based on timestamp
        // const fileName = `audio_${Date.now()}.mp3`;
        // // Write the audio data to a file
        // const filePath = path.join(__dirname, fileName);
        // fs.writeFileSync(filePath, Buffer.from(audioData, 'base64'));
        // filePaths.push(filePath);

      } catch (error) {
        console.error("Error occurred while synthesizing audio:", error);
        // Handle error if necessary
      }
  }
  return audioResponses;
}



module.exports = app;
