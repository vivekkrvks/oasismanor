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
let datasets = [];
let data = [];
let lebel = [];
let familyNo = 0;
let AdminNo = 0;
let GuestNo = 0;
let WorkerNo = 0;
let ManagerNo = 0;
let finData;
async function getUserNum(res, value) {
 
  
  await Person.find({
    designation: "Family"
  }).then(ReceiptVoucher => {
    familyNo = Person.length
  }).catch(err => console.log(err));
//n

await Person.find({
    designation: "Admin"
  }).then(Admin => {

    AdminNo = Admin.length;
     
   
  }).catch(err => console.log(err));
  //n

  await Person.find({
    designation: "Guest"
  }).then(Guest => {

    GuestNo = Guest.length;
     
   
  }).catch(err => console.log(err));
  //n

 await Person.find({
    designation: "Worker"
  }).then(Worker => {
    WorkerNo = Worker.length
 }).catch(err => console.log(err));
//n
  await Person.find({
    designation: "Manager"
  })
    .then(Manager => {
        ManagerNo = Manager.length;
       
datasets = [AdminNo,ManagerNo,WorkerNo,GuestNo,familyNo];

finData = {
  labels: ["Admin", "Manager", "Staff", "Guest", "Family"],
    datasets: [
      {
        data: datasets,
        backgroundColor: ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)", "rgba(75, 192, 192, 0.8)", "rgba(153, 102, 255, 0.8)", "rgba(255, 159, 64, 0.8)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1
      }
    ]
};


    })
    .catch(err => console.log(err));
}

// @type    get
//@route    /api/report/chart/userchart/get/
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE

//bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
router.get(
  "/get/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";
    var uId = req.user._id;
   

  if (des == des1 || des == des2) {
    
    Person.findOne({ }).then(personResult => {
      if (personResult) {
        var id = 50;
        getUserNum(res, id).then(() => {
          res.json( finData);
        }).catch(err => console.log(err));;
      } else {
        console.log("no profile is there");
      }
    });
  }else {
    res.json(
      "You are not authorised "
      
    );
  }

  }
);
//bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb

module.exports = router;
