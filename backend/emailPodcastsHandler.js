const nodemailer = require("nodemailer");
require("dotenv").config();

// Function to send email
async function sendPodcastToEmail(recipientEmail, podcastBuffer) {
  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "dailybytes.contact@gmail.com",
      pass: process.env.NODEMAILER_PASS,
    },
  });

  // Mail options
  //CHANGE HARDCODED RECIPIENT
  const mailOptions = {
    from: "dailybytes.contact@gmail.com",
    to: "lex.zhch@gmail.com",
    subject: `Your DailyBytes Podcast !`,
    text: `AHHHHH`,
    attachments: [
      {
        filename: "Todays BYTE", // Provide a filename for the podcast
        content: podcastBuffer, // Attach the buffer directly
        contentType: "audio/mpeg", // Adjust the MIME type accordingly
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return { status: "success", message: "Email sent successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to send email" };
  }
}

module.exports = { sendPodcastToEmail };
