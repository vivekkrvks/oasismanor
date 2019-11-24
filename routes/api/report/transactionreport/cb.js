const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

//Load Person Model
const Person = require("../../../../models/Person");

//Load Transaction model
const ReceiptVoucher = require("../../../../models/Transaction/ReceiptVoucher");
const PaymentVoucher = require("../../../../models/Transaction/PaymentVoucher");
const RequestFacilities = require("../../../../models/Emp/RequestFacilities");
const UploadUtility = require("../../../../models/Emp/UploadUtility");
let fCurrentBal;
async function getCurrentBal(res, value) {
  let totalReciptAmount = 0;
  let totalReciptDiscount = 0;
  let totalPaymentAmount = 0;
  let totalPaymentDiscount = 0;
  let salary = 5;
  let duration;
  let designation;
  let joiningDate;
  let facilityCharge = 0;
  await ReceiptVoucher.find({
    "ledger.value": value
  }).then(ReceiptVoucher => {
    ReceiptVoucher.forEach(one => {
      totalReciptAmount += parseFloat((one.amount = one.amount || 0));
      totalReciptDiscount += parseFloat((one.discount = one.discount || 0));
    });
  }).catch(err => console.log(err));
//n


  await Person.findOne({
     _id: value 
  }).then(Person => {

    if (Person) {
      salary = parseFloat((Person.salary = Person.salary || 0));
      duration = Person.duration;
      joiningDate = Person.joiningDate;
      designation = Person.designation;
    } else {
      console.log("Given id is not associated with any profile");
      
    }  
     
   
  }).catch(err => console.log(err));
  //n

 await RequestFacilities.find({
   user: value,
   paid: "false"
  }).then(RequestFacilities => {
  RequestFacilities.forEach(one => {
    facilityCharge += parseFloat((one.total = one.total || 0));

  })
 }).catch(err => console.log(err));
//n
  await PaymentVoucher.find({
    "ledger.value": value
  })
    .then(PaymentVoucher => {
      PaymentVoucher.forEach(one => {
        totalPaymentAmount += parseFloat((one.amount = one.amount || 0));
        totalPaymentDiscount += parseFloat((one.discount = one.discount || 0));
      });
      
     if(typeof(joiningDate) != "undefined"){
      var q = new Date();
var m = q.getMonth() + 1;
var d = q.getDate();
var y = q.getFullYear();
var ys = joiningDate.slice(0,4);
var ms = joiningDate.slice(5,7);
var ds = joiningDate.slice(8,10);
var yt = y - ys;
if (d>= ds) {
  var mt = m - ms;
} else {
  var mt = m - ms -1;
}
var totalMonth = ((yt * 12 ) + mt);
var t = yt

if(totalMonth <=0 ){var totalPay = 0}else if (duration == "Monthly"){
 var totalPay = totalMonth * salary
} else {
 var totalPay = 0
}
} else {
  var totalPay = 0
}

      // console.log(  "tt"+ totalMonth + salary + " totalReciptAmount: " + totalReciptAmount  +", totalPaymentAmount = " + totalPaymentAmount + ", totalPay:  "+  totalPay + ",  fc:  " + facilityCharge) 

 //json responce
 if(designation == "Guest" ){
 const credit = (totalReciptAmount + totalReciptDiscount).toFixed(2);
 const debit = (totalPaymentAmount + totalPaymentDiscount + totalPay +facilityCharge ).toFixed(2);
 let currentBalance = credit - debit;

 //cr -dr
 currentBalance <= 0
   ? (fCurrentBal = -currentBalance + " DR")
   : (fCurrentBal = currentBalance + " CR");

} else {
  const credit = (totalReciptAmount + totalReciptDiscount+ totalPay).toFixed(2);
  const debit = (totalPaymentAmount + totalPaymentDiscount  +facilityCharge ).toFixed(2);

  let currentBalance = credit - debit;

      //cr -dr
      currentBalance <= 0
        ? (fCurrentBal = -currentBalance + " DR")
        : (fCurrentBal = currentBalance + " CR");
 }
 
    })
    .catch(err =>
      res.status(404).json({
        message: "Error is : " + err
      })
    );
}

// @type    get
//@route    /api/report/transactionreport/cb/get/:id
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE

router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";
    var uId = req.user._id;
    const id = req.params.id;
if (uId == id){
  const id = req.params.id;
  Person.findOne({ _id: id }).then(personResult => {
    if (personResult) {
      getCurrentBal(res, id).then(() => {
        res.json("Current balance : $ " + fCurrentBal);
      }).catch(err => console.log(err));;
    } else {
      console.log("Given id is not associated with any profile");
    }
  });
}    
  else  if (des == des1 || des == des2) {
    const id = req.params.id;
    Person.findOne({ _id: id }).then(personResult => {
      if (personResult) {
        getCurrentBal(res, id).then(() => {
          res.json("Current balance : $ " + fCurrentBal);
        }).catch(err => console.log(err));;
      } else {
        console.log("Given id is not associated with any profile");
      }
    });
  }else {
    res.json(
      "You are not authorised "
      
    );
  }

  }
);

module.exports = router;
