const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

const pdfMake = require("./pdfmake/pdfmake");
const vfsFonts = require("./pdfmake/vfs_fonts");

pdfMake.vfs = vfsFonts.pdfMake.vfs;

//globally declear icons base 64 format
  
let dataurlLogo =
"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";
let dataurlHome =
"iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF4SURBVGhD7dexTcRAEIVhkxBBTA50QAtAEXQBtEEX0AS0AB1AAcQQkXC8kc6SNfqNPTfrlU/aX/qSO9/zZqvrWq3Wot1s7WV38rt1ax/sSwfyIBvHPrPvVt2hPIk/fO9R7JlVdiTPQgcfsmfsWZ9/rmon8ib+EGNexX4zzD9TrTN5F3+AKfabU+nz31fpQj7Fv3wu+61tWP67xbuSL/EvjrKNS/eZWTS7nH7Ev3RXtLVY/QXlX1ha8cYuqKUUbeqCWkKxC2/uBVXaixxLqugFVZq92194szuXXS6o0j7EzhIqe0GVNrzwJruWEhdUad9iZ/u30hdUaXa20X9491LjgsqyM9pZZ0cjNaWj0ZrS0WhN6Wi0pnQ0SqLRBklHoyQabZB0NEqi0QZJR6MkGm2QdDRKotEGSUejJBptkHQ0SqLRBklHoyQabZB0NEqi0QZJR6MkGm2QdDRKotEGSUejJBptkHQ0SqLRBklHoyQabZBWq9VabV33B/mxZFHeGCEQAAAAAElFTkSuQmCC";
let dataurlPhone =
"iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHfSURBVGhD7dlPS5RRGIbxkUjb1CKpZQTWJqONG6u9VGhFBaJ9jAjCVkbfoHAnbm0TFW3dCW3qI0SkBUX5Fy20yK57MXA43JPjxMw8B94LfisZ5jnq+57zztSqqqqqwjaKT9j7h88YQ8iW4YbOfUHIduAGdo4iXCtwwzonEa6PcMM65xCud3DDOiMI1zO4YZ2HCNdjuGGdBYTrLtywzk8cQahOww3byBDC9QFu2Nw2+hGuObiBU9rwbiBkGswNXafhbyFsvfgON/wubiN8M8iH/4U7KKIL+IN0AfdRVK+RLmARPSimy0gXIBMoqvyv8BUhj9GNOgMdGdJFvEBRPUK6ALmHYtK+kD8n/MZVFNNZbCJdhM5CF1FM48j3hnVcwkE6jkF05Sj+AOkCZAtX0Ew3sQa9TjcHPRTpyU6Pp3rGPoFjaGvumKFrYr+dWmeoZj+20e36OtrSITyFe+PncPuEzlA6CLrXNKJPCNvaFPJrQvTbm0T92NHK8HVtT0eLDbg3fwP9W+kU637ejI6kW+xbuAH+V8fqwzR+wA3Sqo43gJdww7Siaw3jFdxFfhBd7zye4BvcgPsJ02Ho259ZvIcbNreEsJ2CbsE6qs9Dp10tbBXarfVN0TVUVVVVhatW+wvkaY04ECfQjQAAAABJRU5ErkJggg==";
let dataurlMail =
"iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFvSURBVGhD7ZhLSsVAEEUDTl2Czp27EJfytuI2/CAuxF04fuJnKui9g0Ao7svtjiEpsA6cSdK3uumk3qeHoiiKohBcwkf4CX92lmt4glewCS7+CFWxPX2DF9DCnVcFMvgALV9QhTP4AS0xdANfw7Ut5JycO163qMA5vIXfMN5fW87BuTgnifctc4Fr+ALjmLVkbc4xJY6xuMAZPMA1e4W1WJO1I3GsJQaeofr44jXei+N77a1viQE6t0NLm3xs0oh7whYVGlXvKOlp8tikU1p6zKJCU/+ygDU2wKJCyp5XYM1X0KJCc7om7G1Sp0WFnHM7HHFN6rSoUKun3vGRliZ1WlSoR9XkPU3qtKjQEscmX/o9cUqLCmXSokKZtKhQJi0qlEmLCmXSokKZtKhQJi0qlEmLCmXSokKZtCz9lbiFTQdbPEhV4QzeQQtPgXmQqgrsKQ+c1R8jCU+oeZDKR6aKbek7vIfNiy+Koij+C8PwC1EabXjNq/50AAAAAElFTkSuQmCC";
let dataurlGst =
"iVBORw0KGgoAAAANSUhEUgAAAHAAAAB5CAMAAADWMVWxAAAAZlBMVEX///8AAAD5+fnY2Njw8PDt7e01NTVnZ2eqqqrCwsLq6urz8/OhoaHn5+e2trZ+fn7Nzc3f39+YmJiwsLCHh4cLCwuQkJA/Pz8dHR1VVVW8vLxgYGAlJSVxcXEtLS1OTk5GRkYXFxcDfbvQAAAESElEQVRoge2a13KjMBSGj5qNEAIVisH9/V9yj8AFE2/iCymzO8M/noDL6IukU2UDrFq1atWqVatWrbLt3iUcntLpyutqvKOOoEwyntp3rcCrvhDSc5zePvB2eTJg3hByrYf2EDibY09Glcl4ACX5qiIh7x2xSsoDKBa8Q7oNvOn8CkzpE5PMCy+hhT60nwOP6Xng58CULnEXz2bivwD8bSn2IpUcuH11i21yoDttZjql90NMUXOl5/2+2u1MbXreIl8k9/z88ApMHkz3ZKF9Wt4yHZLEGZ9dvwKvLB2Pdl95hHTpnLF+xyOkTsWT73mEyDQ80fwN2IgkwC8e8VQS33jjEU8l8A39HY8QGx14/h54js3LvucRksXliZ94hMS11OpnYNSuhv3MIyRmTD1+AoxY9j8m2LeuHgP4tXIOG+DOTeoiT/EWtK9jzKQtIScNWOS7x6SmD0QL4vxWVhgw566i6JIeqsOFQ9d0nYNsc5mi7CFWpzFMvAvoa5iHvWB6qK9kO4R/pJ3FvCES8GYy7VixHQ6HscDXw/H26hMYyWz4ZhquCEOXSuTolGeJy2eWM9zEWVN2y4N1WNvKS7xst+TUW2gXwCaOnd5b3tNU0+wRqOkuhJZiAURjiqH2PpwD0R4LjYQCzL7i0C+BcSr/ZxytQ/uZ17ep0OO00O0TGCeezlvQw6NQ7E73l2Zvx2lPFz3vd/pPgR+liklxPP+D5HtXHKNxnwPjHDG8Huc1u+f9ojmNdfotTs8R94PVzE2grdHmtRo/RSqkHpvY3GpBEThjeU9fiLHqKHsfEOOLLhzmfXohTQ7aidf1jlZ+30qMHqAMmaNXWOUgvEcjyWctVbw+UUwZUYYGo692wd2OYzFu5wXkJmIpPA3LMTHsw5OxH9RjzzQLQ1F7/bH5pbi26Gn00ITNOgf4rOWI3AYb3CuNufhkcZo7OqI02IdTRkr2M/EeVzCk/GZcSj72Swhmo9P0Kc6iy7MAjX63C+3uOdjsJEM2serDhXjYOs2CxYwWCrw4VhjNbPpzaD0uqB295RfOhMOBxmX82xVVZHd4r2lBMcjYkJ7TTxGdIdiNbnYqFJHpT4W305kFPZGam136Q+HynhbKe0hPLP/YtXKDrfAvfP00Q4j0Lrhq1apVq1atWrXqvf76rfXbNwQNDyVA8PAArOM0CBEe9KOunwtmOFCaS89pDpyrPJc0V5CrgYbRFNXAtboPJkuQHgqvTaaNz1UFnlGDT70th08OUpxh3jMz2MzpIjPOZnhrSmfL3PsczKAzaZwpCpxvjZ0Tx1I/A1cI8BxKXWaqHgSUOQy6lJ90qjaTWjLphcRhmPKgvZGGFYxBkSklmco0zsoPuHxe44w9qAIKw0oDpVGyss4avB8MCP/J4ZthQmlqDEhhciksMENNbixIphXTVFotqQWrbztqBmVKih+SkkupwIKWMN5zlu6nrv+w/gA6/DKwuXcg+gAAAABJRU5ErkJggg==";


