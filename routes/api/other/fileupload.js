var express = require("express");
const app = express();
// var fileupload = require("express-fileupload");
// app.use(
//   fileupload({
//     useTempFiles: true
//   })
// );
var cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: "oasismanor",
//   api_key: "827139429878544",
//   api_secret: "Evt06edyTsAuOmwMWHE8CVWwJAc"
// });
app.post("/upload", function(req, res, next) {
  // console.log(req.files.photo);
  const file = req.files.photo;
  // console.log(file);
  cloudinary.uploader.upload(file.tempFilePath,  function(err, result) {
    // console.log("Error: ", err);
    res.json({ result });
  });
});

app.post("/delete", function(req, res, next) {
  // console.log(req.files.photo);
  const pId = req.body.public_id;
  // console.log(file);
  cloudinary.uploader.destroy(pId,  function(err, result) {
    // console.log("Error: ", err);
    t = result.result;
    res.json({ message: "Deleted Succesfully ",
    variant: "success" });
  });
});




module.exports = app;
