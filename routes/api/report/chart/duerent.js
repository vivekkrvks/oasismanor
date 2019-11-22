const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

//Load Person Model
const Person = require("../../../../models/Person");

//Load Transaction model
const ReceiptVoucher = require("../../../../models/Transaction/ReceiptVoucher");
const RequestFacilities = require("../../../../models/Emp/RequestFacilities");
let finData;


async function fduerent(res, value) {
  let totalReciptAmount = 0;
  let totalReciptDiscount = 0;


  let salary = 5;
  let joiningDate;
  let facilityCharge = 0;
  await ReceiptVoucher.find({
    designation: "Guest"

  }).then(ReceiptVoucher => {
    ReceiptVoucher.forEach(one => {
      totalReciptAmount += parseFloat((one.amount = one.amount || 0));
      totalReciptDiscount += parseFloat((one.discount = one.discount || 0));
    });
  }).catch(err => console.log(err));
//n


  await Person.find({
     designation: "Guest"
  }).then(Person => {
      Person.forEach(one => {
          salary += parseFloat((one.salary = one.salary || 0));
      });

  
     
   
  }).catch(err => console.log(err));
  //n

 await RequestFacilities.find({
    designation: "Guest"
  }).then(RequestFacilities => {
  RequestFacilities.forEach(one => {
    facilityCharge += parseFloat((one.total = one.total || 0));

  });

     if(joiningDate > 0){
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


if(mt <=0 ){var totalPay = 0}else{
 var totalPay = totalMonth * salary
} 
} else {
  var totalPay = 0
}

      // console.log( " totalReciptAmount: " + totalReciptAmount  +", totalPaymentAmount = " + totalPaymentAmount + ", totalPay:  "+  totalPay + ",  fc:  " + facilityCharge) ;

 //json responce
 
  const credit = (totalReciptAmount + totalReciptDiscount).toFixed(2);
 const  debit = ( totalPay +facilityCharge ).toFixed(2);

      
    })
    .catch(err =>
      res.status(404).json({
        message: "No Receipt Voucher Found" + err
      })
    );
}

// @type    get
//@route    /api/report/chart/duerent/get/
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE

router.get(
  "/get/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";
   
  if (des == des1 || des == des2) {
    fduerent(res, "id").then(() => {
        finData = {
            labels: [debit, credit],
            datasets: [
              {
                data: [2, 4],
                backgroundColor: ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                borderWidth: 1
              }
            ]
          }
        res.json(
    
    finData
    
          
        )
      }).catch(err => console.log(err));;
   
  }else {
    res.json(
      "You are not authorised "
      
    );
  }

  }
);

module.exports = router;
