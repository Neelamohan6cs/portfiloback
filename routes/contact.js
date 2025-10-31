const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ status: "contact route works!" });
});

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("📨 Contact form submitted:", { name, email, subject, message });

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: name, email: process.env.MY_EMAIL },
        to: [{ email: process.env.MY_EMAIL }],
        subject: `Portfolio Contact: ${subject}`,
        htmlContent: `
          <h2>📩 New Contact Message</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Subject:</b> ${subject}</p>
          <p><b>Message:</b><br>${message.replace(/\n/g, "<br>")}</p>
        `,
      },
      {
        headers: {
          "accept": "application/json",
          "api-key": process.env.MY_EMAIL_PASS, // your Brevo SMTP/API key
          "content-type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully via Brevo!");
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to send message." });
  }
});

module.exports = router;
