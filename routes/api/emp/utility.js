const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");

//Load Person Model
const Person = require("../../../models/Person");

//Load Utility.js Model
const Utility = require("../../../models/Emp/Utility");

// @type    POST
//@route    /api/emp/utility/
// @desc    route for SAVING data for utility
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const utilityValues = {
      
    };
    utilityValues.user = req.user.id;

    

    utilityValues.utility = req.body.utility;

    utilityValues.remarks = req.body.remarks;
    


    //getting last voucher number and making new one
 

    //Do database stuff
    Utility.findOne({ user: req.user.id })
      .then(utility => {
        if (utility) {
          Utility.findOne({
            utility: utilityValues.utility
          })
            .then(utility => {
              //Username already exists
              if (utility) {
                res.json({
                  message: "Utility Already exist "
                });
              } else {
                //save user
                new Utility(utilityValues)
                  .save()
                  .then(
                    res.json({
                      message: "Successfully saved"
                    })
                  )
                  .catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
        } else {
          new Utility(utilityValues)
            .save()
            .then(
              res.json({
                message: "First Utility is saved"
              })
            )
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching utility" + err));
  }
);

// @type    GET
//@route    /api/emp/utility/allutility
// @desc    route for getting all data from  utility
// @access  PRIVATE
router.get(
  "/allutility",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Utility.find({})
      .sort({ date: -1 })
      .then(Utility => res.json(Utility))
      .catch(err =>
        res
          .status(404)
          .json({ message: "No Utility Found" })
      );
  }
);

// @type    get
//@route    /api/emp/utility/get/:id
// @desc    route to get single utility by id
// @access  PRIVATE
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Utility.find({
      _id: req.params.id
    }).then(Utility => res.json(Utility));
  }
);

// @type    POST
//@route    /api/emp/utility/:id
// @desc    route to update/edit utility
// @access  PRIVATE

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const utilityValues = {
      
    };
    utilityValues.user = req.user.id;

    

    utilityValues.utility = req.body.utility;

    utilityValues.remarks = req.body.remarks;


    Utility.findOneAndUpdate(
      { _id: req.params.id },
      { $set: utilityValues },
      { new: true }
    )

      .then(() =>
        res.json({ message: "Updated successfully!!" })
      )

      .catch(err =>
        console.log("Problem in updating utility value" + err)
      );
  }
);


// @type    GET
//@route    /api/emp/utility/allutility/:searchutility
// @desc    route for searching of utility from searchbox using any text
// @access  PRIVATE
router.get(
  "/allutility/:searchutility",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const search = req.params.searchutility;
    if (isNaN(search)) {
      Utility.find({
        utility: new RegExp(search, "i")
      }).then(Utility => res.json(Utility));
    } else {
      Utility.find({
        utilityNumber: search
      }).then(Utility => res.json(Utility));
    }
  }
);

// @type    POST
//@route    /api/emp/utility/deleteutility/:id
// @desc    route for personnal user utility
// @access  PRIVATE

router.delete(
  "/deleteutility/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.params.id;
    Utility.findOne({ _id: id }).then(UtilityResult => {
      if (UtilityResult) {
        Utility.findOneAndDelete({ _id: id })
          .then(() =>
            res.json({ message: "Deleted successfully" })
          )
          .catch(err =>
            res.json("Failed to delete due to this error - " + err)
          );
      } else {
        res
          .status(400)
          .json({ message: "utility Voucher Not Found"});
      }
    });
  }
);

module.exports = router;
