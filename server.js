const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");
const upload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const path = require("path");

cloudinary.config({
  cloud_name: "oasismanor",
  api_key: "827139429878544",
  api_secret: "Evt06edyTsAuOmwMWHE8CVWwJAc"
});

//bring all routes
const auth = require("./routes/api/auth");
//transactions
const paymentvoucher = require("./routes/api/transaction/paymentvoucher");
const receiptvoucher = require("./routes/api/transaction/receiptvoucher");
const mopvoucher = require("./routes/api/transaction/mopvoucher");
//emp
const utility = require("./routes/api/emp/utility");
const facility = require("./routes/api/emp/facility");
const uploadutility = require("./routes/api/emp/uploadutility");
const requestfacilities = require("./routes/api/emp/requestfacilities");

// report
const cb = require("./routes/api/report/transactionreport/cb");
const alltransaction = require("./routes/api/report/transactionreport/alltransaction");
const userchart = require("./routes/api/report/chart/userchart");
const enquiryList = require("./routes/api/report/chart/enquiryList");
const enqgraph = require("./routes/api/report/chart/enqgraph");

// other
const room = require("./routes/api/other/room");
const fileupload = require("./routes/api/other/fileupload");

const app = express();
 
app.use(upload({ useTempFiles: true }));
app.use(cors());

//Middleware for bodyparser
app.use(bodyparser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "client/build")))


//mongoDB configuration
const db = require("./setup/myurl").mongoURL;

//Attempt to connect to database
mongoose
  .connect(db , { useNewUrlParser: true })
  .then(() => console.log(" MongoDB connected successfully"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Config for JWT strategy
require("./strategies/jsonwtStrategy")(passport);

//actual routes
app.use("/api/auth", auth);

//transaction
app.use("/api/transaction/paymentvoucher", paymentvoucher);
app.use("/api/transaction/receiptvoucher", receiptvoucher);
app.use("/api/transaction/mopvoucher", mopvoucher);
app.use("/api/emp/utility", utility);
app.use("/api/emp/facility", facility);

app.use("/api/emp/uploadutility", uploadutility);
app.use("/api/emp/requestfacilities", requestfacilities);

//report
app.use("/api/report/transactionreport/cb", cb);
app.use("/api/report/transactionreport/alltransaction", alltransaction);
app.use("/api/report/chart/userchart", userchart);
app.use("/api/report/chart/enquiryList", enquiryList);
app.use("/api/report/chart/enqgraph", enqgraph);
//other
app.use("/api/other/room", room);
app.use("/api/other/fileupload", fileupload);

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), function(
    err
  ) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.PORT || 2030;

app.listen(port, () => console.log(` App is running at ${port}`));

