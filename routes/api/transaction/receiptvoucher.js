const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

//Load Person Model
const Person = require("../../../models/Person");

//Load ReceiptVoucher.js Model
const ReceiptVoucher = require("../../../models/Transaction/ReceiptVoucher");

// @type    POST
//@route    /api/transaction/receiptvoucher/
// @desc    route for SAVING data for receiptvoucher
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const receiptVoucherValues = {
      ledger: {},

      modeOfReceipt: {}
    };
    receiptVoucherValues.user = req.user.id;

    receiptVoucherValues.amount = req.body.amount;

    receiptVoucherValues.date = req.body.date;
    receiptVoucherValues.designation = req.user.designation;

    receiptVoucherValues.ledger.label = req.body.ledger.label;
    receiptVoucherValues.ledger.ledgerId = req.body.ledger.ledgerId;
    receiptVoucherValues.ledger.value = req.body.ledger.value;

    if (req.body.modeOfReceipt)
      receiptVoucherValues.modeOfReceipt.label = req.body.modeOfReceipt.label;
    if (req.body.modeOfReceipt)
      receiptVoucherValues.modeOfReceipt.value = req.body.modeOfReceipt.value;

    receiptVoucherValues.discount = req.body.discount;

    receiptVoucherValues.remarks = req.body.remarks;

    receiptVoucherValues.reminderDate = req.body.reminderDate;

    //getting last voucher number and making new one

    let vNo;
    const data = await ReceiptVoucher.find({}).sort({
      receiptVoucherNumber: -1
    });
    if (data.length === 0) {
      vNo = 1;
      receiptVoucherValues.receiptVoucherNumber = Number(vNo);
    } else {
      vNo = Number(data[0].receiptVoucherNumber) + 1;
      receiptVoucherValues.receiptVoucherNumber = vNo;
    }

    //Do database stuff
    ReceiptVoucher.findOne({ user: req.user.id })
      .then(receiptvoucher => {
        if (receiptvoucher) {
          ReceiptVoucher.findOne({
            receiptVoucherNumber: receiptVoucherValues.receiptVoucherNumber
          })
            .then(receiptvoucher => {
              //Username already exists
              if (receiptvoucher) {
                res.json({
                  message: "voucher Number Already exist ",
                  variant: "error"
                });
              } else {
                //save user
                new ReceiptVoucher(receiptVoucherValues)
                  .save()
                  .then(receiptvoucher =>
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
          new ReceiptVoucher(receiptVoucherValues)
            .save()
            .then(receiptvoucher =>
              res.json({
                message: "your first receipt Successfully saved ",
                variant: "success"
              })
            )
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching receiptvoucher" + err));
  }
);

// @type    GET
//@route    /api/transaction/receiptvoucher/allreceipt
// @desc    route for getting all data from  receiptvoucher
// @access  PRIVATE
router.get(
  "/allreceipt",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ReceiptVoucher.find({})
      .sort({ receiptVoucherNumber: -1 })
      .then(ReceiptVoucher => res.json(ReceiptVoucher))
      .catch(err =>
        res
          .status(404)
          .json({ message: "No Receipt Voucher Found", variant: "error" })
      );
  }
);

// @type    get
//@route    /api/transaction/receiptvoucher/get/:id
// @desc    route to get single receiptvoucher by id
// @access  PRIVATE
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ReceiptVoucher.find({
      _id: req.params.id
    }).then(ReceiptVoucher => res.json(ReceiptVoucher));
  }
);

// @type    GET
//@route    /api/transaction/receiptvoucher/get/vouchernumber
// @desc    route for getting all data from  receiptvoucher
// @access  PRIVATE
//saleOrderAmount of ledger

router.get(
  "/get/vouchernumber",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ReceiptVoucher.find({})

      .then(ReceiptVoucher => {
        ReceiptVoucher.map(m => {
          {
            id1 = m._id;

            receivedFrom1 = m.receivedFrom;
          }
        });

        newVoucher.push({ id: id1, receivedFrom: receivedFrom1 });
      })
      .catch(err =>
        res.status(404).json({
          message: "No Receipt Voucher Found",
          variant: "error"
        })
      );
    return newVoucher;
  }
);

// @type    POST
//@route    /api/transaction/receiptvoucher/:id
// @desc    route to update/edit receiptvoucher
// @access  PRIVATE

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const receiptVoucherValues = {
      ledger: {},

      modeOfReceipt: {}
    };
    receiptVoucherValues.user = req.user.id;

    receiptVoucherValues.amount = req.body.amount;

    receiptVoucherValues.date = req.body.date;
    receiptVoucherValues.designation = req.user.designation;


    receiptVoucherValues.ledger.label = req.body.ledger.label;
    receiptVoucherValues.ledger.ledgerId = req.body.ledger.ledgerId;
    receiptVoucherValues.ledger.value = req.body.ledger.value;

    if (req.body.modeOfReceipt)
      receiptVoucherValues.modeOfReceipt.label = req.body.modeOfReceipt.label;
    if (req.body.modeOfReceipt)
      receiptVoucherValues.modeOfReceipt.value = req.body.modeOfReceipt.value;

    receiptVoucherValues.discount = req.body.discount;

    receiptVoucherValues.remarks = req.body.remarks;

    receiptVoucherValues.reminderDate = req.body.reminderDate;

    ReceiptVoucher.findOneAndUpdate(
      { _id: req.params.id },
      { $set: receiptVoucherValues },
      { new: true }
    )

      .then(() =>
        res.json({ message: "Updated successfully!!", variant: "success" })
      )

      .catch(err =>
        console.log("problem in updating receiptvoucher value" + err)
      );
  }
);

// @type    GET
//@route    /api/transaction/receiptvoucher/allreceipt/:searchreceipt
// @desc    route for searching of receipt from searchbox using any text
// @access  PRIVATE
router.get(
  "/allreceipt/:searchreceipt",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const search = req.params.searchreceipt;
    if (isNaN(search)) {
      ReceiptVoucher.find({
        "ledger.label": new RegExp(search, "i")
      }).then(receivedVoucherResult => res.json(receivedVoucherResult));
    } else {
      ReceiptVoucher.find({
        receiptVoucherNumber: search
      }).then(receivedVoucherResult => res.json(receivedVoucherResult));
    }
  }
);

// @type    POST
//@route    /api/transaction/receiptvoucher/deletereceipt/:id
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE

router.delete(
  "/deletereceipt/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.params.id;
    ReceiptVoucher.findOne({ _id: id }).then(ReceiptVoucherResult => {
      if (ReceiptVoucherResult) {
        ReceiptVoucher.findOneAndDelete({ _id: id })
          .then(() =>
            res.json({ message: "deleted successfully", variant: "success" })
          )
          .catch(err =>
            res.json("failed to delete due to this error - " + err)
          );
      } else {
        res
          .status(400)
          .json({ message: "Receipt Voucher Not Found", variant: "error" });
      }
    });
  }
);

module.exports = router;
