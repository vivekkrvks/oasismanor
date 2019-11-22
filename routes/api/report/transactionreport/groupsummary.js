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

async function getCurrentBal(res, value, cId, sD, eD) {
  let givenfirstdate = new Date(sD);
  let givenlastdate = new Date(eD);

  let totalReciptAmount = 0;
  let totalReciptAmountM = 0;
  let totalReciptAmountN = 0;

  let totalPaymentAmount = 0;
  let totalPaymentAmountM = 0;
  let totalPaymentAmountN = 0;

  let openingBalanceAmount = 0;
  let lName;
  let saleOrderAmount = 0;
  let saleOrderAmountM = 0;
  let saleOrderAmountN = 0;

  let purchaseOrderAmount = 0;
  let purchaseOrderAmountM = 0;
  let purchaseOrderAmountN = 0;

  let saleVoucherAmount = 0;
  let saleVoucherCashPaid = 0;
  let saleVoucherCashPaidM = 0;
  let saleVoucherCashPaidN = 0;

  let saleVoucherFreight = 0;
  let saleVoucherDiscount = 0;

  let purchaseVoucherAmount = 0;
  let purchaseVoucherCashPaid = 0;
  let purchaseVoucherCashPaidM = 0;
  let purchaseVoucherCashPaidN = 0;

  let purchaseVoucherFreight = 0;
  let purchaseVoucherDiscount = 0;

  let isCr;
  let openingBalanceWithSign = 0;
  let totalReciptDiscount = 0;
  let totalPaymentDiscount = 0;

  let ReceiptVoucher1 = await ReceiptVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  ReceiptVoucher1.forEach(one => {
    let getdate = new Date(one.date);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      totalReciptAmount += parseFloat((one.amount = one.amount || 0));
      totalReciptDiscount += parseFloat((one.discount = one.discount || 0));
    }
  });

  let ReceiptVoucher2 = await ReceiptVoucher.find({
    companyId: cId,
    "modeOfReceipt.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  ReceiptVoucher2.forEach(one => {
    let getdate = new Date(one.date);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      totalReciptAmountM += parseFloat((one.amount = one.amount || 0));
    }
  });

  let ReceiptVoucher3 = await ReceiptVoucher.find({
    companyId: cId,
    "modeOfReceipt.value": "Cash"
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  ReceiptVoucher3.forEach(one => {
    let getdate = new Date(one.date);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      totalReciptAmountN += parseFloat((one.amount = one.amount || 0));
    }
  });

  let PaymentVoucher1 = await PaymentVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PaymentVoucher1.forEach(one => {
    let getdate = new Date(one.date);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      totalPaymentAmount += parseFloat((one.amount = one.amount || 0));
      totalPaymentDiscount += parseFloat((one.discount = one.discount || 0));
    }
  });

  let PaymentVoucher2 = await PaymentVoucher.find({
    companyId: cId,
    "modeOfPayment.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PaymentVoucher2.forEach(one => {
    let getdate = new Date(one.date);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      totalPaymentAmountM += parseFloat((one.amount = one.amount || 0));
    }
  });

  let PaymentVoucher3 = await PaymentVoucher.find({
    companyId: cId,
    "modeOfPayment.value": "Cash"
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PaymentVoucher3.forEach(one => {
    let getdate = new Date(one.date);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      totalPaymentAmountN += parseFloat((one.amount = one.amount || 0));
    }
  });

  let OrderBooking1 = await OrderBooking.find({
    companyId: cId,
    "ledger.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  OrderBooking1.forEach(one => {
    let getdate = new Date(one.orderDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      saleOrderAmount += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    }
  });

  let OrderBooking2 = await OrderBooking.find({
    companyId: cId,
    "modeOfPay.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  OrderBooking2.forEach(one => {
    let getdate = new Date(one.orderDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      saleOrderAmountM += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    }
  });

  let OrderBooking3 = await OrderBooking.find({
    companyId: cId,
    "modeOfPay.value": "Cash"
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  OrderBooking3.forEach(one => {
    let getdate = new Date(one.orderDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      saleOrderAmountN += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    }
  });

  let PurchaseOrder1 = await PurchaseOrder.find({
    companyId: cId,
    "ledger.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PurchaseOrder1.forEach(one => {
    let getdate = new Date(one.orderDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      purchaseOrderAmount += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    }
  });

  let PurchaseOrder2 = await PurchaseOrder.find({
    companyId: cId,
    "modeOfPay.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PurchaseOrder2.forEach(one => {
    let getdate = new Date(one.orderDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      purchaseOrderAmountM += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    }
  });

  let PurchaseOrder3 = await PurchaseOrder.find({
    companyId: cId,
    "modeOfPay.value": "Cash"
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PurchaseOrder3.forEach(one => {
    let getdate = new Date(one.orderDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      purchaseOrderAmountN += parseFloat(
        (one.advanceAmount = one.advanceAmount || 0)
      );
    }
  });

  let SaleVoucher1 = await SaleVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  SaleVoucher1.forEach(two => {
    let getdate = new Date(two.saleDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      two.products.forEach(one => {
        saleVoucherAmount += parseFloat((one.amount = one.amount || 0));
      });
    }
  });

  let SaleVoucher2 = await SaleVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  SaleVoucher2.forEach(one => {
    let getdate = new Date(one.saleDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      saleVoucherCashPaid += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
      saleVoucherFreight += parseFloat((one.freight = one.freight || 0));
      saleVoucherDiscount += parseFloat((one.discount = one.discount || 0));
      saleVoucherDisPer = one.inPerc;
    }
  });

  let SaleVoucher3 = await SaleVoucher.find({
    companyId: cId,
    "modeOfPay.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  SaleVoucher3.forEach(one => {
    let getdate = new Date(one.saleDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      saleVoucherCashPaidM += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
    }
  });

  let SaleVoucher4 = await SaleVoucher.find({
    companyId: cId,
    "modeOfPay.value": "Cash"
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  SaleVoucher4.forEach(one => {
    let getdate = new Date(one.saleDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      saleVoucherCashPaidN += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
    }
  });

  let PurchaseVoucher1 = await PurchaseVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PurchaseVoucher1.forEach(two => {
    let getdate = new Date(two.purchaseDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      two.products.forEach(one => {
        purchaseVoucherAmount += parseFloat((one.amount = one.amount || 0));
      });
    }
  });

  let PurchaseVoucher2 = await PurchaseVoucher.find({
    companyId: cId,
    "ledger.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PurchaseVoucher2.forEach(one => {
    let getdate = new Date(one.purchaseDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      purchaseVoucherCashPaid += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
      purchaseVoucherFreight += parseFloat((one.freight = one.freight || 0));
      purchaseVoucherDiscount += parseFloat((one.discount = one.discount || 0));
    }
  });

  let PurchaseVoucher3 = await PurchaseVoucher.find({
    companyId: cId,
    "modeOfPay.value": value
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PurchaseVoucher3.forEach(one => {
    let getdate = new Date(one.purchaseDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      purchaseVoucherCashPaidM += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
    }
  });

  let PurchaseVoucher4 = await PurchaseVoucher.find({
    companyId: cId,
    "modeOfPay.value": "Cash"
  }).catch(err =>
    res.status(404).json({ message: "No Payment Voucher Found" + err })
  );
  PurchaseVoucher4.forEach(one => {
    let getdate = new Date(one.purchaseDate);
    if (
      (getdate > givenfirstdate || getdate == givenfirstdate) &&
      (getdate == givenlastdate || getdate < givenlastdate)
    ) {
      purchaseVoucherCashPaidN += parseFloat(
        (one.cashReceived = one.cashReceived || 0)
      );
    }
  });
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
      ? (openingBalanceWithSign = openingBalanceAmount)
      : (openingBalanceWithSign = -openingBalanceAmount);

    let credit = 0;
    let debit = 0;
    const credit2 = (
      totalReciptAmount +
      totalReciptDiscount +
      saleOrderAmount +
      saleVoucherDiscount +
      saleVoucherCashPaid +
      purchaseVoucherAmount +
      purchaseVoucherFreight +
      totalReciptAmountM +
      saleOrderAmountM +
      saleVoucherCashPaidM +
      totalReciptAmountN +
      saleOrderAmountN +
      saleVoucherCashPaidN
    ).toFixed(2);
    const debit2 = (
      totalPaymentAmount +
      totalPaymentDiscount +
      purchaseOrderAmount +
      saleVoucherAmount +
      saleVoucherFreight +
      purchaseVoucherDiscount +
      purchaseVoucherCashPaid +
      totalPaymentAmountM +
      purchaseOrderAmountM +
      purchaseVoucherCashPaidM +
      totalPaymentAmountN +
      purchaseOrderAmountN +
      purchaseVoucherCashPaidN
    ).toFixed(2);
    const credit1 = (
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
    const debit1 = (
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

    lName === "Cash"
      ? ((credit = credit2), (debit = debit2))
      : ((credit = credit1), (debit = debit1));

    let currentBalance = 0;
    currentBalance =
      openingBalanceWithSign + parseFloat(credit) - parseFloat(debit);

    //cr -dr
    let currentBalanceWithSign;
    currentBalance <= 0
      ? (currentBalanceWithSign = -currentBalance + " DR")
      : (currentBalanceWithSign = currentBalance + " CR");

    indivisualCurrentBal = currentBalanceWithSign;
    indivisualDebit = debit;
    indivisualCredit = credit;
    indivisualOpeningBalance = openingBalanceAmount;
  });
}

// @type    get
//@route    /api/report/transactionreport/groupsummary/get/:groupid/:startdate/:enddate
// @desc    route for personnal user receiptvoucher
// @access  PRIVATE

router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let startDate = "2019-03-20T20:54:55.424Z"; //need to pass in url
    let endDate = "2019-04-17T08:16:27.463Z"; //need to pass in url
    //   const groupId = req.params.groupid;
    // const startDate = req.params.startdate;
    // const endDate = req.params.enddate;
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
      data.address = item.address;
      data.mobileNumber = item.mobileNo;
      getCurrentBal(res, item._id, req.user.companyId, startDate, endDate).then(
        () => {
          data.openingBalance = indivisualOpeningBalance;
          data.debit = indivisualDebit;
          data.credit = indivisualCredit;
          data.closingBalance = indivisualCurrentBal;

          fData.push(data);
          if (index + 1 === allLedger.length) {
            res.json(fData);
          }
        }
      );
    });
  }
);

// //without date
// // @type    get
// //@route    /api/report/transactionreport/groupsummary/get/:groupid/:startdate/:enddate
// // @desc    route for personnal user receiptvoucher
// // @access  PRIVATE

// router.get(
//   "/get",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     //   const groupId = req.params.groupid;
//     let groupid = "5c62b1a04a06862984d962f5";
//     await AddLedger.find({
//       companyId: req.user.companyId,
//       "ledgerGroup.groupId": groupid,

//       openingBalance: { $ne: null },
//       $and: [
//         {
//           $or: [{ isDefault: false }, { isDefault: null }]
//         }
//       ]
//     }).then(AddLedgerResult => {
//       //need to define specific group to find cb

//       allLedger = AddLedgerResult;
//     });
//     await allLedger.forEach((item, index) => {
//       let data = {};
//       let ans;
//       fData.splice(0, fData.length);

//       data.value = item._id;
//       data.ledgerName = item.ledgerName;
//       data.address = item.address;
//       data.mobileNumber = item.mobileNo;
//       getCurrentBal(res, item._id, req.user.companyId).then(() => {
//         data.openingBalance = indivisualOpeningBalance;
//         data.debit = indivisualDebit;
//         data.credit = indivisualCredit;
//         data.closingBalance = indivisualCurrentBal;

//         fData.push(data);
//         if (index + 1 === allLedger.length) {
//           res.json(fData);
//         }
//       });
//     });
//   }
// );

// let indivisualCurrentBal;
// let indivisualDebit;
// let indivisualCredit;
// let indivisualOpeningBalance;
// let allLedgerCurrentbal = [];
// let fData = [];

// async function getCurrentBal(res, value, cId) {
//   let totalReciptAmount = 0;
//   let totalReciptAmountM = 0;
//   let totalReciptAmountN = 0;

//   let totalPaymentAmount = 0;
//   let totalPaymentAmountM = 0;
//   let totalPaymentAmountN = 0;

//   let openingBalanceAmount = 0;
//   let lName;
//   let saleOrderAmount = 0;
//   let saleOrderAmountM = 0;
//   let saleOrderAmountN = 0;

//   let purchaseOrderAmount = 0;
//   let purchaseOrderAmountM = 0;
//   let purchaseOrderAmountN = 0;

//   let saleVoucherAmount = 0;
//   let saleVoucherCashPaid = 0;
//   let saleVoucherCashPaidM = 0;
//   let saleVoucherCashPaidN = 0;

//   let saleVoucherFreight = 0;
//   let saleVoucherDiscount = 0;

//   let purchaseVoucherAmount = 0;
//   let purchaseVoucherCashPaid = 0;
//   let purchaseVoucherCashPaidM = 0;
//   let purchaseVoucherCashPaidN = 0;

//   let purchaseVoucherFreight = 0;
//   let purchaseVoucherDiscount = 0;

//   let isCr;
//   let openingBalanceWithSign = 0;
//   let totalReciptDiscount = 0;
//   let totalPaymentDiscount = 0;
//   await AddLedger.findOne({
//     companyId: cId,
//     _id: value
//   }).then(AddLedger => {
//     openingBalanceAmount = parseFloat(
//       (AddLedger.openingBalance = AddLedger.openingBalance || 0)
//     );
//     isCr = AddLedger.isCr;
//     lName = AddLedger.ledgerName;
//   });

//   isCr === true
//     ? (openingBalanceWithSign = openingBalanceAmount)
//     : (openingBalanceWithSign = -openingBalanceAmount);

//   await ReceiptVoucher.find({
//     companyId: cId,
//     "ledger.value": value
//   }).then(ReceiptVoucher => {
//     ReceiptVoucher.forEach(one => {
//       totalReciptAmount += parseFloat((one.amount = one.amount || 0));
//       totalReciptDiscount += parseFloat((one.discount = one.discount || 0));
//     });
//   });
//   await ReceiptVoucher.find({
//     companyId: cId,
//     "modeOfReceipt.value": value
//   }).then(ReceiptVoucher => {
//     ReceiptVoucher.forEach(one => {
//       totalReciptAmountM += parseFloat((one.amount = one.amount || 0));
//     });
//   });
//   await ReceiptVoucher.find({
//     companyId: cId,
//     "modeOfReceipt.value": "Cash"
//   }).then(ReceiptVoucher => {
//     ReceiptVoucher.forEach(one => {
//       totalReciptAmountN += parseFloat((one.amount = one.amount || 0));
//     });
//   });
//   await PaymentVoucher.find({
//     companyId: cId,
//     "ledger.value": value
//   }).then(PaymentVoucher => {
//     PaymentVoucher.forEach(one => {
//       totalPaymentAmount += parseFloat((one.amount = one.amount || 0));
//       totalPaymentDiscount += parseFloat((one.discount = one.discount || 0));
//     });
//   });
//   await PaymentVoucher.find({
//     companyId: cId,
//     "modeOfPayment.value": value
//   }).then(PaymentVoucher => {
//     PaymentVoucher.forEach(one => {
//       totalPaymentAmountM += parseFloat((one.amount = one.amount || 0));
//     });
//   });
//   await PaymentVoucher.find({
//     companyId: cId,
//     "modeOfPayment.value": "Cash"
//   }).then(PaymentVoucher => {
//     PaymentVoucher.forEach(one => {
//       totalPaymentAmountN += parseFloat((one.amount = one.amount || 0));
//     });
//   });
//   await OrderBooking.find({
//     companyId: cId,
//     "ledger.value": value
//   }).then(OrderBooking => {
//     OrderBooking.forEach(one => {
//       saleOrderAmount += parseFloat(
//         (one.advanceAmount = one.advanceAmount || 0)
//       );
//     });
//   });
//   await OrderBooking.find({
//     companyId: cId,
//     "modeOfPay.value": value
//   }).then(OrderBooking => {
//     OrderBooking.forEach(one => {
//       saleOrderAmountM += parseFloat(
//         (one.advanceAmount = one.advanceAmount || 0)
//       );
//     });
//   });
//   await OrderBooking.find({
//     companyId: cId,
//     "modeOfPay.value": "Cash"
//   }).then(OrderBooking => {
//     OrderBooking.forEach(one => {
//       saleOrderAmountN += parseFloat(
//         (one.advanceAmount = one.advanceAmount || 0)
//       );
//     });
//   });
//   await PurchaseOrder.find({
//     companyId: cId,
//     "ledger.value": value
//   }).then(PurchaseOrder => {
//     PurchaseOrder.forEach(one => {
//       purchaseOrderAmount += parseFloat(
//         (one.advanceAmount = one.advanceAmount || 0)
//       );
//     });
//   });
//   await PurchaseOrder.find({
//     companyId: cId,
//     "modeOfPay.value": value
//   }).then(PurchaseOrder => {
//     PurchaseOrder.forEach(one => {
//       purchaseOrderAmountM += parseFloat(
//         (one.advanceAmount = one.advanceAmount || 0)
//       );
//     });
//   });
//   await PurchaseOrder.find({
//     companyId: cId,
//     "modeOfPay.value": "Cash"
//   }).then(PurchaseOrder => {
//     PurchaseOrder.forEach(one => {
//       purchaseOrderAmountN += parseFloat(
//         (one.advanceAmount = one.advanceAmount || 0)
//       );
//     });
//   });
//   await SaleVoucher.find({
//     companyId: cId,
//     "ledger.value": value
//   }).then(SaleVoucher => {
//     SaleVoucher.forEach(two => {
//       two.products.forEach(one => {
//         saleVoucherAmount += parseFloat((one.amount = one.amount || 0));
//       });
//     });
//   });
//   await SaleVoucher.find({
//     companyId: cId,
//     "ledger.value": value
//   }).then(SaleVoucher => {
//     SaleVoucher.forEach(one => {
//       saleVoucherCashPaid += parseFloat(
//         (one.cashReceived = one.cashReceived || 0)
//       );
//       saleVoucherFreight += parseFloat((one.freight = one.freight || 0));
//       saleVoucherDiscount += parseFloat((one.discount = one.discount || 0));
//       saleVoucherDisPer = one.inPerc;
//     });
//   });
//   await SaleVoucher.find({
//     companyId: cId,
//     "modeOfPay.value": value
//   }).then(SaleVoucher => {
//     SaleVoucher.forEach(one => {
//       saleVoucherCashPaidM += parseFloat(
//         (one.cashReceived = one.cashReceived || 0)
//       );
//     });
//   });
//   await SaleVoucher.find({
//     companyId: cId,
//     "modeOfPay.value": "Cash"
//   }).then(SaleVoucher => {
//     SaleVoucher.forEach(one => {
//       saleVoucherCashPaidN += parseFloat(
//         (one.cashReceived = one.cashReceived || 0)
//       );
//     });
//   });
//   await PurchaseVoucher.find({
//     companyId: cId,
//     "ledger.value": value
//   }).then(PurchaseVoucher => {
//     PurchaseVoucher.forEach(two => {
//       two.products.forEach(one => {
//         purchaseVoucherAmount += parseFloat((one.amount = one.amount || 0));
//       });
//     });
//   });
//   await PurchaseVoucher.find({
//     companyId: cId,
//     "ledger.value": value
//   }).then(PurchaseVoucher => {
//     PurchaseVoucher.forEach(one => {
//       purchaseVoucherCashPaid += parseFloat(
//         (one.cashReceived = one.cashReceived || 0)
//       );
//       purchaseVoucherFreight += parseFloat((one.freight = one.freight || 0));
//       purchaseVoucherDiscount += parseFloat((one.discount = one.discount || 0));
//     });
//   });
//   await PurchaseVoucher.find({
//     companyId: cId,
//     "modeOfPay.value": value
//   }).then(PurchaseVoucher => {
//     PurchaseVoucher.forEach(one => {
//       purchaseVoucherCashPaidM += parseFloat(
//         (one.cashReceived = one.cashReceived || 0)
//       );
//     });
//   });
//   await PurchaseVoucher.find({
//     companyId: cId,
//     "modeOfPay.value": "Cash"
//   })
//     .then(PurchaseVoucher => {
//       PurchaseVoucher.forEach(one => {
//         purchaseVoucherCashPaidN += parseFloat(
//           (one.cashReceived = one.cashReceived || 0)
//         );
//       });

//       console.log(totalReciptAmount);
//       let credit = 0;
//       let debit = 0;
//       const credit2 = (
//         totalReciptAmount +
//         totalReciptDiscount +
//         saleOrderAmount +
//         saleVoucherDiscount +
//         saleVoucherCashPaid +
//         purchaseVoucherAmount +
//         purchaseVoucherFreight +
//         totalReciptAmountM +
//         saleOrderAmountM +
//         saleVoucherCashPaidM +
//         totalReciptAmountN +
//         saleOrderAmountN +
//         saleVoucherCashPaidN
//       ).toFixed(2);
//       const debit2 = (
//         totalPaymentAmount +
//         totalPaymentDiscount +
//         purchaseOrderAmount +
//         saleVoucherAmount +
//         saleVoucherFreight +
//         purchaseVoucherDiscount +
//         purchaseVoucherCashPaid +
//         totalPaymentAmountM +
//         purchaseOrderAmountM +
//         purchaseVoucherCashPaidM +
//         totalPaymentAmountN +
//         purchaseOrderAmountN +
//         purchaseVoucherCashPaidN
//       ).toFixed(2);
//       const credit1 = (
//         totalReciptAmount +
//         totalReciptDiscount +
//         saleOrderAmount +
//         saleVoucherDiscount +
//         saleVoucherCashPaid +
//         purchaseVoucherAmount +
//         purchaseVoucherFreight +
//         totalReciptAmountM +
//         saleOrderAmountM +
//         saleVoucherCashPaidM
//       ).toFixed(2);
//       const debit1 = (
//         totalPaymentAmount +
//         totalPaymentDiscount +
//         purchaseOrderAmount +
//         saleVoucherAmount +
//         saleVoucherFreight +
//         purchaseVoucherDiscount +
//         purchaseVoucherCashPaid +
//         totalPaymentAmountM +
//         purchaseOrderAmountM +
//         purchaseVoucherCashPaidM
//       ).toFixed(2);

//       lName === "Cash"
//         ? ((credit = credit2), (debit = debit2))
//         : ((credit = credit1), (debit = debit1));

//       let currentBalance = 0;
//       currentBalance =
//         openingBalanceWithSign + parseFloat(credit) - parseFloat(debit);

//       //cr -dr
//       let currentBalanceWithSign;
//       currentBalance <= 0
//         ? (currentBalanceWithSign = -currentBalance + " DR")
//         : (currentBalanceWithSign = currentBalance + " CR");

//       indivisualCurrentBal = currentBalanceWithSign;
//       indivisualDebit = debit;
//       indivisualCredit = credit;
//       indivisualOpeningBalance = openingBalanceAmount;
//     })
//     .catch(err =>
//       res.status(404).json({
//         message: "No Receipt Voucher Found" + err
//       })
//     );
// }

module.exports = router;
