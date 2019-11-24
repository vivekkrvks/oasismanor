const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

//Load Person Model
const Person = require("../../../../models/Person");

//Load Transaction model
const PaymentVoucher = require("../../../../models/Transaction/PaymentVoucher");
const ReceiptVoucher = require("../../../../models/Transaction/ReceiptVoucher");
const UploadUtility = require("../../../../models/Emp/UploadUtility");

let finData;

let resultArray = [];
let resultArray1 = [];
let resultArray2 = [];
      
  
async function myasyfun(res, value) {

  


    var i = 29;
    while (i >=0 ) {
      let totalReciptAmount = 0;
      let totalReciptDiscount = 0;
      let totalPaymentAmount = 0;
      let totalPaymentDiscount = 0;
      let salary = 5;
      let duration;
      let joiningDate;
      let facilityCharge = 0;

      var today = new Date()
      var priorDate = new Date().setDate(today.getDate()-i)
     var lastDate = new Date(priorDate)
     var pyear = lastDate.getFullYear()

     var pmonth = lastDate.getMonth() + 1
     var pdate = lastDate.getDate()
    //  console.log( " a " + lastDate + "  b" + pmonth+ "  c " + pdate + "  d" + pyear)
     var cDate = pyear+"-" + pmonth+"-" + pdate
   
     //nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn

     await UploadUtility.find({
      date : cDate
      }).then(UploadUtility => {
        UploadUtility.forEach(one => {
        facilityCharge += parseFloat((one.amount = one.amount  || 0));
    
      })
     }).catch(err => console.log(err));

     await ReceiptVoucher.find({
        date : cDate
    }).then(ReceiptVoucher => {
      ReceiptVoucher.forEach(one => {
        totalReciptAmount += parseFloat((one.amount = one.amount || 0));
        totalReciptDiscount += parseFloat((one.discount = one.discount || 0));
      });
    }).catch(err => console.log(err));
  //n
  
  
  
    //n
  
  //n
    await PaymentVoucher.find({
      date : cDate
    })
      .then(PaymentVoucher => {
        PaymentVoucher.forEach(one => {
          totalPaymentAmount += parseFloat((one.amount = one.amount || 0));
          totalPaymentDiscount += parseFloat((one.discount = one.discount || 0));
         })  
         }).catch(err => console.log(err));
  
    //nn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
    resultArray2[29-i] = pdate+"/"+pmonth
     
    resultArray[29 -i] = ""+ parseFloat(totalReciptAmount + totalReciptDiscount) + ""
  resultArray1[29-i] = "" + parseFloat(facilityCharge + totalPaymentDiscount + totalPaymentAmount) + " "
  // //nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
      
  
  //     let Room2 = await Room.find({
  //       formType: "Seat enquiry"
      
  //     }).catch(err => console.log(err));
  
  //     Room2.forEach(one => {
       
  //       let obj = { };
  //       var str = one.currentdate;
  //       var res = str.toLocaleDateString();
  //       console.log(str 
  //           + "split " + res)
  //       obj.k = res.split("/").reverse().join("-");
  //       obj.date = res;
  //       obj.name = one.name;
  //       obj.email = one.email;
  //       obj.phoneNo = one.mobile;
     
  //       obj.subject = "Seat Enquiry;"
  //       obj.message = one.address;

      
       
  //       resultArray.push(obj);
        
  //     });
  
  //     resultArray1 = bubbleSort(res, resultArray);
  //     res.json(resultArray1);
  i--;
    }
    
    // console.log(resultArray)
  }
    // @type    get
