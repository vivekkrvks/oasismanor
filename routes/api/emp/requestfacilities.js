const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");

//Load Person Model
const Person = require("../../../models/Person");

//Load RequestFacilities.js Model
const RequestFacilities = require("../../../models/Emp/RequestFacilities");

// @type    POST
//@route    /api/emp/requestfacilities/
// @desc    route for SAVING data for requestfacilities
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const requestFacilitiesValues = {
      

    };
    requestFacilitiesValues.user = req.user.id;
    requestFacilitiesValues.name = req.user.name;
    requestFacilitiesValues.date = req.body.date;
    requestFacilitiesValues.voucherNo = req.body.voucherNo;
    requestFacilitiesValues.total = req.body.total;


    requestFacilitiesValues.facilities = req.body.facilities;
    requestFacilitiesValues.designation = req.user.designation;



    requestFacilitiesValues.visualToFamily = req.body.visualToFamily;
    requestFacilitiesValues.refNo = req.body.refNo;
    requestFacilitiesValues.document = req.body.document;


    requestFacilitiesValues.paid = req.body.paid;
    requestFacilitiesValues.remarks = req.body.remarks;


   




    //getting last voucher number and making new one

    let vNo;
    const data = await RequestFacilities.find({}).sort({
        voucherNo: -1
    });
    if (data.length === 0) {
      vNo = 1;
      requestFacilitiesValues.voucherNo = Number(vNo);
    } else {
      vNo = Number(data[0].voucherNo) + 1;
      requestFacilitiesValues.voucherNo = vNo;
    }

    //Do database stuff
    RequestFacilities.findOne({ user: req.user.id })
      .then(requestfacilities => {
        if (requestfacilities) {
          RequestFacilities.findOne({
            voucherNo: requestFacilitiesValues.voucherNo
          })
            .then(requestfacilities => {
              //Username already exists
              if (requestfacilities) {
                res.json({
                  message: "Voucher Number Already exist ",
                  variant: "error"
                });
              } else {
                //save user
                new RequestFacilities(requestFacilitiesValues)
                  .save()
                  .then(
                    res.json({
                      message: "Successfully saved",
                      variant: "success"
                    })
                  )
                  .catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
        } else {
          new RequestFacilities(requestFacilitiesValues)
            .save()
            .then(
              res.json({
                message: "Congo !! Your First facilities is saved",
                variant: "success"
              })
            )
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching requestfacilities" + err));
  }
);

// @type    GET
//@route    /api/emp/requestfacilities/all
// @desc    route for getting all data from  requestfacilities
// @access  PRIVATE
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2) {
        RequestFacilities.find({})
        .sort({ voucherNo: -1 })
        .then(RequestFacilities => res.json(RequestFacilities))
        .catch(err =>
          res
            .status(404)
            .json({ message: "No facilities Found", variant: "error" })
        );
    } else {
      RequestFacilities.find({user:req.user._id})
      .sort({ voucherNo: -1 })
      .then(RequestFacilities => res.json(RequestFacilities))
      .catch(err =>
        res
          .status(404)
          .json({ message: "No facilities Found", variant: "error" })
      );
    }

  
  }
);
// @type    GET
//@route    /api/emp/requestfacilities/all/:searchfacilities
// @desc    route for searching of facilities from searchbox using any text
// @access  PRIVATE
router.get(
  "/all/:searchfacilities",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2) {
      const search = req.params.searchfacilities;
      if (isNaN(search)) {
        RequestFacilities.find({
          "ledger.label": new RegExp(search, "i")
        }).then(RequestFacilities => res.json(RequestFacilities));
      } else {
        RequestFacilities.find({
          voucherNo: search
        }).then(RequestFacilities => res.json(RequestFacilities));
      }
    } else {
      RequestFacilities.find({user:req.user._id,})
      .then(RequestFacilitiesResult => {
        if (RequestFacilitiesResult) {
          const search = req.params.searchfacilities;
      if (isNaN(search)) {
        RequestFacilities.find({
          "ledger.label": new RegExp(search, "i")
        }).then(RequestFacilities => res.json(RequestFacilities));
      } else {
        RequestFacilities.find({
          voucherNo: search
        }).then(RequestFacilities => res.json(RequestFacilities));
      }

    

        }})
    }

 
  }
);

// @type    get
//@route    /api/emp/requestfacilities/get/:id
// @desc    route to get single requestfacilities by id
// @access  PRIVATE
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";
    if (des == des1 || des == des2) {
        RequestFacilities.find({
            _id: req.params.id
          }).then(RequestFacilities => res.json(RequestFacilities));
    } else {
        RequestFacilities.find({user:req.user._id}) .then(requestfacilities => {
            if (requestfacilities){
                RequestFacilities.find({
                    _id: req.params.id
                  }).then(RequestFacilities => res.json(RequestFacilities));
            } else {
                res.json({
                    message: "You are not authorised ",
                    variant: "error"
                  });
            }
        })

    
    }


  }
);

// @type    POST
//@route    /api/emp/requestfacilities/:id
// @desc    route to update/edit requestfacilities
// @access  PRIVATE

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const requestFacilitiesValues = {
      

      };
      requestFacilitiesValues.user = req.user.id;
      requestFacilitiesValues.date = req.body.date;
      requestFacilitiesValues.total = req.body.total;
      requestFacilitiesValues.voucherNo = req.body.voucherNo;
  
      requestFacilitiesValues.facilities = req.body.facilities;
      requestFacilitiesValues.designation = req.user.designation;


  
      requestFacilitiesValues.visualToFamily = req.body.visualToFamily;
      requestFacilitiesValues.refNo = req.body.refNo;
      requestFacilitiesValues.document = req.body.document;
  
  
      requestFacilitiesValues.paid = req.body.paid;
      requestFacilitiesValues.remarks = req.body.remarks;
  
  

    RequestFacilities.findOneAndUpdate(
      { _id: req.params.id },
      { $set: requestFacilitiesValues },
      { new: true }
    )

      .then(() =>
        res.json({ message: "Updated successfully!!", variant: "success" })
      )

      .catch(err =>
        console.log("Problem in updating requestfacilities value" + err)
      );
  }
);



// @type    POST
//@route    /api/emp/requestfacilities/deletefacilities/:id
// @desc    route for personnal user requestfacilities
// @access  PRIVATE

router.delete(
  "/deletefacilities/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.params.id;
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";
    if (des == des1 || des == des2) {
      
    RequestFacilities.findOne({ _id: id }).then(RequestFacilitiesResult => {
        if (RequestFacilitiesResult) {
          RequestFacilities.findOneAndDelete({ _id: id })
            .then(() =>
              res.json({ message: "Deleted successfully", variant: "success" })
            )
            .catch(err =>
              res.json("Failed to delete due to this error - " + err)
            );
        } else {
          res
            .status(400)
            .json({ message: "facilities Not Found", variant: "error" });
        }
      });
    } else {
        RequestFacilities.find({user:req.user._id}) .then(requestfacilities => {
            if (requestfacilities){
               
    RequestFacilities.findOne({ _id: id }).then(RequestFacilitiesResult => {
        if (RequestFacilitiesResult) {
          RequestFacilities.findOneAndDelete({ _id: id })
            .then(() =>
              res.json({ message: "Deleted successfully", variant: "success" })
            )
            .catch(err =>
              res.json("Failed to delete due to this error - " + err)
            );
        } else {
          res
            .status(400)
            .json({ message: "facilities Not Found", variant: "error" });
        }
      });
            } else {
                res.json({
                    message: "You are not authorised ",
                    variant: "error"
                  });
            }
        })

    
    }



  }
);

module.exports = router;
