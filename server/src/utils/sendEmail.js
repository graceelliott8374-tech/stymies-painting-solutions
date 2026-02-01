const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendLeadNotification({ subject, text }) {
  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.warn("SENDGRID_FROM_EMAIL not set. Email not sent.");
    return;
  }

  const msg = {
    to: process.env.SENDGRID_FROM_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log("Lead notification email sent");
  } catch (err) {
    console.error("SendGrid error:", err.response?.body || err.message);
  }
}

module.exports = { sendLeadNotification };
