const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UploadUtilitySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
name: {
  type: String
},
  date: {
    type: String,
    required: true
  },
  voucherNo: {
    type: Number,
    required: true
  },
  document: {
    type: String
  },
  utility: {
    label: {
      type: String
    },

    value: {
      type: String
    }
  },
  ledger: {
    label: {
      type: String
    },

    value: {
      type: String
    }
  },

  amount: {
    type: String,
    required: true
  },
  refNo: {
    type: String
  },
  // payment voucher
  viaBank: {
    type: Boolean
  },
 
  remarks: {
    type: String
  },
  process: {
    type: Boolean
  },
  
 
 
  currentdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = UploadUtility = mongoose.model(
  "myuploadutility",
  UploadUtilitySchema
);
