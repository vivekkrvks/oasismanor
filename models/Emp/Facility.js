const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacilitiesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  facility: {
      type: String
  },
  price: {
    type: String,
    default: ""
},

  remarks: {
    type: String
  },currentdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Facilities = mongoose.model(
  "myfacility",
  FacilitiesSchema
);
