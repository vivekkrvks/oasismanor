 

let indivisualCurrentBal;
let inDebit;
let inCredit;
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
    console.log(indivisualCurrentBal);
    indivisualCurrentBal = currentBalance;
    inDebit = debit;
    inCredit = credit;
    indivisualOpeningBalance = openingBalanceWithSign;
  });
}
//GET VALUE OF FIRST ROW AND LAST ROW
// @route    /api/report/transactionreport/ledger/set

router.get(
  "/set",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let resultArray = [];
    let resultArray1 = [];
    let firstdate = "2019-03-20T20:54:55.424Z"; //need to pass in url
    let endDate = "2019-04-23T08:16:27.463Z"; //need to pass in url
    let value = "5cb0a465f4a1734718406490";
    //req.params.value; //need to pass in url

    let givenfirstdate = new Date(firstdate);
    let givenlastdate = new Date(endDate);

    await AddLedger.find({
      companyId: req.user.companyId,
      _id: value,

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
      let obj = {};
      fData.splice(0, fData.length);

      obj.id = item._id;

      getCurrentBal(res, item._id, req.user.companyId, firstdate, endDate).then(
        () => {
          indivisualOpeningBalance >= 0
            ? ((obj.opBalDebit = 0),
              (obj.opBalCredit = indivisualOpeningBalance))
            : ((obj.opBalCredit = 0),
              (obj.opBalDebit = -indivisualOpeningBalance));
          obj.totalDebit = inDebit;
          obj.totalCredit = inCredit;
          indivisualOpeningBalance >= 0
            ? ((obj.addOpBalDebit = 0),
              (obj.addOpBalCredit = indivisualOpeningBalance))
            : ((obj.addOpBalCredit = 0),
              (obj.addOpBalDebit = -indivisualOpeningBalance));
          indivisualOpeningBalance >= 0
            ? ((obj.grTotDebit = inDebit),
              (obj.grTotCredit = inCredit + indivisualOpeningBalance))
            : ((obj.grTotCredit = inCredit),
              (obj.grTotDebit = inDebit - indivisualOpeningBalance));
          indivisualCurrentBal >= 0
            ? ((obj.balDebit = 0), (obj.balCredit = indivisualCurrentBal))
            : ((obj.balCredit = 0), (obj.balDebit = -indivisualCurrentBal));

          fData.push(obj);
          if (index + 1 === allLedger.length) {
            res.json(fData);
          }
        }
      );
    });

    // let ledgerResult1 = await AddLedger.find({
    //   companyId: req.user.companyId,
    //   _id: value
    // }).catch(err =>
    //   res.status(404).json({ message: "No ledger Found with this id " + err })
    // );
    // let obj = { ledger: {} };

    // ledgerResult1.forEach((item, index) => {
    //   obj.id = item._id;

    //   obj.date = "0000-00-00T20:54:55.424Z";
    //   obj.voucherNumber = "";
    //   obj.particulars = "";
    //   obj.details = "";
    //   obj.vouchertype = "";
    //   obj.naration = "Opening Balance";

    // getCurrentBal(res, item._id, req.user.companyId, firstdate, endDate).then(
    //   () => {
    //     obj.hey = indivisualOpeningBalance;
    //     indivisualOpeningBalance >= 0
    //       ? ((obj.debit = 0), (obj.credit = indivisualOpeningBalance))
    //       : ((obj.credit = 0), (obj.debit = -indivisualOpeningBalance));
    //     resultArray.push(obj);
    //     console.log(resultArray);
    //   }
    // );
    // });

    // let ledgerResult2 = await AddLedger.find({
    //   companyId: req.user.companyId,
    //   _id: value
    // }).catch(err =>
    //   res.status(404).json({ message: "No ledger Found with this id " + err })
    // );

    // ledgerResult2.forEach((item, index) => {
    //   let obj = { ledger: {} };
    //   obj.id = item._id;

    //   obj.date = "9999-99-01T20:54:55.424Z";
    //   obj.voucherNumber = "";
    //   obj.particulars = "";
    //   obj.details = "";
    //   obj.vouchertype = "";
    //   obj.naration = "Grand Total";

    //   getCurrentBal(res, item._id, req.user.companyId, firstdate, endDate).then(
    //     () => {
    //       obj.debit = indivisualDebit;
    //       obj.credit = indivisualCredit;
    //     }
    //   );
    //   resultArray.push(obj);
    // });

    // let ledgerResult3 = await AddLedger.find({
    //   companyId: req.user.companyId,
    //   _id: value
    // }).catch(err =>
    //   res.status(404).json({ message: "No ledger Found with this id " + err })
    // );

    // ledgerResult3.forEach((item, index) => {
    //   let obj = { ledger: {} };
    //   obj.id = item._id;

    //   obj.date = "9999-99-02T20:54:55.424Z";
    //   obj.voucherNumber = "";
    //   obj.particulars = "";
    //   obj.details = "";
    //   obj.vouchertype = "";
    //   obj.naration = "Balance";

    //   getCurrentBal(res, item._id, req.user.companyId, firstdate, endDate).then(
    //     () => {
    //       indivisualCurrentBal >= 0
    //         ? ((obj.debit = 0), (obj.credit = indivisualCurrentBal))
    //         : ((obj.credit = 0), (obj.debit = -indivisualCurrentBal));
    //     }
    //   );
    //   resultArray.push(obj);
    //   res.json(resultArray);
    //   console.log()
    // });
  }
);

