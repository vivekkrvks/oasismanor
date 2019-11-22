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
let indivisualGroup;
let allLedgerTrialbal = [];
let fData = [];

async function getCurrentBal(res, value, cId) {
  let totalReciptAmount = 0;
  let totalReciptAmountM = 0;

  let totalPaymentAmount = 0;
  let totalPaymentAmountM = 0;
  let openingBalanceAmount = 0;
  let lName;
  let saleOrderAmount = 0;
  let saleOrderAmountM = 0;

  let purchaseOrderAmount = 0;
  let purchaseOrderAmountM = 0;

  let saleVoucherAmount = 0;
  let saleVoucherCashPaid = 0;
  let saleVoucherCashPaidM = 0;

  let saleVoucherFreight = 0;
  let saleVoucherDiscount = 0;

  let purchaseVoucherAmount = 0;
  let purchaseVoucherCashPaid = 0;
  let purchaseVoucherCashPaidM = 0;

  let purchaseVoucherFreight = 0;
  let purchaseVoucherDiscount = 0;

  let isCr;
  let openingBalance1 = 0;
  let openingBalance2 = 0;
  let totalReciptDiscount = 0;
  let totalPaymentDiscount = 0;
  let group;
  await AddLedger.findOne({
    companyId: cId,
    _id: value
  }).then(AddLedger => {
    openingBalanceAmount = parseFloat(
      (AddLedger.openingBalance = AddLedger.openingBalance || 0)
    );

    group = AddLedger.ledgerGroup;
    lName = AddLedger.ledgerName;
  });

  isCr === true
    ? ((openingBalance1 = openingBalanceAmount), (openingBalance2 = 0))
    : ((openingBalance1 = -0), (openingBalance2 = openingBalanceAmount));

  await ReceiptVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).then(ReceiptVoucher => {
    ReceiptVoucher.forEach(one => {
      totalReciptAmount += parseFloat((one.amount = one.amount || 0));
      totalReciptDiscount += parseFloat((one.discount = one.discount || 0));
    });
  });
  await ReceiptVoucher.find({
    companyId: cId,
    "modeOfReceipt.value": value
  }).then(ReceiptVoucher => {
    ReceiptVoucher.forEach(one => {
      totalReciptAmountM += parseFloat((one.amount = one.amount || 0));
    });
  });

  await PaymentVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).then(PaymentVoucher => {
    PaymentVoucher.forEach(one => {
      totalPaymentAmount += parseFloat((one.amount = one.amount || 0));
      totalPaymentDiscount += parseFloat((one.discount = one.discount || 0));
    });
  });
  await PaymentVoucher.find({
    companyId: cId,
    "modeOfPayment.value": value
  }).then(PaymentVoucher => {
    PaymentVoucher.forEach(one => {
      totalPaymentAmountM += parseFloat((one.amount = one.amount || 0));
    });
  });

  await OrderBooking.find({
    companyId: cId,
    "ledger.value": value
  }).then(OrderBooking => {
    OrderBooking.forEach(one => {
      saleOrderAmount += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    });
  });
  await OrderBooking.find({
    companyId: cId,
    "modeOfPay.value": value
  }).then(OrderBooking => {
    OrderBooking.forEach(one => {
      saleOrderAmountM += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    });
  });

  await PurchaseOrder.find({
    companyId: cId,
    "ledger.value": value
  }).then(PurchaseOrder => {
    PurchaseOrder.forEach(one => {
      purchaseOrderAmount += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    });
  });
  await PurchaseOrder.find({
    companyId: cId,
    "modeOfPay.value": value
  }).then(PurchaseOrder => {
    PurchaseOrder.forEach(one => {
      purchaseOrderAmountM += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    });
  });

  await SaleVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).then(SaleVoucher => {
    SaleVoucher.forEach(two => {
      two.products.forEach(one => {
        saleVoucherAmount += parseFloat((one.amount = one.amount || 0));
      });
    });
  });
  await SaleVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).then(SaleVoucher => {
    SaleVoucher.forEach(one => {
      saleVoucherCashPaid += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
      saleVoucherFreight += parseFloat((one.freight = one.freight || 0));
      saleVoucherDiscount += parseFloat((one.discount = one.discount || 0));
      saleVoucherDisPer = one.inPerc;
    });
  });
  await SaleVoucher.find({
    companyId: cId,
    "modeOfPay.value": value
  }).then(SaleVoucher => {
    SaleVoucher.forEach(one => {
      saleVoucherCashPaidM += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
    });
  });

  await PurchaseVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).then(PurchaseVoucher => {
    PurchaseVoucher.forEach(two => {
      two.products.forEach(one => {
        purchaseVoucherAmount += parseFloat((one.amount = one.amount || 0));
      });
    });
  });
  await PurchaseVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).then(PurchaseVoucher => {
    PurchaseVoucher.forEach(one => {
      purchaseVoucherCashPaid += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
      purchaseVoucherFreight += parseFloat((one.freight = one.freight || 0));
      purchaseVoucherDiscount += parseFloat((one.discount = one.discount || 0));
    });
  });
  await PurchaseVoucher.find({
    companyId: cId,
    "modeOfPay.value": value
  })
    .then(PurchaseVoucher => {
      PurchaseVoucher.forEach(one => {
        purchaseVoucherCashPaidM += parseFloat(
          (one.cashReceived = one.cashReceived || 0)
        );
      });

      //json responce
      const credit = (
        openingBalance1 +
        totalReciptAmount +
        totalReciptDiscount +
        saleOrderAmount +
        saleVoucherDiscount +
        saleVoucherCashPaid +
        purchaseVoucherAmount +
        purchaseVoucherFreight +
        totalReciptAmountM +
        saleOrderAmountM +
        saleVoucherCashPaidM
      ).toFixed(2);

      const debit = (
        openingBalance2 +
        totalPaymentAmount +
        totalPaymentDiscount +
        purchaseOrderAmount +
        saleVoucherAmount +
        saleVoucherFreight +
        purchaseVoucherDiscount +
        purchaseVoucherCashPaid +
        totalPaymentAmountM +
        purchaseOrderAmountM +
        purchaseVoucherCashPaidM
      ).toFixed(2);
      let currentBalance = credit - debit;

      //cr -dr
      currentBalance <= 0
        ? ((indivisualDebit = -currentBalance), (indivisualCredit = ""))
        : ((indivisualCredit = currentBalance), (indivisualDebit = ""));

      indivisualGroup = group;
    })
    .catch(err =>
      res.status(404).json({
        message: "No Receipt Voucher Found" + err
      })
    );
}

// @type    get
//@route    /api/report/transactionreport/trialbalance/alltrialbal
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE

router.get(
  "/alltrialbal",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await AddLedger.find({
      companyId: req.user.companyId,

      openingBalance: { $ne: null },
      $and: [
        {
          $or: [{ isDefault: false }, { isDefault: null }]
        }
      ]
    }).then(AddLedgerResult => {
      //need to define specific group to find cb

      allLedgerTrialbal = AddLedgerResult;
    });
    await allLedgerTrialbal.forEach((item, index) => {
      let data = {};
      let ans;
      fData.splice(0, fData.length);

      data.value = item._id;
      data.ledgerName = item.ledgerName;
      getCurrentBal(res, item._id, req.user.companyId).then(() => {
        data.group = indivisualGroup;
        data.debit = indivisualDebit;
        data.credit = indivisualCredit;

        fData.push(data);
        if (index + 1 === allLedgerTrialbal.length) {
          res.json(fData);
        }
      });
    });
  }
);

module.exports = router;
