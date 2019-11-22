const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentVoucherSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },

  amount: {
    type: String,
    required: true
  },
  designation: {
    type: String
  },

  // payment voucher
  paymentVoucherNumber: {
    type: Number,
    required: true
  },
  date: {
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
  ledger: {
    label: {
      type: String
    },

    value: {
      type: String
    }
  },

  modeOfPayment: {
    label: {
      type: String,
      default: "Cash"
    },
    value: {
      type: String,
      default: "Cash"
    }
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

module.exports = PaymentVoucher = mongoose.model(
  "mypayment",
  PaymentVoucherSchema
);

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
