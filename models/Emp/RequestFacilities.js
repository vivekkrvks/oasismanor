const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestFacilitySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  date: {
    type: String,
    required: true
  },
  designation: {
type: String
  },
  name: {
    type: String
  },
  voucherNo: {
    type: Number,
    required: true
  },
  facilities:[ {
    label: {
      type: String
    },
    price: {
      type: String,
      default: ""
    },
    utilityId: {
        type: String
    },
    value: {
      type: String
    }
  }],
  visualToFamily:{
    type: Boolean
  },
  refNo: {
    type: String
  },
  total: {
    type: String
  },
  document: {
    type: String,
    default:""
  },
  paid: {
    type: Boolean
  },
  remarks: {
    type: String
  },
 
  // payment voucher
 
 
 
  
 
  currentdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = RequestFacility = mongoose.model(
  "myRequestFacility",
  RequestFacilitySchema
);
