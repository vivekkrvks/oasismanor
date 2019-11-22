const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UtilitySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  utility: {
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

module.exports = Utility = mongoose.model(
  "myutility",
  UtilitySchema
);
