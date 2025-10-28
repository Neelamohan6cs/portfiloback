const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log('Contact form submitted:', { name, email, subject, message });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
  from: process.env.MY_EMAIL,
  to: process.env.MY_EMAIL,
  replyTo: email,
  subject: `Portfolio Contact: ${subject}`,
  html: `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f4f7fb;
    padding: 40px;
    display: flex;
    justify-content: center;
  ">
    <div style="
      background: #ffffff;
      padding: 25px 35px;
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e9f2;
    ">
      <h2 style="
        color: #2563eb;
        font-size: 22px;
        border-bottom: 2px solid #2563eb;
        display: inline-block;
        padding-bottom: 5px;
        margin-bottom: 20px;
      ">
        📩 New Contact Message
      </h2>

      <p style="font-size: 15px; color: #333; margin: 8px 0;">
        <strong style="color: #111;">👤 Name:</strong> ${name}
      </p>

      <p style="font-size: 15px; color: #333; margin: 8px 0;">
        <strong style="color: #111;">✉️ Email:</strong> 
        <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">
          ${email}
        </a>
      </p>

      <p style="font-size: 15px; color: #333; margin: 8px 0;">
        <strong style="color: #111;">📘 Subject:</strong> ${subject}
      </p>

      <p style="font-size: 15px; color: #111; margin: 12px 0 6px;">
        <strong>📝 Message:</strong>
      </p>

      <div style="
        background: #f9fafb;
        padding: 15px;
        border-left: 4px solid #2563eb;
        border-radius: 8px;
        color: #444;
        line-height: 1.6;
        font-size: 15px;
      ">
        ${message.replace(/\n/g, '<br>')}
      </div>

      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eaeaea;">
      <p style="font-size: 12px; color: #888; text-align: center;">
        📬 This message was sent from your <strong>Portfolio Contact Form</strong>.
      </p>
    </div>
  </div>
`,

};

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;