// @type    POST
//@route    /api/print/pdfmake
// @desc    route for getting salevoucher data as pdf file
// @access  PRIVATE But Route is public
router.post("/pdf/salevoucher", async (req, res, next) => {

  let companyName = "";
  let companyAddress = "";
  let companyStateCode = "";
  let companyPinCode = "";
  let companyCountry = "";
  let companyMobile = "";
  let companyGstIn = "";
  let companyDistrict = "";
  let companyState = "";
  let companyEmail = "";
  //getting sold by company data from database

  const Person = require("../../../models/Person");

  const result = await Person.find({ companyId: req.body.companyId });
  if (result.length > 0) {
    companyName = result[0].companyName;
    companyAddress = result[0].address;
    companyGstIn = result[0].gstIn;
    companyCountry = result[0].country;
    companyEmail = result[0].email;
    companyMobile = result[0].mobile;
    companyPinCode = result[0].pinCode;
    companyStateCode = result[0].stateCode;
    companyDistrict = result[0].district;
    companyState = result[0].state;
  }

  let total = 0,
    totalcgstvalue = 0,
    totalsgstvalue = 0,
    totaligstvalue = 0;
  //getting data from frontend
  let customerName = "";
  if (req.body.ledgerName !== "Cash") customerName = req.body.ledgerName;
  else customerName = req.body.partyName;

  //getting invoice date
  function invoiceDateGet(str) {
    let yr = str.slice(0, 4);
    let mm = str.slice(5, 7);
    let dd = str.slice(8, 10);
    return dd + "-" + mm + "-" + yr;
  }

  let invoice = req.body.invoiceNumber,
    orderNoAndDate = req.body.orderNo,
    invoiceDate = await invoiceDateGet(req.body.invoiceDate),
    nextPaymenteDate = await invoiceDateGet(req.body.nextDate),
    customerAddress = req.body.address,
    customerStateCode = req.body.state,
    customerMobile = req.body.mobileNo,
    customerGstIn = req.body.customerGST?req.body.customerGST:"NA" ,
    customerPinCode = req.body.customerPinCode ? req.body.customerPinCode : "",
    customerCountry = req.body.customerCountry ? req.body.customerCountry : "";

  let itemCost = req.body.itemCost,
    totalGst = req.body.gst,
    transportCost = req.body.freight,
    advance = req.body.advance,
    discount = req.body.discount,
    netAmount = req.body.totalAmount,
    paid = req.body.cashReceived,
    dues = req.body.dues;

  let item = [];
  var rows = [];
  var rows2 = [];
  var rows3 = [];
  //req.body.products
  req.body.products.forEach((element, index) => {
    const dataObj = {};
    dataObj.no = index + 1;
    dataObj.product = element.product.value;
    dataObj.hsn = element.product.hsn;
    dataObj.qty = element.quantity;
    dataObj.unitprice = element.rate;
    dataObj.cgstpercentage = element.tax.cGst;
    dataObj.cgstvalue = (element.tax.cGst * element.product.sellingPrice) / 100;
    dataObj.sgstpercentage = element.tax.sGst;
    dataObj.sgstvalue = (element.tax.sGst * element.product.sellingPrice) / 100;
    dataObj.igstpercentage = element.tax.iGst;
    dataObj.igstvalue = (element.tax.cGst * element.product.sellingPrice) / 100;
    dataObj.amount = element.amount;
    item.push(dataObj);
  });

  rows3.push([
    { text: "NO", style: "tablerowheadings", alignment: "left" },
    { text: "PRODUCT", style: "tablerowheadings", alignment: "left" },
    { text: "HSN/SAC", style: "tablerowheadings", alignment: "center" },
    { text: "QTY", style: "tablerowheadings", alignment: "center" },
    { text: "UNIT PRICE", style: "tablerowheadings", alignment: "center" },
    { text: "CGST", style: "tablerowheadings", alignment: "center" },
    { text: "SGST", style: "tablerowheadings", alignment: "center" },
    { text: "IGST", style: "tablerowheadings", alignment: "center" },
    { text: "TOTAL", style: "tablerowheadings", alignment: "right" }
  ]);
  for (var i of item) {
    rows.push([
      { text: "" + i.no, style: "tablerowdatas", alignment: "left" },
      { text: "" + i.product, style: "tablerowdatas", alignment: "center" },
      { text: "" + i.hsn, style: "tablerowdatas", alignment: "center" },
      { text: "" + i.qty, style: "tablerowdatas", alignment: "center" },
      { text: "₹ " + i.unitprice, style: "tablerowdatas", alignment: "center" },
      [
        {
          text: "₹ " + i.cgstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.cgstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],

      [
        {
          text: "₹ " + i.sgstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.sgstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],

      [
        {
          text: "₹ " + i.igstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.igstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],
      { text: "₹ " + i.amount, style: "tablerowdatas", alignment: "right" }
    ]);
    total = total + +i.amount;    
    totalcgstvalue = totalcgstvalue +  +i.cgstvalue;
    totalsgstvalue = totalsgstvalue +  +i.sgstvalue;
    totaligstvalue = totaligstvalue +  +i.igstvalue;
  }
  rows2.push([
    "  ",
    { text: `TOTAL: `, style: "tablerowheadings", alignment: "center" },
    "  ",
    "  ",
    "  ",
    {
      text: `₹ ${totalcgstvalue}`,
      style: "tablerowheadings",
      alignment: "center"
      //margin: [8, 0, 0, 0]
    },
    {
      text: ` ₹ ${totalsgstvalue} `,
      style: "tablerowheadings",
      alignment: "right"
      //margin: [10, 0, 0, 0]
    },
    {
      text: ` ₹ ${totaligstvalue} `,
      style: "tablerowheadings",
      alignment: "right"
      //margin: [10, 0, 0, 0]
    },
    { text: `₹ ${total}`, style: "tablerowheadings", alignment: "right" }
  ]);

  // function getWord(num) {
  //   let a = num.split(" ");
  //   let word = "";
  //   for (let i = 0; i < a.length; i++) {
  //     word += a[i][0].toUpperCase();
  //     word += a[i].slice(1) + " ";
  //   }
  //   return word;
  // }
  let totalInWord = req.body.totalInWord;

  var documentDefinition = {
    content: [
      {
        stack: [
          {
            //1st row
            text: "Tax Invoice",
            style: "header",
            alignment: "center"
          },
          {
            //2nd row
            margin: [0, 4, 0, 0],
            alignment: "justify",
            columns: [
              {
                image: `data:image/png;base64,${dataurlLogo}`,
                width: 100,
                height: 60
              },
              {},
              {
                margin: [25, 0, 0, 0],
                alignment: "right",
                stack: [
                  {
                    text: "Original for Recipient",
                    fontSize: 13
                  },
                  {
                    text: [
                      { text: `Invoice Number: `, style: "upperright" },
                      { text: `${invoice}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `OrderNo & Date: `, style: "upperright" },
                      { text: `${orderNoAndDate}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `Next Payment Date: `, style: "upperright" },
                      { text: `${nextPaymenteDate}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `Invoice Date: `, style: "upperright" },
                      { text: `${invoiceDate}`, style: "upperright" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //3rd row
            columns: [
              {
                //1st column
                alignment: "left",
                stack: [
                  {
                    alignment: "center",
                    text: "Sold By: ",
                    bold: true
                  },
                  {
                    text: `${companyName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${companyDistrict} - ${companyState} ${companyStateCode}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${companyPinCode}, ${companyCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        columns: [
                          {
                            margin: [0, 4, 0, 0],
                            image: `data:image/png;base64,${dataurlGst}`,
                            width: 20,
                            height: 20
                          },
                          {
                            text: `${companyGstIn}`,
                            margin: [0, 4, 0, 0],
                            style: "companyandclient"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlMail}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyEmail}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  }
                ]
              },
              {
                //2nd column
                alignment: "left",
                margin: [20, 0, 0, 0],
                stack: [
                  {
                    text: "Billing To ",
                    bold: true,
                    alignment: "center"
                  },
                  {
                    text: `${customerName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${customerAddress} - ${customerStateCode} `,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${customerPinCode}  ${customerCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  // {
                  //   columns: [
                  //     {
                  //       margin: [0, 4, 0, 0],
                  //       image: `data:image/png;base64,${dataurlMail}`,
                  //       width: 18,
                  //       height: 18
                  //     },
                  //     {
                  //       text: `${customerEmail}`,
                  //       margin: [15, 4, 0, 0],
                  //       fontSize: 11,
                  //       width: 90
                  //     }
                  //   ]
                  // },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlGst}`,
                        width: 20,
                        height: 20
                      },
                      {
                        text: `${customerGstIn}`,
                        margin: [0, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `Place of supply: ${customerStateCode}`,
                    style: "companyandclient",
                    margin: [20, 4, 0, 0]
                  }
                ]
              },
              {
                //3rd column
                alignment: "left",
                stack: [
                  {
                    text: "Shipping Address ",
                    bold: true,
                    alignment: "center"
                  },
                  {
                    text: `${customerName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${customerAddress} - ${customerStateCode} `,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${customerPinCode}  ${customerCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  // {
                  //   columns: [
                  //     {
                  //       margin: [0, 4, 0, 0],
                  //       image: `data:image/png;base64,${dataurlMail}`,
                  //       width: 18,
                  //       height: 18
                  //     },
                  //     {
                  //       text: `${customerEmail}`,
                  //       margin: [15, 4, 0, 0],
                  //       fontSize: 11,
                  //       width: 90
                  //     }
                  //   ]
                  // },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlGst}`,
                        width: 20,
                        height: 20
                      },
                      {
                        text: `${customerGstIn}`,
                        margin: [0, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows3
            },
            layout: "headerLineOnly"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows
            },
            layout: "headerLineOnly"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows2
            },
            layout: "noBorders"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },

          {
            text: "\n\n"
          },
          {
            //5th row
            alignment: "justify",
            columns: [
              {
                //1 column
                alignment: "left",
                stack: [
                  {
                    text: `Total In Word: ₹ ${totalInWord}\n`,
                    fontSize: 10
                  },
                  {
                    text: `${
                      req.body.vehicle ? "Vehicle: " + req.body.vehicle : ""
                    }`,
                    fontSize: 10
                  },
                  {
                    text:
                      "\n\n\n\nAUTHORIZED SIGNATORY\n\n\n______________________________",
                    fontSize: 10,
                    bold: true,
                    color: "blue"
                  }
                ]
              },
              {
                //2 column
                alignment: "right",
                fontSize: 10,
                bold: true,
                margin: [8, 4, 0, 0],
                stack: [
                  {
                    text: `${"Item Cost:".toUpperCase()}`
                  },
                  {
                    text: `${"Total Gst:".toUpperCase()}`
                  },
                  {
                    text: `${"CGST:".toUpperCase()}`
                  },
                  {
                    text: `${"SGST:".toUpperCase()}`
                  },
                  {
                    text: `${"IGST:".toUpperCase()}`
                  },
                  {
                    text: `${"Transport Cost:".toUpperCase()}`
                  },
                  {
                    text: `${"Advanced:".toUpperCase()}`
                  },
                  {
                    text: `${"Discount:".toUpperCase()}`
                  },
                  {
                    text: `${"Net Amount:".toUpperCase()}`
                  },
                  {
                    text: `${"Paid:".toUpperCase()}`
                  },
                  {
                    text: `${"Dues:".toUpperCase()}`,
                    color: "red"
                  }
                ]
              },
              {
                //3 column
                alignment: "right",
                fontSize: 10,
                bold: true,
                stack: [
                  {
                    text: `₹ ${itemCost}`
                  },
                  {
                    text: ` ₹ ${totalGst}`
                  },
                  {
                    text: `₹ ${totalcgstvalue}`
                  },
                  {
                    text: `₹ ${totalsgstvalue}`
                  },
                  {
                    text: `₹ ${totaligstvalue}`
                  },
                  {
                    text: `₹ ${transportCost}`
                  },
                  {
                    text: `₹ ${advance}`
                  },
                  {
                    text: `${
                      req.body.isPercent
                        ? " ( " + req.body.discountInput + " % ) "
                        : ""
                    }  ₹ ${discount}`
                  },
                  {
                    text: `₹ ${netAmount}`
                  },
                  {
                    text: `₹ ${paid}`
                  },
                  {
                    text: `₹ ${dues}`,
                    color: "red"
                  }
                ]
              }
            ]
          },
          {
            text:
              "\n\n\n\n\n\nIssued using BRICK MASTER  from www.brickmaster.in",
            alignment: "center",
            fontSize: 7
          }
        ],
        alignment: "center",
        margin: [0, 0, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "justify"
      },
      font: {
        fontSize: 15
      },
      tablerowheadings: {
        fontSize: 10,
        bold: true,
        color: "blue"
      },
      tablerowdatas: {
        fontSize: 10,
        bold: true,
        color: "black"
      },
      companyandclient: {
        fontSize: 10,
        color: "black"
      },
      upperright: {
        fontSize: 10,
        bold: true,
        margin: [0, 4, 0, 0]
      }
    }
  };

  const pdfDoc = pdfMake.createPdf(documentDefinition);
  pdfDoc.getBase64(data => {
    res.end(data);
  });
});

// @type    POST
//@route    /api/print/pdfmake/pdf/purchasevoucher
// @desc    route for getting purchasevoucher data as pdf file
// @access  PRIVATE But Route is public
router.post("/pdf/purchasevoucher", async (req, res, next) => {

  let companyName = "";
  let companyAddress = "";
  let companyStateCode = "";
  let companyPinCode = "";
  let companyCountry = "";
  let companyMobile = "";
  let companyGstIn = "";
  let companyDistrict = "";
  let companyState = "";
  let companyEmail = "";
  //getting sold by company data from database

  const Person = require("../../../models/Person");

  const result = await Person.find({ companyId: req.body.companyId });
  if (result.length > 0) {
    companyName = result[0].companyName;
    companyAddress = result[0].address;
    companyGstIn = result[0].gstIn;
    companyCountry = result[0].country;
    companyEmail = result[0].email;
    companyMobile = result[0].mobile;
    companyPinCode = result[0].pinCode;
    companyStateCode = result[0].stateCode;
    companyDistrict = result[0].district;
    companyState = result[0].state;
  }

  let total = 0,
    totalcgstvalue = 0,
    totalsgstvalue = 0,
    totaligstvalue = 0;
  //getting data from frontend
  let customerName = "";
  if (req.body.ledgerName !== "Cash") customerName = req.body.ledgerName;
  else customerName = req.body.partyName;

  //getting invoice date
  function invoiceDateGet(str) {
    let yr = str.slice(0, 4);
    let mm = str.slice(5, 7);
    let dd = str.slice(8, 10);
    return dd + "-" + mm + "-" + yr;
  }

  let invoice = req.body.invoiceNumber,
    orderNoAndDate = req.body.orderNo,
    invoiceDate = await invoiceDateGet(req.body.invoiceDate),
    nextPaymenteDate = await invoiceDateGet(req.body.nextDate),
    customerAddress = req.body.address,
    customerStateCode = req.body.state,
    customerMobile = req.body.mobileNo,
    customerGstIn = req.body.customerGST?req.body.customerGST:"NA" ,    
    customerPinCode = req.body.customerPinCode ? req.body.customerPinCode : "",
    customerCountry = req.body.customerCountry ? req.body.customerCountry : "",
    customerDistrict = req.body.customerDistrict
      ? req.body.customerDistrict
      : "";
  customerState = req.body.customerState ? req.body.customerState : "";
  customerStateCode = req.body.state
    ? req.body.state
    : "";

  let itemCost = req.body.itemCost,
    totalGst = req.body.gst,
    transportCost = req.body.freight,
    advance = req.body.advance,
    discount = req.body.discount,
    netAmount = req.body.totalAmount,
    paid = req.body.cashReceived,
    dues = req.body.dues;

  let item = [];
  var rows = [];
  var rows2 = [];
  var rows3 = [];
  //req.body.products
  req.body.products.forEach((element, index) => {
    const dataObj = {};
    dataObj.no = index + 1;
    dataObj.product = element.product.value;
    dataObj.hsn = element.product.hsn;
    dataObj.qty = element.quantity;
    dataObj.unitprice = element.rate;
    dataObj.cgstpercentage = element.tax.cGst;
    dataObj.cgstvalue = (element.tax.cGst * element.product.sellingPrice) / 100;
    dataObj.sgstpercentage = element.tax.sGst;
    dataObj.sgstvalue = (element.tax.sGst * element.product.sellingPrice) / 100;
    dataObj.igstpercentage = element.tax.iGst;
    dataObj.igstvalue = (element.tax.cGst * element.product.sellingPrice) / 100;
    dataObj.amount = element.amount;
    item.push(dataObj);
  });

  rows3.push([
    { text: "NO", style: "tablerowheadings", alignment: "left" },
    { text: "PRODUCT", style: "tablerowheadings", alignment: "left" },
    { text: "HSN/SAC", style: "tablerowheadings", alignment: "center" },
    { text: "QTY", style: "tablerowheadings", alignment: "center" },
    { text: "UNIT PRICE", style: "tablerowheadings", alignment: "center" },
    { text: "CGST", style: "tablerowheadings", alignment: "center" },
    { text: "SGST", style: "tablerowheadings", alignment: "center" },
    { text: "IGST", style: "tablerowheadings", alignment: "center" },
    { text: "TOTAL", style: "tablerowheadings", alignment: "right" }
  ]);
  for (var i of item) {
    rows.push([
      { text: "" + i.no, style: "tablerowdatas", alignment: "left" },
      { text: "" + i.product, style: "tablerowdatas", alignment: "center" },
      { text: "" + i.hsn, style: "tablerowdatas", alignment: "center" },
      { text: "" + i.qty, style: "tablerowdatas", alignment: "center" },
      { text: "₹ " + i.unitprice, style: "tablerowdatas", alignment: "center" },
      [
        {
          text: "₹ " + i.cgstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.cgstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],

      [
        {
          text: "₹ " + i.sgstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.sgstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],

      [
        {
          text: "₹ " + i.igstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.igstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],
      { text: "₹ " + i.amount, style: "tablerowdatas", alignment: "right" }
    ]);
    total = total + +i.amount;    
    totalcgstvalue = totalcgstvalue +  +i.cgstvalue;
    totalsgstvalue = totalsgstvalue +  +i.sgstvalue;
    totaligstvalue = totaligstvalue +  +i.igstvalue;
  }
  rows2.push([
    { text: ``, style: "tablerowheadings", alignment: "center" },    
    { text: `TOTAL: `, style: "tablerowheadings", alignment: "center" },
    { text: ``, style: "tablerowheadings", alignment: "center" },    
    { text: ``, style: "tablerowheadings", alignment: "center" },    
    { text: ``, style: "tablerowheadings", alignment: "center" },    
    {
      text: `₹ ${totalcgstvalue}`,
      style: "tablerowheadings",
      alignment: "center"
      //margin: [8, 0, 0, 0]
    },
    {
      text: ` ₹ ${totalsgstvalue} `,
      style: "tablerowheadings",
      alignment: "right"
      //margin: [10, 0, 0, 0]
    },
    {
      text: ` ₹ ${totaligstvalue} `,
      style: "tablerowheadings",
      alignment: "right"
      //margin: [10, 0, 0, 0]
    },
    { text: `₹ ${total}`, style: "tablerowheadings", alignment: "right" }
  ]);

  function getWord(num) {
    let a = num.split(" ");
    let word = "";
    for (let i = 0; i < a.length; i++) {
      word += a[i][0].toUpperCase();
      word += a[i].slice(1) + " ";
    }
    return word;
  }
  let totalInWord = await getWord(req.body.totalInWord);

  var documentDefinition = {
    content: [
      {
        stack: [
          {
            //1st row
            text: "Purchase Tax Invoice",
            style: "header",
            alignment: "center"
          },
          {
            //2nd row
            margin: [0, 4, 0, 0],
            alignment: "justify",
            columns: [
              {
                image: `data:image/png;base64,${dataurlLogo}`,
                width: 100,
                height: 60
              },
              {},
              {
                margin: [25, 0, 0, 0],
                alignment: "right",
                stack: [
                  {
                    text: "Original for Recipient",
                    fontSize: 13
                  },
                  {
                    text: [
                      { text: `Invoice Number: `, style: "upperright" },
                      { text: `${invoice}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      {
                        text: `Purchase OrderNo & Date: `,
                        style: "upperright"
                      },
                      { text: `${orderNoAndDate}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `Next Payment Date: `, style: "upperright" },
                      { text: `${nextPaymenteDate}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `Invoice Date: `, style: "upperright" },
                      { text: `${invoiceDate}`, style: "upperright" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //3rd row
            columns: [
              {
                //1st column
                alignment: "left",
                stack: [
                  {
                    alignment: "center",
                    text: "Purchased From: ",
                    bold: true
                  },
                  {
                    text: `${customerName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${customerDistrict} - ${customerState} ${customerStateCode}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${customerPinCode}, ${customerCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        columns: [
                          {
                            margin: [0, 4, 0, 0],
                            image: `data:image/png;base64,${dataurlGst}`,
                            width: 20,
                            height: 20
                          },
                          {
                            text: `${customerGstIn}`,
                            margin: [0, 4, 0, 0],
                            style: "companyandclient"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                //2nd column
                alignment: "left",
                stack: [
                  {
                    alignment: "center",
                    text: "Billing To: ",
                    bold: true
                  },
                  {
                    text: `${companyName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${companyDistrict} - ${companyState} ${companyStateCode}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${companyPinCode}, ${companyCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        columns: [
                          {
                            margin: [0, 4, 0, 0],
                            image: `data:image/png;base64,${dataurlGst}`,
                            width: 20,
                            height: 20
                          },
                          {
                            text: `${companyGstIn}`,
                            margin: [0, 4, 0, 0],
                            style: "companyandclient"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlMail}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyEmail}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `Place of supply: ${companyStateCode}`,
                    style: "companyandclient",
                    margin: [20, 4, 0, 0]
                  }
                ]
              },
              {
                //3rd column
                alignment: "left",
                stack: [
                  {
                    alignment: "center",
                    text: "Shipping Address: ",
                    bold: true
                  },
                  {
                    text: `${companyName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${companyDistrict} - ${companyState} ${companyStateCode}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${companyPinCode}, ${companyCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        columns: [
                          {
                            margin: [0, 4, 0, 0],
                            image: `data:image/png;base64,${dataurlGst}`,
                            width: 20,
                            height: 20
                          },
                          {
                            text: `${companyGstIn}`,
                            margin: [0, 4, 0, 0],
                            style: "companyandclient"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlMail}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyEmail}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows3
            },
            layout: "headerLineOnly"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows
            },
            layout: "headerLineOnly"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows2
            },
            layout: "noBorders"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },

          {
            text: "\n\n"
          },
          {
            //5th row
            alignment: "justify",
            columns: [
              {
                //1 column
                alignment: "left",
                stack: [
                  {
                    text: `Total In Word: ₹ ${totalInWord}\n`,
                    fontSize: 10
                  },
                  {
                    text: `${
                      req.body.vehicle ? "Vehicle: " + req.body.vehicle : ""
                    }`,
                    fontSize: 10
                  },
                  {
                    text:
                      "\n\n\n\nAUTHORIZED SIGNATORY\n\n\n______________________________",
                    fontSize: 10,
                    bold: true,
                    color: "blue"
                  }
                ]
              },
              {
                //2 column
                alignment: "right",
                fontSize: 10,
                bold: true,
                margin: [8, 4, 0, 0],
                stack: [
                  {
                    text: `${"Item Cost:".toUpperCase()}`
                  },
                  {
                    text: `${"Total Gst:".toUpperCase()}`
                  },
                  {
                    text: `${"CGST:".toUpperCase()}`
                  },
                  {
                    text: `${"SGST:".toUpperCase()}`
                  },
                  {
                    text: `${"IGST:".toUpperCase()}`
                  },
                  {
                    text: `${"Transport Cost:".toUpperCase()}`
                  },
                  {
                    text: `${"Advanced:".toUpperCase()}`
                  },
                  {
                    text: `${"Discount:".toUpperCase()}`
                  },
                  {
                    text: `${"Net Amount:".toUpperCase()}`
                  },
                  {
                    text: `${"Paid:".toUpperCase()}`
                  },
                  {
                    text: `${"Dues:".toUpperCase()}`,
                    color: "red"
                  }
                ]
              },
              {
                //3 column
                alignment: "right",
                fontSize: 10,
                bold: true,
                stack: [
                  {
                    text: `₹ ${itemCost}`
                  },
                  {
                    text: ` ₹ ${totalGst}`
                  },
                  {
                    text: `₹ ${totalcgstvalue}`
                  },
                  {
                    text: `₹ ${totalsgstvalue}`
                  },
                  {
                    text: `₹ ${totaligstvalue}`
                  },
                  {
                    text: `₹ ${transportCost}`
                  },
                  {
                    text: `₹ ${advance}`
                  },
                  {
                    text: `${
                      req.body.isPercent
                        ? " ( " + req.body.discountInput + " % ) "
                        : ""
                    }  ₹ ${discount}`
                  },
                  {
                    text: `₹ ${netAmount}`
                  },
                  {
                    text: `₹ ${paid}`
                  },
                  {
                    text: `₹ ${dues}`,
                    color: "red"
                  }
                ]
              }
            ]
          },
          {
            text:
              "\n\n\n\n\n\nIssued using BRICK MASTER  from www.brickmaster.in",
            alignment: "center",
            fontSize: 7
          }
        ],
        alignment: "center",
        margin: [0, 0, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "justify"
      },
      font: {
        fontSize: 15
      },
      tablerowheadings: {
        fontSize: 10,
        bold: true,
        color: "blue"
      },
      tablerowdatas: {
        fontSize: 10,
        bold: true,
        color: "black"
      },
      companyandclient: {
        fontSize: 10,
        color: "black"
      },
      upperright: {
        fontSize: 10,
        bold: true,
        margin: [0, 4, 0, 0]
      }
    }
  };

  const pdfDoc = pdfMake.createPdf(documentDefinition);
  pdfDoc.getBase64(data => {
    res.end(data);
  });
});

// @type    POST
//@route    /api/print/pdfmake
// @desc    route for getting saleorder data as pdf file
// @access  PRIVATE But Route is public
router.post("/pdf/saleorder", async (req, res, next) => {

  let companyName = "";
  let companyAddress = "";
  let companyStateCode = "";
  let companyPinCode = "";
  let companyCountry = "";
  let companyMobile = "";
  let companyGstIn = "";
  let companyDistrict = "";
  let companyState = "";
  let companyEmail = "";
  //getting sold by company data from database

  const Person = require("../../../models/Person");
  

  const result = await Person.find({ companyId: req.body.companyId });
  if (result.length > 0) {
    companyName = result[0].companyName;
    companyAddress = result[0].address;
    companyGstIn = result[0].gstIn;
    companyCountry = result[0].country;
    companyEmail = result[0].email;
    companyMobile = result[0].mobile;
    companyPinCode = result[0].pinCode;
    companyStateCode = result[0].stateCode;
    companyDistrict = result[0].district;
    companyState = result[0].state;
  }
  

  let total = 0,
    totalcgstvalue = 0,
    totalsgstvalue = 0,
    totaligstvalue = 0;
  //getting data from frontend
  let customerName = "";
  if (req.body.customerName) customerName = req.body.customerName;

  //getting invoice date
  function invoiceDateGet(str) {
    let yr = str.slice(0, 4);
    let mm = str.slice(5, 7);
    let dd = str.slice(8, 10);
    return dd + "-" + mm + "-" + yr;
  }

  let invoice = req.body.invoiceNumber,
    invoiceDate = await invoiceDateGet(req.body.invoiceDate),
    orderNoAndDate = req.body.invoiceNumber +" / "+ invoiceDate,
    customerAddress = req.body.customerAddress,
    customerStateCode = req.body.state,
    customerMobile = req.body.customerMobileNo,
    customerGstIn = req.body.customerGST?req.body.customerGST:"NA",
    customerPinCode = req.body.customerPinCode ? req.body.customerPinCode : "",
    customerCountry = req.body.customerCountry ? req.body.customerCountry : "";


    //need to calculate
  let itemCost = req.body.itemCost,
    totalGst = req.body.gst,
    transportCost = req.body.freight,
    advance = req.body.advance,
    netAmount = req.body.totalAmount;
    dues = req.body.dues;

  let item = [];
  var rows = [];
  var rows2 = [];
  var rows3 = [];
  //req.body.products
  req.body.products.forEach((element, index) => {
    const dataObj = {};
    dataObj.no = index + 1;
    dataObj.product = element.product.value;
    dataObj.hsn = element.product.hsn;
    dataObj.qty = element.quantity;
    dataObj.unitprice = element.rate;
    dataObj.cgstpercentage = element.tax.cGst;
    dataObj.cgstvalue = (element.tax.cGst * element.product.sellingPrice) / 100;
    dataObj.sgstpercentage = element.tax.sGst;
    dataObj.sgstvalue = (element.tax.sGst * element.product.sellingPrice) / 100;
    dataObj.igstpercentage = element.tax.iGst;
    dataObj.igstvalue = (element.tax.cGst * element.product.sellingPrice) / 100;
    dataObj.amount = element.amount;
    item.push(dataObj);
  });

  rows3.push([
    { text: "NO", style: "tablerowheadings", alignment: "left" },
    { text: "PRODUCT", style: "tablerowheadings", alignment: "left" },
    { text: "HSN/SAC", style: "tablerowheadings", alignment: "center" },
    { text: "QTY", style: "tablerowheadings", alignment: "center" },
    { text: "UNIT PRICE", style: "tablerowheadings", alignment: "center" },
    { text: "CGST", style: "tablerowheadings", alignment: "center" },
    { text: "SGST", style: "tablerowheadings", alignment: "center" },
    { text: "IGST", style: "tablerowheadings", alignment: "center" },
    { text: "TOTAL", style: "tablerowheadings", alignment: "right" }
  ]);
  for (var i of item) {
    rows.push([
      { text: "" + i.no, style: "tablerowdatas", alignment: "left" },
      { text: "" + i.product, style: "tablerowdatas", alignment: "center" },
      { text: "" + i.hsn, style: "tablerowdatas", alignment: "center" },
      { text: "" + i.qty, style: "tablerowdatas", alignment: "center" },
      { text: "₹ " + i.unitprice, style: "tablerowdatas", alignment: "center" },
      [
        {
          text: "₹ " + i.cgstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.cgstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],

      [
        {
          text: "₹ " + i.sgstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.sgstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],

      [
        {
          text: "₹ " + i.igstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.igstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],
      { text: "₹ " + i.amount, style: "tablerowdatas", alignment: "right" }
    ]);
    total = total + +i.amount;    
    totalcgstvalue = totalcgstvalue +  +i.cgstvalue;
    totalsgstvalue = totalsgstvalue +  +i.sgstvalue;
    totaligstvalue = totaligstvalue +  +i.igstvalue;
  }
  rows2.push([
    { text: ``, style: "tablerowheadings", alignment: "center" },
    { text: `TOTAL: `, style: "tablerowheadings", alignment: "center" },
    { text: ``, style: "tablerowheadings", alignment: "center" },
    { text: ``, style: "tablerowheadings", alignment: "center" },
    { text: ``, style: "tablerowheadings", alignment: "center" },
    {
      text: `₹ ${totalcgstvalue}`,
      style: "tablerowheadings",
      alignment: "center"
      //margin: [8, 0, 0, 0]
    },
    {
      text: ` ₹ ${totalsgstvalue} `,
      style: "tablerowheadings",
      alignment: "right"
      //margin: [10, 0, 0, 0]
    },
    {
      text: ` ₹ ${totaligstvalue} `,
      style: "tablerowheadings",
      alignment: "right"
      //margin: [10, 0, 0, 0]
    },
    { text: `₹ ${total}`, style: "tablerowheadings", alignment: "right" }
  ]);

  function getWord(num) {
    let a = num.split(" ");
    let word = "";
    for (let i = 0; i < a.length; i++) {
      word += a[i][0].toUpperCase();
      word += a[i].slice(1) + " ";
    }
    return word;
  }
  let totalInWord = await getWord(req.body.totalInWord);

  var documentDefinition = {
    content: [
      {
        stack: [
          {
            //1st row
            text: "Sale Order Booking",
            style: "header",
            alignment: "center"
          },
          {
            //2nd row
            margin: [0, 4, 0, 0],
            alignment: "justify",
            columns: [
              {
                image: `data:image/png;base64,${dataurlLogo}`,
                width: 100,
                height: 60
              },
              {},
              {
                margin: [25, 0, 0, 0],
                alignment: "right",
                stack: [
                  {
                    text: "Original for Recipient",
                    fontSize: 13
                  },
                  {
                    text: [
                      { text: `Invoice Number: `, style: "upperright" },
                      { text: `${invoice}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `OrderNo & Date: `, style: "upperright" },
                      { text: `${orderNoAndDate}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `Invoice Date: `, style: "upperright" },
                      { text: `${invoiceDate}`, style: "upperright" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //3rd row
            columns: [
              {
                //1st column
                alignment: "left",
                stack: [
                  {
                    alignment: "center",
                    text: "Company Details: ",
                    bold: true
                  },
                  {
                    text: `${companyName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${companyDistrict} - ${companyState} ${companyStateCode}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${companyPinCode}, ${companyCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        columns: [
                          {
                            margin: [0, 4, 0, 0],
                            image: `data:image/png;base64,${dataurlGst}`,
                            width: 20,
                            height: 20
                          },
                          {
                            text: `${companyGstIn}`,
                            margin: [0, 4, 0, 0],
                            style: "companyandclient"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlMail}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyEmail}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  }
                ]
              },
              {
                //2nd column
                alignment: "left",
                margin: [20, 0, 0, 0],
                stack: [
                  {
                    text: "Offered To ",
                    bold: true,
                    alignment: "center"
                  },
                  {
                    text: `${customerName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${customerAddress}  ${customerStateCode} `,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${customerPinCode}  ${customerCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlGst}`,
                        width: 20,
                        height: 20
                      },
                      {
                        text: `${customerGstIn}`,
                        margin: [0, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `Place of supply: ${customerStateCode}`,
                    style: "companyandclient",
                    margin: [20, 4, 0, 0]
                  }
                ]
              },
              {
                //3rd column
                alignment: "left",
                stack: [
                  {
                    text: "Shipping Address ",
                    bold: true,
                    alignment: "center"
                  },
                  {
                    text: `${customerName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${customerAddress}  ${customerStateCode} `,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${customerPinCode}  ${customerCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlGst}`,
                        width: 20,
                        height: 20
                      },
                      {
                        text: `${customerGstIn}`,
                        margin: [0, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows3
            },
            layout: "headerLineOnly"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows
            },
            layout: "headerLineOnly"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows2
            },
            layout: "noBorders"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },

          {
            text: "\n\n"
          },
          {
            //5th row
            alignment: "justify",
            columns: [
              {
                //1 column
                alignment: "left",
                stack: [
                  {
                    text: `Total In Word: ₹ ${totalInWord}\n`,
                    fontSize: 10
                  },
                  {
                    text:
                      "\n\n\n\nAUTHORIZED SIGNATORY\n\n\n______________________________",
                    fontSize: 10,
                    bold: true,
                    color: "blue"
                  }
                ]
              },
              {
                //2 column
                alignment: "right",
                fontSize: 10,
                bold: true,
                margin: [8, 4, 0, 0],
                stack: [
                  {
                    text: `${"Item Cost:".toUpperCase()}`
                  },
                  {
                    text: `${"Total Gst:".toUpperCase()}`
                  },
                  {
                    text: `${"CGST:".toUpperCase()}`
                  },
                  {
                    text: `${"SGST:".toUpperCase()}`
                  },
                  {
                    text: `${"IGST:".toUpperCase()}`
                  },
                  {
                    text: `${"Transport Cost:".toUpperCase()}`
                  },
                  {
                    text: `${"Net Amount:".toUpperCase()}`
                  },
                  {
                    text: `${"Advanced:".toUpperCase()}`
                  },
                  {
                    text: `${"Dues:".toUpperCase()}`,
                    color: "red"
                  }
                ]
              },
              {
                //3 column
                alignment: "right",
                fontSize: 10,
                bold: true,
                stack: [
                  {
                    text: `₹ ${itemCost}`
                  },
                  {
                    text: ` ₹ ${totalGst}`
                  },
                  {
                    text: `₹ ${totalcgstvalue}`
                  },
                  {
                    text: `₹ ${totalsgstvalue}`
                  },
                  {
                    text: `₹ ${totaligstvalue}`
                  },
                  {
                    text: `₹ ${transportCost}`
                  },

                  {
                    text: `₹ ${netAmount}`
                  },
                  {
                    text: `₹ ${advance}`
                  },
                  {
                    text: `₹ ${dues}`,
                    color: "red"
                  }
                ]
              }
            ]
          },
          {
            text:
              "\n\n\n\n\n\nIssued using BRICK MASTER  from www.brickmaster.in",
            alignment: "center",
            fontSize: 7
          }
        ],
        alignment: "center",
        margin: [0, 0, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "justify"
      },
      font: {
        fontSize: 15
      },
      tablerowheadings: {
        fontSize: 10,
        bold: true,
        color: "blue"
      },
      tablerowdatas: {
        fontSize: 10,
        bold: true,
        color: "black"
      },
      companyandclient: {
        fontSize: 10,
        color: "black"
      },
      upperright: {
        fontSize: 10,
        bold: true,
        margin: [0, 4, 0, 0]
      }
    }
  };

  const pdfDoc = pdfMake.createPdf(documentDefinition);
  pdfDoc.getBase64(data => {
    res.end(data);
  });
});

// @type    POST
//@route    /api/print/pdfmake
// @desc    route for getting purchaseorder data as pdf file
// @access  PRIVATE But Route is public
router.post("/pdf/purchaseorder", async (req, res, next) => {

  let companyName = "";
  let companyAddress = "";
  let companyStateCode = "";
  let companyPinCode = "";
  let companyCountry = "";
  let companyMobile = "";
  let companyGstIn = "";
  let companyDistrict = "";
  let companyState = "";
  let companyEmail = "";
  //getting sold by company data from database

  const Person = require("../../../models/Person");
  

  const result = await Person.find({ companyId: req.body.companyId });
  if (result.length > 0) {
    companyName = result[0].companyName;
    companyAddress = result[0].address;
    companyGstIn = result[0].gstIn;
    companyCountry = result[0].country;
    companyEmail = result[0].email;
    companyMobile = result[0].mobile;
    companyPinCode = result[0].pinCode;
    companyStateCode = result[0].stateCode;
    companyDistrict = result[0].district;
    companyState = result[0].state;
  }
  

  let total = 0,
    totalcgstvalue = 0,
    totalsgstvalue = 0,
    totaligstvalue = 0;
  //getting data from frontend
  let customerName = "";
  if (req.body.ledgerName) customerName = req.body.ledgerName;

  //getting invoice date
  function invoiceDateGet(str) {
    if(str){
    let yr = str.slice(0, 4);
    let mm = str.slice(5, 7);
    let dd = str.slice(8, 10);
    return dd + "-" + mm + "-" + yr;
    }
    return str;
  }

  let invoice = req.body.invoiceNumber,
    invoiceDate = await invoiceDateGet(req.body.invoiceDate),
    orderNoAndDate = req.body.invoiceNumber +" / "+ invoiceDate,
    customerAddress = req.body.address,
    customerStateCode = req.body.state,
    customerMobile = req.body.mobileNo,
    customerGstIn = req.body.customerGST?req.body.customerGST:"NA",
    customerPinCode = req.body.customerPinCode ? req.body.customerPinCode : "",
    customerCountry = req.body.customerCountry ? req.body.customerCountry : "";


    //need to calculate
  let itemCost = req.body.itemCost,
    totalGst = req.body.gst,
    transportCost = req.body.freight,
    advance = req.body.advance,
    netAmount = req.body.totalAmount;
    dues = req.body.dues;

  let item = [];
  var rows = [];
  var rows2 = [];
  var rows3 = [];
  //req.body.products
  req.body.products.forEach((element, index) => {
    const dataObj = {};
    dataObj.no = index + 1;
    dataObj.product = element.product.value;
    dataObj.hsn = element.product.hsn;
    dataObj.qty = element.quantity;
    dataObj.unitprice = element.rate;
    dataObj.cgstpercentage = element.tax.cGst;
    dataObj.cgstvalue = (element.tax.cGst * element.product.sellingPrice) / 100;
    dataObj.sgstpercentage = element.tax.sGst;
    dataObj.sgstvalue = (element.tax.sGst * element.product.sellingPrice) / 100;
    dataObj.igstpercentage = element.tax.iGst;
    dataObj.igstvalue = (element.tax.cGst * element.product.sellingPrice) / 100;
    dataObj.amount = element.amount;
    item.push(dataObj);
  });

  rows3.push([
    { text: "NO", style: "tablerowheadings", alignment: "left" },
    { text: "PRODUCT", style: "tablerowheadings", alignment: "left" },
    { text: "HSN/SAC", style: "tablerowheadings", alignment: "center" },
    { text: "QTY", style: "tablerowheadings", alignment: "center" },
    { text: "UNIT PRICE", style: "tablerowheadings", alignment: "center" },
    { text: "CGST", style: "tablerowheadings", alignment: "center" },
    { text: "SGST", style: "tablerowheadings", alignment: "center" },
    { text: "IGST", style: "tablerowheadings", alignment: "center" },
    { text: "TOTAL", style: "tablerowheadings", alignment: "right" }
  ]);
  for (var i of item) {
    rows.push([
      { text: "" + i.no, style: "tablerowdatas", alignment: "left" },
      { text: "" + i.product, style: "tablerowdatas", alignment: "center" },
      { text: "" + i.hsn, style: "tablerowdatas", alignment: "center" },
      { text: "" + i.qty, style: "tablerowdatas", alignment: "center" },
      { text: "₹ " + i.unitprice, style: "tablerowdatas", alignment: "center" },
      [
        {
          text: "₹ " + i.cgstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.cgstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],

      [
        {
          text: "₹ " + i.sgstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.sgstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],

      [
        {
          text: "₹ " + i.igstvalue,
          style: "tablerowdatas",
          alignment: "center"
        },
        {
          text: "(" + i.igstpercentage + "%)",
          fontSize: 10,
          alignment: "center"
        }
      ],
      { text: "₹ " + i.amount, style: "tablerowdatas", alignment: "right" }
    ]);
    total = total + +i.amount;    
    totalcgstvalue = totalcgstvalue +  +i.cgstvalue;
    totalsgstvalue = totalsgstvalue +  +i.sgstvalue;
    totaligstvalue = totaligstvalue +  +i.igstvalue;
  }
  rows2.push([
    { text: ``, style: "tablerowheadings", alignment: "center" },
    { text: `TOTAL: `, style: "tablerowheadings", alignment: "center" },
    { text: ``, style: "tablerowheadings", alignment: "center" },
    { text: ``, style: "tablerowheadings", alignment: "center" },
    { text: ``, style: "tablerowheadings", alignment: "center" },
    {
      text: `₹ ${totalcgstvalue}`,
      style: "tablerowheadings",
      alignment: "center"
      //margin: [8, 0, 0, 0]
    },
    {
      text: ` ₹ ${totalsgstvalue} `,
      style: "tablerowheadings",
      alignment: "right"
      //margin: [10, 0, 0, 0]
    },
    {
      text: ` ₹ ${totaligstvalue} `,
      style: "tablerowheadings",
      alignment: "right"
      //margin: [10, 0, 0, 0]
    },
    { text: `₹ ${total}`, style: "tablerowheadings", alignment: "right" }
  ]);

  function getWord(num) {
    let a = num.split(" ");
    let word = "";
    for (let i = 0; i < a.length; i++) {
      word += a[i][0].toUpperCase();
      word += a[i].slice(1) + " ";
    }
    return word;
  }
  let totalInWord = await getWord(req.body.totalInWord);

  var documentDefinition = {
    content: [
      {
        stack: [
          {
            //1st row
            text: "Purchase Order Booking",
            style: "header",
            alignment: "center"
          },
          {
            //2nd row
            margin: [0, 4, 0, 0],
            alignment: "justify",
            columns: [
              {
                image: `data:image/png;base64,${dataurlLogo}`,
                width: 100,
                height: 60
              },
              {},
              {
                margin: [25, 0, 0, 0],
                alignment: "right",
                stack: [
                  {
                    text: "Original for Recipient",
                    fontSize: 13
                  },
                  {
                    text: [
                      { text: `Invoice Number: `, style: "upperright" },
                      { text: `${invoice}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `OrderNo & Date: `, style: "upperright" },
                      { text: `${orderNoAndDate}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `Invoice Date: `, style: "upperright" },
                      { text: `${invoiceDate}`, style: "upperright" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //3rd row
            columns: [
              {
                //1st column
                alignment: "left",
                stack: [
                  {
                    alignment: "center",
                    text: "Purchase From: ",
                    bold: true
                  },
                  {
                    text: `${customerName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${customerAddress} ${customerStateCode}`,
                    margin: [20, 4, 0, 0],
                    style: "customerandclient"
                  },
                  {
                    text: `${customerPinCode}, ${customerCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${customerMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        columns: [
                          {
                            margin: [0, 4, 0, 0],
                            image: `data:image/png;base64,${dataurlGst}`,
                            width: 20,
                            height: 20
                          },
                          {
                            text: `${customerGstIn}`,
                            margin: [0, 4, 0, 0],
                            style: "companyandclient"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                //2nd column
                alignment: "left",
                margin: [20, 0, 0, 0],
                stack: [
                  {
                    text: "Billing To ",
                    bold: true,
                    alignment: "center"
                  },
                  {
                    text: `${companyName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${companyState}  ${companyDistrict}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${companyPinCode}  ${companyCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlMail}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyEmail}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlGst}`,
                        width: 20,
                        height: 20
                      },
                      {
                        text: `${companyGstIn}`,
                        margin: [0, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `Place of supply: ${companyStateCode}`,
                    style: "companyandclient",
                    margin: [20, 4, 0, 0]
                  }
                ]
              },
              {
                //3rd column
                alignment: "left",
                stack: [
                  {
                    text: "Shipping Address ",
                    bold: true,
                    alignment: "center"
                  },
                  {
                    text: `${companyName}`,
                    margin: [20, 4, 0, 0],

                    fontSize: 14
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlHome}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyAddress}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    text: `${companyState}  ${companyDistrict} `,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    text: `${companyPinCode}  ${companyCountry}`,
                    margin: [20, 4, 0, 0],
                    style: "companyandclient"
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlPhone}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyMobile}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlMail}`,
                        width: 14,
                        height: 14
                      },
                      {
                        text: `${companyEmail}`,
                        margin: [6, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        margin: [0, 4, 0, 0],
                        image: `data:image/png;base64,${dataurlGst}`,
                        width: 20,
                        height: 20
                      },
                      {
                        text: `${companyGstIn}`,
                        margin: [0, 4, 0, 0],
                        style: "companyandclient"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows3
            },
            layout: "headerLineOnly"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows
            },
            layout: "headerLineOnly"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },
          {
            //4th row
            style: "tableExample",
            alignment: "justify",
            margin: [0, 0, 0, 0],
            table: {
              widths: [
                "auto",
                "*",
                "*",
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "*"
              ],
              body: rows2
            },
            layout: "noBorders"
          },
          {
            alignment: "justify",
            text:
              "_______________________________________________________________________________________________",
            width: "*"
          },

          {
            text: "\n\n"
          },
          {
            //5th row
            alignment: "justify",
            columns: [
              {
                //1 column
                alignment: "left",
                stack: [
                  {
                    text: `Total In Word: ₹ ${totalInWord}\n`,
                    fontSize: 10
                  },
                  {
                    text:
                      "\n\n\n\nAUTHORIZED SIGNATORY\n\n\n______________________________",
                    fontSize: 10,
                    bold: true,
                    color: "blue"
                  }
                ]
              },
              {
                //2 column
                alignment: "right",
                fontSize: 10,
                bold: true,
                margin: [8, 4, 0, 0],
                stack: [
                  {
                    text: `${"Item Cost:".toUpperCase()}`
                  },
                  {
                    text: `${"Total Gst:".toUpperCase()}`
                  },
                  {
                    text: `${"CGST:".toUpperCase()}`
                  },
                  {
                    text: `${"SGST:".toUpperCase()}`
                  },
                  {
                    text: `${"IGST:".toUpperCase()}`
                  },
                  {
                    text: `${"Transport Cost:".toUpperCase()}`
                  },
                  {
                    text: `${"Net Amount:".toUpperCase()}`
                  },
                  {
                    text: `${"Advanced:".toUpperCase()}`
                  },
                  {
                    text: `${"Dues:".toUpperCase()}`,
                    color: "red"
                  }
                ]
              },
              {
                //3 column
                alignment: "right",
                fontSize: 10,
                bold: true,
                stack: [
                  {
                    text: `₹ ${itemCost}`
                  },
                  {
                    text: ` ₹ ${totalGst}`
                  },
                  {
                    text: `₹ ${totalcgstvalue}`
                  },
                  {
                    text: `₹ ${totalsgstvalue}`
                  },
                  {
                    text: `₹ ${totaligstvalue}`
                  },
                  {
                    text: `₹ ${transportCost}`
                  },

                  {
                    text: `₹ ${netAmount}`
                  },
                  {
                    text: `₹ ${advance}`
                  },
                  {
                    text: `₹ ${dues}`,
                    color: "red"
                  }
                ]
              }
            ]
          },
          {
            text:
              "\n\n\n\n\n\nIssued using BRICK MASTER  from www.brickmaster.in",
            alignment: "center",
            fontSize: 7
          }
        ],
        alignment: "center",
        margin: [0, 0, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "justify"
      },
      font: {
        fontSize: 15
      },
      tablerowheadings: {
        fontSize: 10,
        bold: true,
        color: "blue"
      },
      tablerowdatas: {
        fontSize: 10,
        bold: true,
        color: "black"
      },
      companyandclient: {
        fontSize: 10,
        color: "black"
      },
      upperright: {
        fontSize: 10,
        bold: true,
        margin: [0, 4, 0, 0]
      }
    }
  };

  const pdfDoc = pdfMake.createPdf(documentDefinition);
  pdfDoc.getBase64(data => {
    res.end(data);
  });
});


// @type    POST
//@route    /api/print/pdfmake
// @desc    route for getting receipt data as pdf file
// @access  PRIVATE But Route is public
router.post("/pdf/receipt", async (req, res, next) => {
  
    //getting receipt date
  function receiptDateGet(str) {
    let yr = str.slice(0, 4);
    let mm = str.slice(5, 7);
    let dd = str.slice(8, 10);
    return dd + "-" + mm + "-" + yr;
  }

    let invoice = req.body.invoiceNumber,
    receiptDate = await receiptDateGet(req.body.invoiceDate),
    customerName = req.body.ledgerName,
    amount = req.body.amount,
    amountInWord = req.body.totalInWord,
    discount = req.body.discount? req.body.discount:"NA",
    currentBalance = req.body.currentBalance? req.body.currentBalance:"NA",
    modeOfReceipt = req.body.mode? req.body.mode:"NA",
    linkToVehicle = req.body.vehicle? req.body.vehicle:"NA",
    reminderDate = req.body.reminderDate ? await receiptDateGet(req.body.reminderDate):"NA",
    remarks = req.body.remarks? req.body.remarks:"NA";


  var documentDefinition = {
    content: [
      {
        margin: [0, 0, 0, 15],
        stack: [
          {
            //1st row
            text: "Receipt",
            style: "header",
            alignment: "center"
          },
          {
            //2nd row
            margin: [0, 4, 0, 0],
            alignment: "justify",
            columns: [
              {
                image: `data:image/png;base64,${dataurlLogo}`,
                width: 100,
                height: 60
              },
              {},
              {
                margin: [25, 0, 0, 0],
                alignment: "right",
                stack: [
                  {
                    text: "Original for Recipient",
                    fontSize: 13
                  },
                  {
                    text: [
                      { text: `Invoice Number: `, style: "upperright" },
                      { text: `${invoice}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `Receipt Date: `, style: "upperright" },
                      { text: `${receiptDate}`, style: "upperright" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 1.5
              }
            ]
          },
          {
            alignment: "justify",
            margin: [0, 3, 0, 0],
            columns: [
              {
                style: "tablerowheadings",
                alignment: "center",

                text: "Receipt From"
              },
              {
                style: "tablerowdatas",
                alignment: "center",

                text: `${customerName}`
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 2
              }
            ]
          },
          {
            alignment: "justify",
            margin: [0, 3, 0, 0],
            columns: [
              {
                style: "tablerowheadings",
                alignment: "center",
                stack: [
                  {
                    text: "Amount"
                  },
                  {
                    text: "            "
                  },
                  {
                    text: "Discount"
                  },
                  {
                    text: "Current balance"
                  },
                  {
                    text: "Mode of Receipt"
                  },
                  {
                    text: "Link to Vehicle"
                  },
                  {
                    text: "Reminder Date"
                  },
                  {
                    text: "Remarks"
                  }
                ]
              },
              {
                style: "tablerowdatas",
                alignment: "center",
                stack: [
                  {
                    text: `${amount}`
                  },
                  {
                    text: `In Word: ${amountInWord}`
                  },
                  {
                    text: `${discount}`
                  },
                  {
                    text: `${currentBalance}`
                  },
                  {
                    text:`${modeOfReceipt}`
                  },
                  {
                    text:`${linkToVehicle}`
                  },
                  {
                    text:`${reminderDate}`
                  },
                  {
                    text:`${remarks}`
                  }
                ]
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 2
              }
            ]
          },
          {
            //5th row
            alignment: "justify",
            columns: [
              {
                //1 column
                alignment: "left",
                stack: [
                  {
                    text:
                      "\n\n\nAUTHORIZED SIGNATORY\n\n\n______________________________",
                    fontSize: 10,
                    bold: true,
                    color: "blue"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        text:"\n\n\n\n\n"
      },
      {
        
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 5,
            x2: 515,
            y2: 5,
            lineWidth: 0.6
          }
        ]
      },
      {
        text:"\n\n\n\n\n"
      },
      {
        margin: [0, 0, 0, 15],
        stack: [
          {
            //1st row
            text: "Receipt",
            style: "header",
            alignment: "center"
          },
          {
            //2nd row
            margin: [0, 4, 0, 0],
            alignment: "justify",
            columns: [
              {
                image: `data:image/png;base64,${dataurlLogo}`,
                width: 100,
                height: 60
              },
              {},
              {
                margin: [25, 0, 0, 0],
                alignment: "right",
                stack: [
                  {
                    text: "Office Copy",
                    fontSize: 13
                  },
                  {
                    text: [
                      { text: `Invoice Number: `, style: "upperright" },
                      { text: `${invoice}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `Receipt Date: `, style: "upperright" },
                      { text: `${receiptDate}`, style: "upperright" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 1.5
              }
            ]
          },
          {
            alignment: "justify",
            margin: [0, 3, 0, 0],
            columns: [
              {
                style: "tablerowheadings",
                alignment: "center",

                text: "Receipt From"
              },
              {
                style: "tablerowdatas",
                alignment: "center",

                text: `${customerName}`
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 2
              }
            ]
          },
          {
            alignment: "justify",
            margin: [0, 3, 0, 0],
            columns: [
              {
                style: "tablerowheadings",
                alignment: "center",
                stack: [
                  {
                    text: "Amount"
                  },
                  {
                    text: "            "
                  },
                  {
                    text: "Discount"
                  },
                  {
                    text: "Current balance"
                  },
                  {
                    text: "Mode of Receipt"
                  },
                  {
                    text: "Link to Vehicle"
                  },
                  {
                    text: "Reminder Date"
                  },
                  {
                    text: "Remarks"
                  }
                ]
              },
              {
                style: "tablerowdatas",
                alignment: "center",
                stack: [
                  {
                    text: `${amount}`
                  },
                  {
                    text: `In Word: ${amountInWord}`
                  },
                  {
                    text: `${discount}`
                  },
                  {
                    text: `${currentBalance}`
                  },
                  {
                    text:`${modeOfReceipt}`
                  },
                  {
                    text:`${linkToVehicle}`
                  },
                  {
                    text:`${reminderDate}`
                  },
                  {
                    text:`${remarks}`
                  }
                ]
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 2
              }
            ]
          },
          {
            //5th row
            alignment: "justify",
            columns: [
              {
                //1 column
                alignment: "left",
                stack: [
                  {
                    text:
                      "\n\n\nAUTHORIZED SIGNATORY\n\n\n______________________________",
                    fontSize: 10,
                    bold: true,
                    color: "blue"
                  }
                ]
              }
            ]
          }
        ]
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "justify"
      },
      font: {
        fontSize: 15
      },
      tablerowheadings: {
        fontSize: 10,
        bold: true,
        color: "blue"
      },
      tablerowdatas: {
        fontSize: 10,
        color: "black"
      },
      companyandclient: {
        fontSize: 10,
        color: "black"
      },
      upperright: {
        fontSize: 10,
        bold: true,
        margin: [0, 4, 0, 0]
      }
    }
  };

  const pdfDoc = pdfMake.createPdf(documentDefinition);
  pdfDoc.getBase64(data => {
    res.end(data);
  });
});

// @type    POST
//@route    /api/print/pdfmake
// @desc    route for getting payment data as pdf file
// @access  PRIVATE But Route is public
router.post("/pdf/payment", async (req, res, next) => {

    //getting receipt date
  function paymentDateGet(str) {
    let yr = str.slice(0, 4);
    let mm = str.slice(5, 7);
    let dd = str.slice(8, 10);
    return dd + "-" + mm + "-" + yr;
  }
    let invoice = req.body.invoiceNumber,
    paymentDate = await paymentDateGet(req.body.invoiceDate),
    customerName = req.body.ledgerName,
    amount = req.body.amount,
    amountInWord = req.body.amountInWord,
    discount = req.body.discount? req.body.discount: "NA",
    currentBalance = req.body.currentBalance? req.body.currentBalance: "NA",
    modeOfPayment = req.body.mode? req.body.mode: "NA",
    linkToVehicle = req.body.vehicle? req.body.vehicle: "NA",
    reminderDate = req.body.reminderDate? await paymentDateGet(req.body.reminderDate): "NA",
    remarks = req.body.remarks? req.body.remarks: "NA";


  var documentDefinition = {
    content: [
      {
        margin: [0, 0, 0, 15],
        stack: [
          {
            //1st row
            text: "Payment",
            style: "header",
            alignment: "center"
          },
          {
            //2nd row
            margin: [0, 4, 0, 0],
            alignment: "justify",
            columns: [
              {
                image: `data:image/png;base64,${dataurlLogo}`,
                width: 100,
                height: 60
              },
              {},
              {
                margin: [25, 0, 0, 0],
                alignment: "right",
                stack: [
                  {
                    text: "Original for Recipient",
                    fontSize: 13
                  },
                  {
                    text: [
                      { text: `Invoice Number: `, style: "upperright" },
                      { text: `${invoice}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `payment Date: `, style: "upperright" },
                      { text: `${paymentDate}`, style: "upperright" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 1.5
              }
            ]
          },

          {
            alignment: "justify",
            margin: [0, 3, 0, 0],
            columns: [
              {
                style: "tablerowheadings",
                alignment: "center",

                text: "payment To"
              },
              {
                style: "tablerowdatas",
                alignment: "center",

                text: `${customerName}`
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 2
              }
            ]
          },
          {
            alignment: "justify",
            margin: [0, 3, 0, 0],
            columns: [
              {
                style: "tablerowheadings",
                alignment: "center",
                stack: [
                  {
                    text: "Amount"
                  },
                  {
                    text: "            "
                  },
                  {
                    text: "Discount"
                  },
                  {
                    text: "Current balance"
                  },
                  {
                    text: "Mode of Payment"
                  },
                  {
                    text: "Link to Vehicle"
                  },
                  {
                    text: "Reminder Date"
                  },
                  {
                    text: "Remarks"
                  }
                ]
              },
              {
                style: "tablerowdatas",
                alignment: "center",
                stack: [
                  {
                    text: `${amount}`
                  },
                  {
                    text: `In Word: ${amountInWord}`
                  },
                  {
                    text: `${discount}`
                  },
                  {
                    text: `${currentBalance}`
                  },
                  {
                    text:`${modeOfPayment}`
                  },
                  {
                    text:`${linkToVehicle}`
                  },
                  {
                    text:`${reminderDate}`
                  },
                  {
                    text:`${remarks}`
                  }
                ]
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 2
              }
            ]
          },
          {
            //5th row
            alignment: "justify",
            columns: [
              {
                //1 column
                alignment: "left",
                stack: [
                  {
                    text:
                      "\n\n\nAUTHORIZED SIGNATORY\n\n\n______________________________",
                    fontSize: 10,
                    bold: true,
                    color: "blue"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        text:"\n\n\n\n\n"
      },
      {
        
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 5,
            x2: 515,
            y2: 5,
            lineWidth: 0.6
          }
        ]
      },

      {
        text:"\n\n\n\n\n"
      },
       {
        margin: [0, 0, 0, 15],
        stack: [
          {
            //1st row
            text: "Payment",
            style: "header",
            alignment: "center"
          },
          {
            //2nd row
            margin: [0, 4, 0, 0],
            alignment: "justify",
            columns: [
              {
                image: `data:image/png;base64,${dataurlLogo}`,
                width: 100,
                height: 60
              },
              {},
              {
                margin: [25, 0, 0, 0],
                alignment: "right",
                stack: [
                  {
                    text: "Office Copy",
                    fontSize: 13
                  },
                  {
                    text: [
                      { text: `Invoice Number: `, style: "upperright" },
                      { text: `${invoice}`, style: "upperright" }
                    ]
                  },
                  {
                    text: [
                      { text: `payment Date: `, style: "upperright" },
                      { text: `${paymentDate}`, style: "upperright" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 1.5
              }
            ]
          },
          
          {
            alignment: "justify",
            margin: [0, 3, 0, 0],
            columns: [
              {
                style: "tablerowheadings",
                alignment: "center",

                text: "payment To"
              },
              {
                style: "tablerowdatas",
                alignment: "center",

                text: `${customerName}`
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 2
              }
            ]
          },
          {
            alignment: "justify",
            margin: [0, 3, 0, 0],
            columns: [
              {
                style: "tablerowheadings",
                alignment: "center",
                stack: [
                  {
                    text: "Amount"
                  },
                  {
                    text: "            "
                  },
                  {
                    text: "Discount"
                  },
                  {
                    text: "Current balance"
                  },
                  {
                    text: "Mode of Payment"
                  },
                  {
                    text: "Link to Vehicle"
                  },
                  {
                    text: "Reminder Date"
                  },
                  {
                    text: "Remarks"
                  }
                ]
              },
              {
                style: "tablerowdatas",
                alignment: "center",
                stack: [
                  {
                    text: `${amount}`
                  },
                  {
                    text: `In Word: ${amountInWord}`
                  },
                  {
                    text: `${discount}`
                  },
                  {
                    text: `${currentBalance}`
                  },
                  {
                    text:`${modeOfPayment}`
                  },
                  {
                    text:`${linkToVehicle}`
                  },
                  {
                    text:`${reminderDate}`
                  },
                  {
                    text:`${remarks}`
                  }
                ]
              }
            ]
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 2
              }
            ]
          },
          {
            //5th row
            alignment: "justify",
            columns: [
              {
                //1 column
                alignment: "left",
                stack: [
                  {
                    text:
                      "\n\n\nAUTHORIZED SIGNATORY\n\n\n______________________________",
                    fontSize: 10,
                    bold: true,
                    color: "blue"
                  }
                ]
              }
            ]
          }
        ]
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "justify"
      },
      font: {
        fontSize: 15
      },
      tablerowheadings: {
        fontSize: 10,
        bold: true,
        color: "blue"
      },
      tablerowdatas: {
        fontSize: 10,
        color: "black"
      },
      companyandclient: {
        fontSize: 10,
        color: "black"
      },
      upperright: {
        fontSize: 10,
        bold: true,
        margin: [0, 4, 0, 0]
      }
    }
  };

  const pdfDoc = pdfMake.createPdf(documentDefinition);
  pdfDoc.getBase64(data => {
    res.end(data);
  });
});


module.exports = router;
