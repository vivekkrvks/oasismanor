const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");

//Load Person Model
const Person = require("../../../models/Person");

//Load UploadUtility.js Model
const UploadUtility = require("../../../models/Emp/UploadUtility");

// @type    POST
//@route    /api/emp/uploadutility/
// @desc    route for SAVING data for uploadutility
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const uploadUtilityValues = {
      ledger: {},

      utility: {}
    };
    uploadUtilityValues.user = req.user.id;
    uploadUtilityValues.name = req.user.name;
    uploadUtilityValues.date = req.body.date;


    uploadUtilityValues.utility.label = req.body.utility.label;
    uploadUtilityValues.utility.utilityId = req.body.utility.utilityId;
    uploadUtilityValues.utility.value = req.body.utility.value;

    uploadUtilityValues.ledger.label = req.body.ledger.label;
    uploadUtilityValues.ledger.ledgerId = req.body.ledger.ledgerId;
    uploadUtilityValues.ledger.value = req.body.ledger.value;

    uploadUtilityValues.amount = req.body.amount;
    uploadUtilityValues.refNo = req.body.refNo;
    uploadUtilityValues.document = req.body.document;


   

    uploadUtilityValues.viaBank = req.body.viaBank;

    uploadUtilityValues.remarks = req.body.remarks;

    uploadUtilityValues.process = req.body.process;

    //getting last voucher number and making new one

    let vNo;
    const data = await UploadUtility.find({}).sort({
        voucherNo: -1
    });
    if (data.length === 0) {
      vNo = 1;
      uploadUtilityValues.voucherNo = Number(vNo);
    } else {
      vNo = Number(data[0].voucherNo) + 1;
      uploadUtilityValues.voucherNo = vNo;
    }

    //Do database stuff
    UploadUtility.findOne({ user: req.user.id })
      .then(Uploadutility => {
        if (Uploadutility) {
          UploadUtility.findOne({
            voucherNo: uploadUtilityValues.voucherNo
          })
            .then(uploadutility => {
              //Username already exists
              if (uploadutility) {
                res.json({
                  message: "Voucher Number Already exist ",
                  variant: "error"
                });
              } else {
                //save user
                new UploadUtility(uploadUtilityValues)
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
          new UploadUtility(uploadUtilityValues)
            .save()
            .then(
              res.json({
                message: "Congo !! Your First utility is saved",
                variant: "success"
              })
            )
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching uploadutility" + err));
  }
);

// @type    GET
//@route    /api/emp/uploadutility/allutility
// @desc    route for getting all data from  uploadutility
// @access  PRIVATE
router.get(
  "/allutility",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2) {
        UploadUtility.find({})
        .sort({ voucherNo: -1 })
        .then(UploadUtility => res.json(UploadUtility))
        .catch(err =>
          res
            .status(404)
            .json({ message: "No Utility Found", variant: "error" })
        );
    } else {
      UploadUtility.find({user:req.user._id})
      .sort({ voucherNo: -1 })
      .then(UploadUtility => res.json(UploadUtility))
      .catch(err =>
        res
          .status(404)
          .json({ message: "No Utility Found", variant: "error" })
      );
    }

  
  }
);
// @type    GET
//@route    /api/emp/uploadutility/allutility/:searchutility
// @desc    route for searching of utility from searchbox using any text
// @access  PRIVATE
router.get(
  "/allutility/:searchutility",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2) {
      const search = req.params.searchutility;
      if (isNaN(search)) {
        UploadUtility.find({
          "utility.label": new RegExp(search, "i")
        }).then(UploadUtility => res.json(UploadUtility));
      } else {
        UploadUtility.find({
          voucherNo: search
        }).then(UploadUtility => res.json(UploadUtility));
      }
    } else {
      UploadUtility.find({user:req.user._id,})
      .then(UploadUtilityResult => {
        if (UploadUtilityResult) {
          const search = req.params.searchutility;
      if (isNaN(search)) {
        UploadUtility.find({
          "utility.label": new RegExp(search, "i")
        }).then(UploadUtility => res.json(UploadUtility));
      } else {
        UploadUtility.find({
          voucherNo: search
        }).then(UploadUtility => res.json(UploadUtility));
      }

    

        }})
    }

 
  }
);

// @type    get
//@route    /api/emp/uploadutility/get/:id
// @desc    route to get single uploadutility by id
// @access  PRIVATE
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2) {
        UploadUtility.find({
            _id: req.params.id
          }).then(UploadUtility => res.json(UploadUtility));
    } else {
      res.json({
        message: "You are not authorised ",
        variant: "error"
      });
    }


  }
);

// @type    POST
//@route    /api/emp/uploadutility/:id
// @desc    route to update/edit uploadutility
// @access  PRIVATE

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const uploadUtilityValues = {
        ledger: {},
  
        utility: {}
      };
      uploadUtilityValues.user = req.user.id;
    uploadUtilityValues.name = req.user.name;

      uploadUtilityValues.date = req.body.date;
  
      uploadUtilityValues.utility.label = req.body.utility.label;
      uploadUtilityValues.utility.utilityId = req.body.utility.utilityId;
      uploadUtilityValues.utility.value = req.body.utility.value;
  
      uploadUtilityValues.ledger.label = req.body.ledger.label;
      uploadUtilityValues.ledger.ledgerId = req.body.ledger.ledgerId;
      uploadUtilityValues.ledger.value = req.body.ledger.value;
  
      uploadUtilityValues.amount = req.body.amount;
      uploadUtilityValues.document = req.body.document;
  
     
  
      uploadUtilityValues.viaBank = req.body.viaBank;
  
      uploadUtilityValues.remarks = req.body.remarks;
  
      uploadUtilityValues.process = req.body.process;
      uploadUtilityValues.refNo = req.body.refNo;

    UploadUtility.findOneAndUpdate(
      { _id: req.params.id },
      { $set: uploadUtilityValues },
      { new: true }
    )

      .then(() =>
        res.json({ message: "Updated successfully!!", variant: "success" })
      )

      .catch(err =>
        console.log("Problem in updating uploadutility value" + err)
      );
  }
);



// @type    POST
//@route    /api/emp/uploadutility/deleteutility/:id
// @desc    route for personnal user uploadutility
// @access  PRIVATE

router.delete(
  "/deleteutility/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.params.id;
    UploadUtility.findOne({ _id: id }).then(UploadUtilityResult => {
      if (UploadUtilityResult) {
        UploadUtility.findOneAndDelete({ _id: id })
          .then(() =>
            res.json({ message: "Deleted successfully", variant: "success" })
          )
          .catch(err =>
            res.json("Failed to delete due to this error - " + err)
          );
      } else {
        res
          .status(400)
          .json({ message: "Utility Not Found", variant: "error" });
      }
    });
  }
);

module.exports = router;
