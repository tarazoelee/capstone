const nodemailer = require("nodemailer");

// Function to send email
async function sendContactEmail(formEmail, formMessage) {
  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "alexandra.zhitkevich@gmail.com",
      clientId:
        "575373605196-7nff9imgubsil8em2jp49f14m8t8hh6l.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//04mpxcSEbTKj1CgYIARAAGAQSNwF-L9IrxYjV2Y2XzOWkJl9YMjyAvPeM0oBPYNt_gOQhLox29Da4nKe6YJBMZsMLFEg925TB32Q",
      accessToken:
        "ya29.a0AfB_byB_qBDrUdWtZuzoNX22O2IrPNSXg-k8wKCAmo5QSEDy5tbVxDDiqkVWD3Kom2-zF33Cq2ItjwQNo1Gkd8QRrZnWTWFGlxJRisU7qv-HMyEhxdHB6UY_gv3W_4WDUtZ_Rrlw_VFmVkc2kguepKsQViaogaB45V-gaCgYKAX8SARISFQHGX2Miy84gaTTZ-232P1gQMPWS3w0171",
    },
  });

  // Mail options
  const mailOptions = {
    from: `${formEmail}`,
    to: "lex.zhch@gmail.com",
    subject: `Message From DailyBytes, Re:${formEmail.email}`,
    text: `User: ${formEmail.email}\n Reason for contact: ${formMessage}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { status: "success", message: "Email sent successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to send email" };
  }
}

module.exports = { sendContactEmail };
