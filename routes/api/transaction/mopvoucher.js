const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");

//Load Person Model
const Person = require("../../../models/Person");

//Load mopVoucher.js Model
const MopVoucher = require("../../../models/Transaction/MopVoucher");

// @type    POST
//@route    /api/transaction/mopvoucher/
// @desc    route for SAVING data for modeofpayment
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const mopVoucherValues = {};
    mopVoucherValues.user = req.user.id;

    mopVoucherValues.bankName = req.body.bankName;

    mopVoucherValues.beneficiary = req.body.beneficiary;
    mopVoucherValues.accountNo = req.body.accountNo;
    mopVoucherValues.abaNo = req.body.abaNo;
    mopVoucherValues.branch = req.body.branch;
    mopVoucherValues.remarks = req.body.remarks;

    //Do database stuff
    MopVoucher.findOne({ user: req.user.id })
      .then(mopVoucher => {
        if (mopVoucher) {
          MopVoucher.findOne({
            accountNo: mopVoucherValues.accountNo
          })
            .then(mopVoucher => {
              //Username already exists
              if (mopVoucher) {
                res.json({
                  message: "Account No. Already exist "
                });
              } else {
                //save user
                new MopVoucher(mopVoucherValues)
                  .save()
                  .then(
                    res.json({
                      message: "Successfully saved"
                    })
                  )
                  .catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
        } else {
          new MopVoucher(mopVoucherValues)
            .save()
            .then(
              res.json({
                message: "First payment method Successfully saved"
              })
            )
            .catch(err => console.log("hey" + err));
        }
      })
      .catch(err => console.log("Problem in fetching mopVoucher" + err));
  }
);

// @type    GET
//@route    /api/transaction/mopvoucher/all
// @desc    route for getting all data from  mopVoucher
// @access  PRIVATE
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    MopVoucher.find({})
      .sort({ currentdate: -1 })
      .then(MopVoucher => res.json(MopVoucher))
      .catch(err =>
        res.status(404).json({ message: "No Payment Method Found" })
      );
  }
);

// @type    POST
//@route    /api/transaction/mopVoucher/deletepayment/:id
// @desc    route for personnal user mopVoucher
// @access  PRIVATE

router.delete(
  "/deletepayment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.params.id;
    if ((id == "5d74a34681502b493497d8a5")) {
      res.json({ message: "You Can't Delete Cash Ledger" });
    } else{
    MopVoucher.findOne({ _id: id }).then(mopVoucherResult => {
   
          MopVoucher.findOneAndDelete({ _id: id })
            .then(() => res.json({ message: "Deleted successfully" }))
            .catch(err =>
              res.json("Failed to delete due to this error - " + err)
            );
        }
       
    )
  }
  }
);

module.exports = router;
