const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");

//Load Person Model
const Person = require("../../../models/Person");

//Load Facility.js Model
const Facility = require("../../../models/Emp/Facility");

// @type    POST
//@route    /api/emp/facility/
// @desc    route for SAVING data for facility
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2) {

    
    const facilityValues = {
      
    };
    facilityValues.user = req.user.id;

    

    facilityValues.facility = req.body.facility;

    facilityValues.remarks = req.body.remarks;
    facilityValues.price = req.body.price;
    


    //getting last voucher number and making new one
 

    //Do database stuff
    Facility.findOne({ user: req.user.id })
      .then(facility => {
        if (facility) {
          Facility.findOne({
            facility: facilityValues.facility
          })
            .then(facility => {
              //Username already exists
              if (facility) {
                res.json({
                  message: "Facility Already exist ",
                  variant: "error"
                });
              } else {
                //save user
                new Facility(facilityValues)
                  .save()
                  .then(
                    res.json({
                      message: "Successfully saved",
                      variant: "success"
                    })
                  )
                  .catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
        } else {
          new Facility(facilityValues)
            .save()
            .then(
              res.json({
                message: "First Facility is saved",
                variant: "success"
              })
            )
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching facility" + err));
    } else {
      res.json({
        message: "you are not authorised",
        variant: "success"
      })
    }
    }
);

// @type    GET
//@route    /api/emp/facility/allfacility
// @desc    route for getting all data from  facility
// @access  PRIVATE
router.get(
  "/allfacility",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Facility.find({})
      .sort({ date: -1 })
      .then(Facility => res.json(Facility))
      .catch(err =>
        res
          .status(404)
          .json({ message: "No Facility Found", variant: "error" })
      );
  }
);

// @type    get
//@route    /api/emp/facility/get/:id
// @desc    route to get single facility by id
// @access  PRIVATE
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Facility.find({
      _id: req.params.id
    }).then(Facility => res.json(Facility));
  }
);

// @type    POST
//@route    /api/emp/facility/:id
// @desc    route to update/edit facility
// @access  PRIVATE

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2) {
    const facilityValues = {
      
    };
    facilityValues.user = req.user.id;

    

    facilityValues.facility = req.body.facility;
    facilityValues.price = req.body.price;

    facilityValues.remarks = req.body.remarks;


    Facility.findOneAndUpdate(
      { _id: req.params.id },
      { $set: facilityValues },
      { new: true }
    )

      .then(() =>
        res.json({ message: "Updated successfully!!", variant: "success" })
      )

      .catch(err =>
        console.log("Problem in updating facility value" + err)
      );
    } else {
      res.json({ message: "You are not Authorised", variant: "success" })
    }
  }
);


// @type    GET
//@route    /api/emp/facility/allfacility/:searchfacility
// @desc    route for searching of facility from searchbox using any text
// @access  PRIVATE
router.get(
  "/allfacility/:searchfacility",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const search = req.params.searchfacility;
    if (isNaN(search)) {
      Facility.find({
        facility: new RegExp(search, "i")
      }).then(Facility => res.json(Facility));
    } else {
      Facility.find({
        facilityNumber: search
      }).then(Facility => res.json(Facility));
    }
  }
);

// @type    POST
//@route    /api/emp/facility/deletefacility/:id
// @desc    route for personnal user facility
// @access  PRIVATE

router.delete(
  "/deletefacility/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2) {
    const id = req.params.id;
    Facility.findOne({ _id: id }).then(FacilityResult => {
      if (FacilityResult) {
        Facility.findOneAndDelete({ _id: id })
          .then(() =>
            res.json({ message: "Deleted successfully", variant: "success" })
          )
          .catch(err =>
            res.json("Failed to delete due to this error - " + err)
          );
      } else {
        res
          .status(400)
          .json({ message: "facility Voucher Not Found", variant: "error" });
      }
    });
  } else {
    res.json({ message: "you are not Authorised", variant: "error" })
  }
  }
);

module.exports = router;
