const nodeMailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    })
  }
  async sendActivationLink(to, activationLink) {
    this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Approve authorization',
      text: '',
      html: `
        <div>
            <h1>Approve authorization</h1>
            <a href="${activationLink}">Click for approve</a>
        </div>
      `
    });
  }
}

module.exports = new EmailService();
