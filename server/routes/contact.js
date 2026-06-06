const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please insert a valid email address.' });
  }

  try {                                          // <-- this was missing
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject || 'No Subject'}`,
      text: `New message from your portfolio!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    };

    const visitorMailOptions = {
      from: `"Chintan Vaghamshi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for reaching out! (Auto-Reply)`,
      text: `Hi ${name},\n\nThank you for getting in touch! I received your message regarding "${subject || 'your inquiry'}" and will get back to you soon.\n\nBest regards,\nChintan Vaghamshi\ndev_lox_011`,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(visitorMailOptions),
    ]);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
});

module.exports = router;