// @route    /api/report/chart/incexp/get

  //bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
  router.get(
    "/get/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
     
        var des = req.user.designation;
        var des1 = "Admin";
        var des2 = "Manager";
      if (des == des1 || des == des2){
        myasyfun(res, "id").then(() => {
        finData = {
          labels: resultArray2,
          datasets: [
            {
              label: "Income",
              data: resultArray,
              backgroundColor: ["rgba(255, 99, 132, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(255, 206, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(255, 159, 64, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(255, 206, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(255, 159, 64, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(255, 206, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(255, 159, 64, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(255, 206, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(255, 159, 64, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(255, 206, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(255, 159, 64, 0.4)"],
              borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)","rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)","rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)","rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)","rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
              borderWidth: 1
            },
            {
              label: "Expanse",
              data: resultArray1,
              backgroundColor: ["rgba(65, 130, 234, 0.2)", "rgba(45, 110, 135, 0.2)", "rgba(105, 206, 76, 0.2)", "rgba(15, 122, 292, 0.2)", "rgba(123, 122, 225, 0.2)", "rgba(205, 109, 64, 0.2)","rgba(65, 130, 234, 0.2)", "rgba(45, 110, 135, 0.2)", "rgba(105, 206, 76, 0.2)", "rgba(15, 122, 292, 0.2)", "rgba(123, 122, 225, 0.2)", "rgba(205, 109, 64, 0.2)","rgba(65, 130, 234, 0.2)", "rgba(45, 110, 135, 0.2)", "rgba(105, 206, 76, 0.2)", "rgba(15, 122, 292, 0.2)", "rgba(123, 122, 225, 0.2)", "rgba(205, 109, 64, 0.2)","rgba(65, 130, 234, 0.2)", "rgba(45, 110, 135, 0.2)", "rgba(105, 206, 76, 0.2)", "rgba(15, 122, 292, 0.2)", "rgba(123, 122, 225, 0.2)", "rgba(205, 109, 64, 0.2)","rgba(65, 130, 234, 0.2)", "rgba(45, 110, 135, 0.2)", "rgba(105, 206, 76, 0.2)", "rgba(15, 122, 292, 0.2)", "rgba(123, 122, 225, 0.2)", "rgba(205, 109, 64, 0.2)"],
              borderColor: ["rgba(65, 130, 234, 1)", "rgba(5, 110, 135, 1)", "rgba(105, 206, 76, 1)", "rgba(15, 122, 292, 1)", "rgba(123, 122, 225, 1)", "rgba(205, 109, 64, 1)","rgba(65, 130, 234, 1)", "rgba(5, 110, 135, 1)", "rgba(105, 206, 76, 1)", "rgba(15, 122, 292, 1)", "rgba(123, 122, 225, 1)", "rgba(205, 109, 64, 1)","rgba(65, 130, 234, 1)", "rgba(5, 110, 135, 1)", "rgba(105, 206, 76, 1)", "rgba(15, 122, 292, 1)", "rgba(123, 122, 225, 1)", "rgba(205, 109, 64, 1)","rgba(65, 130, 234, 1)", "rgba(5, 110, 135, 1)", "rgba(105, 206, 76, 1)", "rgba(15, 122, 292, 1)", "rgba(123, 122, 225, 1)", "rgba(205, 109, 64, 1)","rgba(65, 130, 234, 1)", "rgba(5, 110, 135, 1)", "rgba(105, 206, 76, 1)", "rgba(15, 122, 292, 1)", "rgba(123, 122, 225, 1)", "rgba(205, 109, 64, 1)"],
              borderWidth: 1
            }
          ]
        }
        res.json(
    
    finData
    
          
        )
      }).catch(err => console.log(err));;
    }else {
      res.json({
        message: "You are not authorised ",
        variant: "error"
      });
    }
  
      }
    );
    //bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
  // function bubbleSort(res, a) {
  //   var swapped;
  //   do {
  //     swapped = false;
  //     for (var i = 0; i < a.length - 1; i++) {
  //       if (new Date(a[i].k) > new Date(a[i + 1].k)) {
  //         var temp = a[i];
  //         a[i] = a[i + 1];
  //         a[i + 1] = temp;
  //         swapped = true;
  //       }
  //     }
  //   } while (swapped);
  //   return a;
  // }
   
  module.exports = router;

  