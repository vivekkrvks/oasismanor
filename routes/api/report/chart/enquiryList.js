const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

//Load Person Model
const Person = require("../../../../models/Person");

//Load Transaction model
const Room = require("../../../../models/Other/Room");



// @type    get
// @route    /api/report/chart/enquiryList/get
router.get(
    "/get/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      var des = req.user.designation;
      var des1 = "Admin";
      var des2 = "Manager";
  
     
  if (des == des1 || des == des2){

      let resultArray = [];
      let resultArray1 = [];
     
    //nn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
      let Room1 = await Room.find({
        formType: "contact"
      
    }).catch(err => console.log(err));

    Room1.forEach(one => {
     
      let obj = { };
      var str = one.currentdate;
      var res = str.toLocaleDateString();
      // console.log(str 
      //     + "split " + res)
      obj.k = res.split("/").reverse().join("-");
      obj.date = res;

      obj.name = one.name;
      obj.email = one.email;
      obj.phoneNo = one.mobile;
   
      obj.subject = "Contact";
      obj.message = one.message;

    
     
      resultArray.push(obj);
      
    });

  //nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
      
  
      let Room2 = await Room.find({
        formType: "Seat enquiry"
      
      }).catch(err => console.log(err));
  
      Room2.forEach(one => {
       
        let obj = { };
        var str = one.currentdate;
        var res = str.toLocaleDateString();
        // console.log(str 
        //     + "split " + res)
        obj.k = res.split("/").reverse().join("-");
        obj.date = res;
        obj.name = one.name;
        obj.email = one.email;
        obj.phoneNo = one.mobile;
     
        obj.subject = "Seat Enquiry;"
        obj.message = one.address;

      
       
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