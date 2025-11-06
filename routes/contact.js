const express = require("express");
const axios = require("axios");
const router = express.Router();

// ✅ Test route (for quick Render check)
router.get("/test", (req, res) => {
  res.json({ status: "contact route works!" });
});

// ✅ POST: Send email using Brevo API
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log("📨 Contact form submitted:", { name, email, subject, message });

  try {
    // ✅ Send email via Brevo API
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Neela Portfolio", // ✅ This must match a verified sender name
          email: process.env.MY_EMAIL, // ✅ Verified Brevo sender email
        },
        to: [
          {
            email: process.env.MY_EMAIL, // ✅ Where you’ll receive the email
            name: "Neela Mohan",
          },
        ],
        replyTo: { email, name }, // ✅ So replies go to the user
        subject: `📬 Portfolio Contact: ${subject || "No Subject"}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:20px;">
            <h2 style="color:#2563eb;">📩 New Contact Message</h2>
            <p><b>👤 Name:</b> ${name}</p>
            <p><b>✉️ Email:</b> <a href="mailto:${email}">${email}</a></p>
            <p><b>📘 Subject:</b> ${subject}</p>
            <div style="margin-top:15px; padding:10px; border-left:3px solid #2563eb; background:#fff;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <hr style="margin-top:25px;">
            <small style="color:#777;">📬 Sent via your Portfolio Contact Form</small>
          </div>
        `,
      },
      {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY, // ✅ Use separate env var for security
        },
      }
    );

    console.log("✅ Email sent successfully via Brevo!");
    res.status(200).json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error("❌ Error sending email:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to send message.",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
