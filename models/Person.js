const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: {
    type: String
  },
  joiningDate: {
    type: String
  },
  designation: {
    type: String
  },
  guest: {
   type:String
  },
  mobile: {
    type: String
  },
  address: {
    type: String
  },
  state: {
    type: String
  },
  pinCode: {
    type: String
  },
  emailId: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  value: {
    type: String
  },
  remarks: {
    type: String
  },
  salary: {
    type: String
  },
  duration: {
    type: String
  },
  beneficiary: {
    type: String
  },
  bankName: {
    type: String
  },
  acNo: {
    type: String
  },
  abaNo: {
    type: String
  },
  branch: {
    type: String
  },

  documents:[ {
    name:{
      type: String
    },
    format:{
      type: String
    },
    size: {
      type: String
    },
    url:{
      type: String
    },
    public_id:{
      type: String
    }
  }],
  userImage: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Person = mongoose.model("myPerson", PersonSchema);

// if (req.body.name) newPerson.name = req.body.name;
// if (req.body.designation)
//   newPerson.designation = req.body.designation;
// if (req.body.contactNumber)
//   newPerson.contactNumber = req.body.contactNumber;
// if (req.body.address) newPerson.address = req.body.address;

// if (req.body.state) newPerson.state = req.body.state;
// if (req.body.pinCode) newPerson.pinCode = req.body.pinCode;
// if (req.body.emailId) newPerson.emailId = req.body.emailId;
// if (req.body.password) newPerson.password = req.body.password;
// if (req.body.password) newPerson.value = req.body.password;
// if (req.body.remarks) newPerson.remarks = req.body.remarks;
// if (req.body.salary) newPerson.salary = req.body.salary;
// if (req.body.duration) newPerson.duration = req.body.duration;
// if (req.body.beneficiaryName)
//   newPerson.beneficiaryName = req.body.beneficiaryName;
// if (req.body.bankName) newPerson.bankName = req.body.bankName;
// if (req.body.bankAccountNumber)
//   newPerson.bankAccountNumber = req.body.bankAccountNumber;
// if (req.body.abaNumber) newPerson.abaNumber = req.body.abaNumber;

// if (req.body.branchAddress)
//   newPerson.branchAddress = req.body.branchAddress;
