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
const PurchaseVoucher = require("../../../../models/Transaction/PurchaseVoucher");
const SaleVoucher = require("../../../../models/Transaction/SaleVoucher");

//Load AddVehicle Model
const AddVehicle = require("../../../../models/AddVehicle");
let fData = [];
let vehicleIncome;
let vehicleExpense;
let vehiclePAndL;

// @type    get
//@route    /api/report/transactionreport/allvehicle/allvehiclebal
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE

router.get(
  "/allvehiclebal",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await AddVehicle.find({
      companyId: req.user.companyId
    }).then(AddVehicleResult => {
      //need to define specific group to find cb

      allVehiclebal = AddVehicleResult;
    });
    await allVehiclebal.forEach((item, index) => {
      let data = {};
      fData.length = 0;
      data.vehicleId = item._id;
      data.vehicleNumber = item.vehicleNo;
      getvehicleBal(res, item.vehicleNo, req.user.companyId).then(() => {
        data.income = vehicleIncome;
        data.expence = vehicleExpense;
        data.pAndL = vehiclePAndL;
      });
      fData.push(data);
      if (index + 1 === allVehiclebal.length) {
        res.json(fData);
      }
    });
  }
);

async function getvehicleBal(res, Vehicleid, cId) {
  let totalReciptAmount = 0;

  let totalPaymentAmount = 0;

  let saleVoucherAmount = 0;
  let purchaseVoucherAmount = 0;

  await ReceiptVoucher.find({
    companyId: cId,
    "mapToVehicle.value": Vehicleid
  }).then(ReceiptVoucher => {
    ReceiptVoucher.forEach(one => {
      totalReciptAmount += parseFloat((one.amount = one.amount || 0));
    });
  });

  await PaymentVoucher.find({
    companyId: cId,
    "mapToVehicle.value": Vehicleid
  }).then(PaymentVoucher => {
    PaymentVoucher.forEach(one => {
      totalPaymentAmount += parseFloat((one.amount = one.amount || 0));
    });
  });

  await SaleVoucher.find({
    companyId: cId,
    "vehicle.value": Vehicleid
  }).then(SaleVoucher => {
    SaleVoucher.forEach(one => {
      saleVoucherAmount += parseFloat((one.freight = one.freight || 0));
    });
  });

  await PurchaseVoucher.find({
    companyId: cId,
    "vehicle.value": Vehicleid
  })
    .then(PurchaseVoucher => {
      PurchaseVoucher.forEach(one => {
        purchaseVoucherAmount += parseFloat((one.freight = one.freight || 0));
      });

      //json responce
      vehicleIncome = (saleVoucherAmount + totalReciptAmount).toFixed(2);
      vehicleExpense = totalPaymentAmount.toFixed(2);

      const difference = (vehicleIncome - vehicleExpense).toFixed(2);

      //cr -dr

      vehiclePAndL = difference;
    })
    .catch(err =>
      res.status(404).json({
        message: "No Receipt Voucher Found" + err
      })
    );
}

module.exports = router;
