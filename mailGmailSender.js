const nodemailer = require("nodemailer");
const secret = require("./secrets");
async function mailSender() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: secret.APP_EMAIL,
      pass: secret.APP_PASSWORD,
    },
  });

  let token = "GodOFThunder";
  let dataObj = {
    from: "Food-app",
    to: "gagansingh280898@gmail.com",
    subject: "Hello from app",
    html: `<h1>Hello from app with token ${token}</h1>`,
  };
  let info = await transporter.sendMail(dataObj);
}

mailSender()
  .then(function () {
    console.log("mail sent");
  })
  .catch(function (err) {
    console.log(err);
  });