// @type    get
// @route    /api/report/transactionreport/ledger/get
router.get(
  "/get",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let resultArray = [];
    let resultArray1 = [];
    let firstdate = "2019-03-20T20:54:55.424Z"; //need to pass in url
    let endDate = "2019-04-23T08:16:27.463Z"; //need to pass in url
    let value = "5cb0a465f4a1734718406490";
    //req.params.value; //need to pass in url

    let givenfirstdate = new Date(firstdate);
    let givenlastdate = new Date(endDate);

    let orderResult = await OrderBooking.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No OrderBooking Voucher Found" + err })
    );

    orderResult.forEach(one => {
      let getdate = new Date(one.orderDate);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.id = one._id;

        obj.date = one.orderDate;
        obj.voucherNumber = one.orderNo;
        obj.particulars = "by " + one.modeOfPayment.label;
        obj.details = "";
        obj.vouchertype = "Receipts";
        obj.naration = "Advance against Order No. " + one.orderNo;

        obj.debit = "0.00";
        obj.credit = one.amount;
        obj.ledger = one.ledger;
        resultArray.push(obj);
      }
    });

    let purchaseOrderResult = await PurchaseOrder.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No OrderBooking Voucher Found" + err })
    );
    purchaseOrderResult.forEach(one => {
      let getdate = new Date(one.orderDate);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.id = one._id;
        obj.date = one.orderDate;
        obj.voucherNumber = one.orderNo;
        obj.particulars = "To " + one.modeOfPayment.label;
        obj.details = "";
        obj.vouchertype = "Payment";
        obj.naration = "Advance against Order No. " + one.orderNo;

        obj.debit = one.advanceAmount;
        obj.credit = "0.00";
        obj.ledger = one.ledger;
        resultArray.push(obj);
      }
    });

    let saleResult = await SaleVoucher.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No SaleVoucher Found" + err })
    );

    saleResult.forEach(one => {
      let getdate = new Date(one.saleDate);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.id = one._id;

        obj.date = one.saleDate;
        obj.voucherNumber = one.paymentVoucherNo;
        obj.particulars = "By " + one.modeOfPayment.label;
        obj.details = "";
        obj.vouchertype = "Sale";
        obj.naration = one.remarks;
        one.dues >= 0
          ? ((obj.debit = one.amount), (obj.credit = "0.00"))
          : ((obj.debit = "0.00"), (obj.credit = one.amount));

        obj.ledger = one.ledger;
        resultArray.push(obj);
      }
    });

    let purchaseResult = await PurchaseVoucher.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No purchase Voucher Found" + err })
    );
    purchaseResult.forEach(one => {
      let getdate = new Date(one.purchaseDate);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.id = one._id;

        obj.date = one.purchaseDate;
        obj.voucherNumber = one.voucherNo;
        obj.particulars = "By Purchase A/c ";
        obj.details = "";
        obj.vouchertype = "Purchase";
        obj.naration = one.remarks;
        one.dues <= 0
          ? ((obj.debit = one.amount), (obj.credit = "0.00"))
          : ((obj.debit = "0.00"), (obj.credit = one.amount));

        obj.ledger = one.ledger;
        resultArray.push(obj);
      }
    });

    let paymentResult1 = await PaymentVoucher.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No Payment Voucher Found" + err })
    );

    paymentResult1.forEach(one => {
      let getdate = new Date(one.date);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.id = one._id;

        obj.date = one.date;
        obj.voucherNumber = one.paymentVoucherNumber;
        obj.particulars = "To " + one.modeOfPayment.label;
        obj.details = "";
        obj.vouchertype = "Payment";
        obj.naration = one.remarks;

        obj.debit = one.amount;
        obj.credit = "0.00";
        obj.ledger = one.ledger;
        resultArray.push(obj);
      }
    });

    let paymentResult2 = await PaymentVoucher.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No Payment Voucher Found" + err })
    );

    paymentResult2.forEach(one => {
      let getdate = new Date(one.date);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.id = one._id;

        obj.date = one.date;
        obj.voucherNumber = one.paymentVoucherNumber;
        obj.particulars = "To Discount";
        obj.details = "";
        obj.vouchertype = "Payment";
        obj.naration = one.remarks;

        obj.debit = one.discount;
        obj.credit = "0.00";
        obj.ledger = one.ledger;
        resultArray.push(obj);
      }
    });

    let receiptResult1 = await ReceiptVoucher.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No Receipt Voucher Found" + err })
    );

    receiptResult1.forEach(one => {
      let getdate = new Date(one.date);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.id = one._id;

        obj.date = one.date;
        obj.voucherNumber = one.receiptVoucherNumber;
        obj.particulars = "By " + one.modeOfReceipt.label;
        obj.details = "";
        obj.vouchertype = "Receipts";
        obj.naration = one.remarks;

        obj.debit = "0.00";
        obj.credit = one.amount;
        obj.ledger = one.ledger;
        resultArray.push(obj);
      }
    });

    let receiptResult2 = await ReceiptVoucher.find({
      companyId: req.user.companyId,
      "ledger.value": value
    }).catch(err =>
      res.status(404).json({ message: "No Receipt Voucher Found" + err })
    );

    receiptResult2.forEach(one => {
      let getdate = new Date(one.date);
      if (
        (getdate > givenfirstdate || getdate == givenfirstdate) &&
        (getdate == givenlastdate || getdate < givenlastdate)
      ) {
        let obj = { ledger: {} };
        obj.id = one._id;

        obj.date = one.date;
        obj.voucherNumber = one.receiptVoucherNumber;
        obj.particulars = "By Discount";
        obj.details = "";
        obj.vouchertype = "Receipts";
        obj.naration = one.remarks;

        obj.debit = "0.00";
        obj.credit = one.discount;
        obj.ledger = one.ledger;
        resultArray.push(obj);
      }
    });

    resultArray = bubbleSort(res, resultArray);
    res.json(resultArray);
  }
);

function bubbleSort(res, a) {
  console.log(a);
  var swapped;
  do {
    swapped = false;
    for (var i = 0; i < a.length - 1; i++) {
      if (new Date(a[i].date) > new Date(a[i + 1].date)) {
        var temp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
  return a;
  // a.forEach(one => {
  //   let obj = { ledger: {} };
  //   obj.id = one.id;
  //   if ((one.date = "")) {
  //     obj.date = "";
  //   } else if ((one.date = "")) {
  //     obj.date = "";
  //   } else {
  //     obj.date = one.date;
  //   }

  //   obj.voucherNumber = one.voucherNumber;
  //   obj.particulars = one.particulars;
  //   obj.details = one.details;
  //   obj.naration = one.naration;

  //   obj.debit = one.debit;
  //   obj.ledger = one.ledger;
  //   let resultArray1 = [];
  //   resultArray1.push(obj);
  //   return resultArray1;
  // });
}

module.exports = router;
