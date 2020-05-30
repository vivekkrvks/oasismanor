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


// @type    get
// @route    /api/report/transactionreport/alltransaction/get/:id
router.get(
    "/get/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      var des = req.user.designation;
      var des1 = "Admin";
      var des2 = "Manager";
      var uId = req.user._id;
      const id = req.params.id;
  if (uId == id || des == des1 || des == des2){

      let resultArray = [];
      let resultArray1 = [];
      const value = req.params.id;
     
  
      let paymentResult1 = await PaymentVoucher.find({
       
        "ledger.value": value
      }).catch(err => console.log(err));;
  
      paymentResult1.forEach(one => {
      
          let obj = { };
  
          obj.date = one.date.split("-").reverse().join("-");
          obj.k = one.date;
          obj.particulars = "Payment";
          obj.debit = "" + (parseFloat(one.amount) + parseFloat(one.discount))+ "";
          obj.credit = "";
       
          obj.naration = one.remarks;
  
        
         
          resultArray.push(obj);
        
      });
      //nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
 await Person.findOne({
       
        _id: value 
      }).then(Person => {

        if (Person) {
          salary = parseFloat((Person.salary = Person.salary || 0));
          duration = Person.duration;
          designation = Person.designation;
          joiningDate = Person.joiningDate;
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
var i = 0;

while (i<totalMonth) {

    let obj = { };

    ms ++ 
    if (ms == 13){
        ms = 01;
        ys++;
    } 

    if (ms <=9) {
        ts = "0"+ms
    } else {
        ts = ms
    }
    const monthNames = ["zero","January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
    obj.date =ds  + "-" + ts + "-" +ys ;
    obj.k =  ys+ "-" + ts + "-" +ds  ;
    
if (designation == "Guest") {
  obj.debit = "" +salary+"";
  obj.credit =  "";
  obj.particulars = "Rent";
   
  obj.naration = "Rent of " + monthNames[ms] +" "  + ys;
} else {
  obj.debit = ""; 
    obj.credit = "" +salary+"";
    obj.particulars = "Salary";
     
    obj.naration = "Salary of " + monthNames[ms] +" "  + ys;
}
    



    resultArray.push(obj);

    i++ 
  
   
  }

        } else {
          console.log("Given id is not associated with any profile");
          
        }  
         
       
      }).catch(err => console.log(err));
  
     
      
         
        
    
  //nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
  let RequestFacilities1 = await RequestFacilities.find({
       
    user: value,
    paid: "false"
  }).catch(err =>
    res.json({ message: "No request Voucher Found" + err })
  );

  RequestFacilities1.forEach(one => {
  
    let obj = { };
  
    obj.date = one.date.split("-").reverse().join("-");
    obj.particulars = "Extra Facility";
    obj.debit = one.total;
    obj.k = one.date;
    obj.credit = "";
 
    obj.naration = one.remarks;

  
   
    resultArray.push(obj);
    
  });

  //nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
      
  
      let receiptResult2 = await ReceiptVoucher.find({
        
        "ledger.value": value
      }).catch(err => console.log(err));
  
      receiptResult2.forEach(one => {
       
        let obj = { };
  
        obj.date = one.date.split("-").reverse().join("-");
        obj.k = one.date;
        obj.particulars = "Receipt";
        obj.debit = "";
        obj.credit = "" + (parseFloat(one.amount) + parseFloat(one.discount))+ "";
     
        obj.naration = one.remarks;

      
       
        resultArray.push(obj);
        
      });
  
      resultArray1 = bubbleSort(res, resultArray);
      res.json(resultArray1);
    }else {
      res.json({
        message: "You are not authorised ",
        variant: "error"
      });
    }
    }
  );
  
  function bubbleSort(res, a) {
    var swapped;
    do {
      swapped = false;
      for (var i = 0; i < a.length - 1; i++) {
        if (new Date(a[i].k) > new Date(a[i + 1].k)) {
          var temp = a[i];
          a[i] = a[i + 1];
          a[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
    return a;
    // a.forEach(one => {
    //   let obj = { ledger: {} };
    //   obj.id = one.id;
    //   if ((one.date = "")) {
    //     obj.date = "";
    //   } else if ((one.date = "")) {
    //     obj.date = "";
    //   } else {
    //     obj.date = one.date;
    //   }
  
    //   obj.voucherNumber = one.voucherNumber;
    //   obj.particulars = one.particulars;
    //   obj.details = one.details;
    //   obj.naration = one.naration;
  
    //   obj.debit = one.debit;
    //   obj.ledger = one.ledger;
    //   let resultArray1 = [];
    //   resultArray1.push(obj);
    //   return resultArray1;
    // });
  }
  module.exports = router;