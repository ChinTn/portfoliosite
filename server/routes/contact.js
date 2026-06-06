const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const rateLimit = require('express-rate-limit');

// Rate limiter: Max 3 emails per IP every 1 hour
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, 
  message: { message: 'Too many requests from this IP. Please try again later.' }
});

router.post('/', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  // Prevent massive walls of text / Zalgo spam
  if (message.length > 2000) {
    return res.status(400).json({ message: 'Message is too long. Please keep it under 2000 characters.' });
  }
  if (name.length > 100 || subject && subject.length > 150) {
    return res.status(400).json({ message: 'Name or subject is too long.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please insert a valid email address.' });
  }

  try {
    // Notification to you
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject || 'No Subject'}`,
      text: `New message from your portfolio!\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    // Auto-reply to visitor
    await resend.emails.send({
      from: 'Chintan Vaghamshi <onboarding@resend.dev>',
      to: email,
      subject: `Thank you for reaching out! (Auto-Reply)`,
      text: `Hi ${name},\n\nThank you for getting in touch! I received your message regarding "${subject || 'your inquiry'}" and will get back to you soon.\n\nBest regards,\nChintan Vaghamshi\ndev_lox_011`,
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
});

module.exports = router;