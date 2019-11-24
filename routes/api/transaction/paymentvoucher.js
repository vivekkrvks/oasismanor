const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");

//Load Person Model
const Person = require("../../../models/Person");

//Load PaymentVoucher.js Model
const PaymentVoucher = require("../../../models/Transaction/PaymentVoucher");

// @type    POST
//@route    /api/transaction/paymentvoucher/
// @desc    route for SAVING data for paymentvoucher
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const paymentVoucherValues = {
      ledger: {},

      modeOfPayment: {}
    };
    paymentVoucherValues.user = req.user.id;

    paymentVoucherValues.amount = req.body.amount;

    paymentVoucherValues.date = req.body.date;
   
    // paymentVoucherValues.dateC = d.dateC;
    // paymentVoucherValues.monthC = d.monthC;
    // paymentVoucherValues.yearC = d.yearC;

    paymentVoucherValues.ledger.label = req.body.ledger.label;
    paymentVoucherValues.ledger.ledgerId = req.body.ledger.ledgerId;
    paymentVoucherValues.ledger.value = req.body.ledger.value;

    if (req.body.modeOfPayment)
      paymentVoucherValues.modeOfPayment.label = req.body.modeOfPayment.label;
    if (req.body.modeOfPayment)
      paymentVoucherValues.modeOfPayment.value = req.body.modeOfPayment.value;

    paymentVoucherValues.discount = req.body.discount;

    paymentVoucherValues.remarks = req.body.remarks;


    paymentVoucherValues.reminderDate = req.body.reminderDate;

    //getting last voucher number and making new one

    let vNo;
    const data = await PaymentVoucher.find({}).sort({
      paymentVoucherNumber: -1
    });
    if (data.length === 0) {
      vNo = 1;
      paymentVoucherValues.paymentVoucherNumber = Number(vNo);
    } else {
      vNo = Number(data[0].paymentVoucherNumber) + 1;
      paymentVoucherValues.paymentVoucherNumber = vNo;
    }

    //Do database stuff
    PaymentVoucher.findOne({ user: req.user.id })
      .then(paymentvoucher => {
        if (paymentvoucher) {
          PaymentVoucher.findOne({
            paymentVoucherNumber: paymentVoucherValues.paymentVoucherNumber
          })
            .then(paymentvoucher => {
              //Username already exists
              if (paymentvoucher) {
                res.json({
                  message: "Voucher Number Already exist ",
                  variant: "error"
                });
              } else {
                //save user
                new PaymentVoucher(paymentVoucherValues)
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
          new PaymentVoucher(paymentVoucherValues)
            .save()
            .then(
              res.json({
                message: "First payment is saved",
                variant: "success"
              })
            )
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching paymentvoucher" + err));
  }
);

// @type    GET
//@route    /api/transaction/paymentvoucher/allpayment
// @desc    route for getting all data from  paymentvoucher
// @access  PRIVATE
router.get(
  "/allpayment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    PaymentVoucher.find({})
      .sort({ paymentVoucherNumber: -1 })
      .then(PaymentVoucher => res.json(PaymentVoucher))
      .catch(err =>
        res
          .status(404)
          .json({ message: "No Payment Voucher Found", variant: "error" })
      );
  }
);

// @type    get
//@route    /api/transaction/paymentvoucher/get/:id
// @desc    route to get single paymentvoucher by id
// @access  PRIVATE
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    PaymentVoucher.find({
      _id: req.params.id
    }).then(PaymentVoucher => res.json(PaymentVoucher));
  }
);

// @type    POST
//@route    /api/transaction/paymentvoucher/:id
// @desc    route to update/edit paymentvoucher
// @access  PRIVATE

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const paymentVoucherValues = {
      ledger: {},

      modeOfPayment: {}
    };

    paymentVoucherValues.user = req.user.id;

    paymentVoucherValues.amount = req.body.amount;

    paymentVoucherValues.date = req.body.date;

    paymentVoucherValues.ledger.label = req.body.ledger.label;
    paymentVoucherValues.ledger.ledgerId = req.body.ledger.ledgerId;
    paymentVoucherValues.ledger.value = req.body.ledger.value;
    receiptVoucherValues.designation = req.user.designation;


    if (req.body.modeOfPayment)
      paymentVoucherValues.modeOfPayment.label = req.body.modeOfPayment.label;
    if (req.body.modeOfPayment)
      paymentVoucherValues.modeOfPayment.value = req.body.modeOfPayment.value;

    paymentVoucherValues.discount = req.body.discount;

    paymentVoucherValues.remarks = req.body.remarks;

    paymentVoucherValues.reminderDate = req.body.reminderDate;

    PaymentVoucher.findOneAndUpdate(
      { _id: req.params.id },
      { $set: paymentVoucherValues },
      { new: true }
    )

      .then(() =>
        res.json({ message: "Updated successfully!!", variant: "success" })
      )

      .catch(err =>
        console.log("Problem in updating paymentvoucher value" + err)
      );
  }
);

// @type    GET
//@route    /api/transaction/paymentvoucher/allpayment/:searchpayment
// @desc    route for searching of payment from searchbox using any text
// @access  PRIVATE
router.get(
  "/allpayment/:searchpayment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const search = req.params.searchpayment;
    if (isNaN(search)) {
      PaymentVoucher.find({
        "ledger.label": new RegExp(search, "i")
      }).then(PaymentVoucher => res.json(PaymentVoucher));
    } else {
      PaymentVoucher.find({
        paymentVoucherNumber: search
      }).then(PaymentVoucher => res.json(PaymentVoucher));
    }
  }
);

// @type    POST
//@route    /api/transaction/paymentvoucher/deletepayment/:id
// @desc    route for personnal user paymentvoucher
// @access  PRIVATE

router.delete(
  "/deletepayment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.params.id;
    PaymentVoucher.findOne({ _id: id }).then(PaymentVoucherResult => {
      if (PaymentVoucherResult) {
        PaymentVoucher.findOneAndDelete({ _id: id })
          .then(() =>
            res.json({ message: "Deleted successfully", variant: "success" })
          )
          .catch(err =>
            res.json("Failed to delete due to this error - " + err)
          );
      } else {
        res
          .status(400)
          .json({ message: "Payment Voucher Not Found", variant: "error" });
      }
    });
  }
);

module.exports = router;
