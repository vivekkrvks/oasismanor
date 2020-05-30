const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  message: {
    type: String
  },
  address: {
    type: String
  },
  remarks: {
    type: String
  },
  formType: {
    type: String,
    required: true
  },
  dateC: {
    type: String,
    default: getDate()
  },
  monthC: {
    type: Number,
    default: getMonth()
  },
  yearC: {
    type: Number,
    default: getYear()
  },
  currentdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Room = mongoose.model("myroom", RoomSchema);

function getDate() {
  var d = new Date();
  return d.getDate();
}

function getMonth() {
  var d = new Date();
  var month = new Array();
  month[0] = "01";
  month[1] = "02";
  month[2] = "03";
  month[3] = "04";
  month[4] = "05";
  month[5] = "06";
  month[6] = "07";
  month[7] = "08";
  month[8] = "09";
  month[9] = "10";
  month[10] = "11";
  month[11] = "12";
  return month[d.getMonth()];
}

function getYear() {
  var d = new Date();
  return d.getFullYear();
}
