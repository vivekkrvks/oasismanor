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

let allPaymentVehicle = [];
let allReceiptVehicle = [];
let totalPaymentAmount = 0;
let fData = [];
// @type    get
//@route    /api/report/transactionreport/vehicle/get/:id
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    let vId = req.params.id;
    await PaymentVoucher.find({
      companyId: req.user.companyId,
      "mapToVehicle.value": vId
    }).then(veichlePaymentResult => {
      allPaymentVehicle = veichlePaymentResult;
    });
    await allPaymentVehicle.forEach((item, index) => {
      let data = {};
      data.date = item.date;
      data.veichle = item.mapToVeichle;
      data.Pamount = item.amount;
      data.Voucher = item.paymentVoucherNumber;

      fData.push(data);
    });

    await ReceiptVoucher.find({
      companyId: req.user.companyId,
      "mapToVehicle.value": vId
    }).then(veichleReceiptResult => {
      allReceiptVehicle = veichleReceiptResult;
    });
    await allReceiptVehicle.forEach((item, index) => {
      let data = {};
      data.date = item.date;
      data.veichle = item.mapToVeichle;
      data.Ramount = item.amount;
      data.Voucher = item.receiptVoucherNumber;

      fData.push(data);
      if (1 === 1) {
        res.json(fData);
      }
    });
  }
);
module.exports = router;
