const express = require("express");
const router = express.Router();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

const Room = require("./../../../models/Other/Room");

// @type    POST
//@route    /api/other/room
// @desc    route for sending email from user to admin
// @access  PUBLIC

router.post("/", (req, res) => {
  const adminmailId = "vivek.ec.soe.cusat@gmail.com";
  const name = req.body.name;
  const email = req.body.email;
  const mobileNo = req.body.mobile;
  const address = req.body.address;
  const formType = req.body.formType;
  const sub = `New ${formType} Request From`;
  const subject = ` ${sub} : "${name}" , Mobile No.: ${mobileNo}`;

  const message = `You have Received New ${formType} Request, With Following Details :- "
  "
   Name: ${name},"
   "
  \n Mobile No. ${mobileNo},"
   "
  \n EmailId : ${req.body.email},
   Address : ${address},
   Subject : ${req.body.subject},
   Message : ${req.body.message}
  `;

  const roomValues = {};
  roomValues.name = req.body.name;
  roomValues.email = req.body.email;
  roomValues.mobile = req.body.mobile;
  roomValues.remarks = req.body.remarks;
  roomValues.subject = req.body.subject;
  roomValues.message = req.body.message;
  roomValues.formType = req.body.formType;
  roomValues.address = req.body.address;

  Room.findOne({
    email: roomValues.email
  }).then(() => {
    new Room(roomValues)
      .save()
      .then(() =>
        res.json("Thanks for contacting us. We will get back to you shortly.")
      )
      .catch(err => console.log(err));
  });

  const msg = {
    to: adminmailId,
    from: email,
    subject: subject,
    text: message,
    html: "<strong>" + message + "</strong>"
  };
  let r = "";
  const f1 = () => {
    r = sgMail.send(msg);
  };
  Promise.all[f1()];
});

module.exports = router;
