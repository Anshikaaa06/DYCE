const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL ||  "verla39@ethereal.email",
    pass: process.env.NODEMAILER_PWD || "rFFNCgAFrR1ZKXxP8V",
  },
});

const sender = {
  address: "verla39@ethereal.email",
  name: "Verla Von",
};

module.exports = {
  transporter,
  sender,
};
