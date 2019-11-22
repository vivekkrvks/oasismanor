const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileUploadSchema = new Schema({
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
  currentdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = FileUpload = mongoose.model("fileupload", FileUploadSchema);
