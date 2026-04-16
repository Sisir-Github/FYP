import nodemailer from 'nodemailer';
import env from '../config/env.js';

const transporter = nodemailer.createTransport({
  service: env.smtpHost.includes('gmail') ? 'gmail' : undefined,
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465 || env.smtpSecure,
  requireTLS: true,
  tls: {
    minVersion: 'TLSv1.2',
  },
  auth: {
    user: env.emailUser,
    pass: env.emailPass,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP verification failed:', error.message)
    return
  }
  if (success) {
    console.log(`SMTP ready: ${env.smtpHost}:${env.smtpPort}`)
  }
})

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!env.emailUser || !env.emailPass) {
      console.warn('⚠️ Missing EMAIL_USER or EMAIL_PASS. Email not sent.');
      console.log(`[SIMULATED EMAIL] To: ${to} | Subject: ${subject}\n${html}`);
      return;
    }
    await transporter.verify();
    const mailOptions = {
      from:
        env.emailFrom ||
        `"Everest Encounter Treks" <${env.emailUser}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return true
  } catch (error) {
    console.error('Error sending email:', error);
    throw error
  }
};
