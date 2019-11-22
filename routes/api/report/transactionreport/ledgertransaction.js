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
let indivisualOpeningBal;

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
  let openingBalWithSymbol;
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
    ? ((openingBalance1 = openingBalanceAmount),
      (openingBalance2 = 0),
      (openingBalWithSymbol = openingBalanceAmount + " CR"))
    : ((openingBalance1 = -0),
      (openingBalance2 = openingBalanceAmount),
      (openingBalWithSymbol = openingBalanceAmount + " DR"));

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
      let currentBalance = openingBalance1 + credit - openingBalance2 - debit;

      //cr -dr
      let currentBalanceWithSign;
      currentBalance <= 0
        ? (currentBalanceWithSign = -currentBalance + " DR")
        : (currentBalanceWithSign = currentBalance + " CR");

      indivisualCurrentBal = currentBalanceWithSign;
      indivisualDebit = debit;
      indivisualCredit = credit;
      indivisualGroup = group;
      indivisualOpeningBal = openingBalWithSymbol;
    })
    .catch(err =>
      res.status(404).json({
        message: "No Receipt Voucher Found" + err
      })
    );
}

// @type    get
//@route    /api/report/transactionreport/ledgertransaction/traninshort
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE

router.get(
  "/traninshort",
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
      data.value = item._id;
      data.ledgerName = item.ledgerName;
      getCurrentBal(res, item._id, req.user.companyId).then(() => {
        data.group = indivisualGroup;
        data.openingBalance = indivisualOpeningBal;
        data.debit = indivisualDebit;
        data.credit = indivisualCredit;
        data.currentBalance = indivisualCurrentBal;
        fData.push(data);
        if (index + 1 === allLedgerTrialbal.length) {
          res.json(fData);
        }
      });
    });
  }
);

router.get(
  "/paymentreport",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let resultArray = [];
    let firstdate = "2019-03-20T20:54:55.424Z"; //need to pass in url
    let endDate = "2019-04-17T08:16:27.463Z"; //need to pass in url
    let value = "5cb1a87a3943863fe02bff16";
    //req.params.value; //need to pass in url

    let givenfirstdate = new Date(firstdate);
    let givenlastdate = new Date(endDate);

    let paymentResult = await PaymentVoucher.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No Payment Voucher Found" + err })
    );

    paymentResult.forEach(one => {
      let getdate = new Date(one.date);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        console.log(one.amount);
        let obj = { ledger: {} };
        obj.amount = one.amount;
        obj.ledger = one.ledger;
        obj.date = one.date;
        obj.voucherNumber = one.paymentVoucherNumber;
        resultArray.push(obj);
      }
    });

    let receiptResult = await ReceiptVoucher.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No Receipt Voucher Found" + err })
    );

    receiptResult.forEach(one => {
      let getdate = new Date(one.date);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.amount = one.amount;
        obj.ledger = one.ledger;
        obj.date = one.date;
        obj.voucherNumber = one.receiptVoucherNumber;
        resultArray.push(obj);
      }
    });

    resultArray = bubbleSort(res, resultArray);
    res.json(resultArray);
  }
);

function bubbleSort(res, a) {
  var swapped;
  do {
    swapped = false;
    for (var i = 0; i < a.length - 1; i++) {
      if (new Date(a[i].date) < new Date(a[i + 1].date)) {
        var temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
  return a;
}

// router.get("/paymentreport", passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     let resultArray = [];

//     let paymentResult = await PaymentVoucher.find({
//       companyId: req.user.companyId
//     })
//       .catch(err => res.status(404).json({ message: "No Payment Voucher Found" + err }));

//     paymentResult.forEach(one => {
//       resultArray.push(one);
//     })

//     let receiptResult = await ReceiptVoucher.find({
//       companyId: req.user.companyId
//     })
//       .catch(err => res.status(404).json({ message: "No Receipt Voucher Found" + err }));

//     receiptResult.forEach(one => {
//       resultArray.push(one);
//     })

//     resultArray = bubbleSort(res, resultArray);
//     res.json(resultArray);
//   }
// )

// function bubbleSort(res, a) {
//   var swapped;
//   do {
//     swapped = false;
//     for (var i = 0; i < a.length - 1; i++) {
//       if (new Date(a[i].date) < new Date(a[i + 1].date)) {
//         var temp = a[i];
//         a[i] = a[i + 1];
//         a[i + 1] = temp;
//         swapped = true;
//       }
//     }
//   } while (swapped);
//   return (a);
// }

module.exports = router;
