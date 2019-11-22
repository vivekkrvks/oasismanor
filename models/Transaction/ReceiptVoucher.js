const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReceiptVoucherSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },

  amount: {
    type: String
  },
  //receipt Voucher
  receiptVoucherNumber: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  ledger: {
    label: {
      type: String
    },
    value: {
      type: String
    }
  },

  modeOfReceipt: {
    label: {
      type: String,
      default: "Cash"
    },
    value: {
      type: String,
      default: "Cash"
    }
  },
  designation: {
    type: String
  },
  discount: {
    type: String,
    default: "0"
  },
  remarks: {
    type: String
  },
  reminderDate: {
    type: String
  },
  currentdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = ReceiptVoucher = mongoose.model(
  "myreceipt",
  ReceiptVoucherSchema
);
