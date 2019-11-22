const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  ownerName: {
    type: String
  },
  address: {
    type: String
  },
  secondryMobileNumber: {
    type: String
  },
  email: {
    type: String
  },
  districtName: {
    type: String
  },
  pin: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  //second stage
  varient: {
    type: String
  },
  periodOfLicense: {
    type: String
  },
  promocode: {
    type: String
  },
  referenceCode: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("myProfile", ProfileSchema);
