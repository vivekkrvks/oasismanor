const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MopVoucherSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  bankName: {
    type: String
  },
  beneficiary: {
    type: String
  },
  accountNo: {
    type: String,
    required: true
  },
  abaNo: {
    type: String
  },
  branch: {
    type: String
  },
  remarks: {
    type: String
  },

  currentdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = MopVoucher = mongoose.model("mymopvoucher", MopVoucherSchema);
