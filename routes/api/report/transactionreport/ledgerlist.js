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
const OrderBooking = require("../../../../models/Transaction/OrderBooking");
const PurchaseOrder = require("../../../../models/Transaction/PurchaseOrder");
const PurchaseVoucher = require("../../../../models/Transaction/PurchaseVoucher");
const SaleVoucher = require("../../../../models/Transaction/SaleVoucher");

//Load AddLedger Model
const AddLedger = require("../../../../models/Ledgers/AddLedger");

let indivisualCurrentBal;
let indivisualDebit;
let indivisualCredit;
let indivisualOpeningBalance;
let allLedgerCurrentbal = [];
let fData = [];

// @type    get
// @route    /api/report/transactionreport/ledgerlist/get
router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //   const groupId = req.params.groupid;
    let groupid = "5c62b1a04a06862984d962f5";
    await AddLedger.find({
      companyId: req.user.companyId,
      "ledgerGroup.groupId": groupid,

      openingBalance: { $ne: null },
      $and: [
        {
          $or: [{ isDefault: false }, { isDefault: null }]
        }
      ]
    }).then(AddLedgerResult => {
      //need to define specific group to find cb

      allLedger = AddLedgerResult;
    });
    await allLedger.forEach((item, index) => {
      let data = {};
      let ans;
      fData.splice(0, fData.length);

      data.value = item._id;
      data.ledgerName = item.ledgerName;
      data.nickName = item.nickName;
      data.contactPerson = item.contactPerson;
      data.agent = item.agent;
      data.remarks = item.remarks;
      data.gstNo = item.gstNo;
      data.aadharNumber = item.aadharNumber;
      data.pan = item.pan;
      data.village = item.village;
      data.district = item.state;
      data.address = item.address;
      data.mobileNumber = item.mobileNo;
      getopeningBal(res, item._id, req.user.companyId).then(() => {
        data.openingBalance = indivisualOpeningBalance;

        fData.push(data);
        if (index + 1 === allLedger.length) {
          res.json(fData);
        }
      });
    });
  }
);

async function getopeningBal(res, value, cId) {
  let openingBalanceAmount = 0;

  let isCr;

  await AddLedger.findOne({
    companyId: cId,
    _id: value
  }).then(AddLedger => {
    openingBalanceAmount = parseFloat(
      (AddLedger.openingBalance = AddLedger.openingBalance || 0)
    );
    isCr = AddLedger.isCr;
    lName = AddLedger.ledgerName;

    isCr === true
      ? (openingBalanceWithSign = openingBalanceAmount + " CR")
      : (openingBalanceWithSign = openingBalanceAmount + " DR");

    indivisualOpeningBalance = openingBalanceWithSign;
  });
}

module.exports = router;
