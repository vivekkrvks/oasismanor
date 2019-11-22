const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

// @type    GET
//@route    /api/profile/
// @desc    route for personnal user profile
// @access  PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profilenotfound: "No profile Found" });
        }
        res.json(profile);
      })
      .catch(err => console.log("got some error in profile " + err));
  }
);

// @type    POST
//@route    /api/profile/
// @desc    route for UPDATING/SAVING personnal user profile
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.ownerName) profileValues.ownerName = req.body.ownerName;
    if (req.body.address) profileValues.address = req.body.address;
    if (req.body.secondryMobileNumber)
      profileValues.secondryMobileNumber = req.body.secondryMobileNumber;
    if (req.body.email) profileValues.email = req.body.email;
    if (req.body.districtName)
      profileValues.districtName = req.body.districtName;
    if (req.body.pin) profileValues.pin = req.body.pin;
    if (req.body.state) profileValues.state = req.body.state;
    if (req.body.country) profileValues.country = req.body.country;
    //second stage
    if (req.body.varient) profileValues.varient = req.body.varient;
    if (req.body.periodOfLicense)
      profileValues.periodOfLicense = req.body.periodOfLicense;
    if (req.body.promocode) profileValues.promocode = req.body.promocode;
    if (req.body.referenceCode)
      profileValues.referenceCode = req.body.referenceCode;

    //Do database stuff
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => res.json(profile))
            .catch(err => console.log("problem in update" + err));
        } else {
          new Profile(profileValues)
            .save()
            .then(profile => res.json(profile))
            .catch(err => console.log(err));
        }
        {
          Person.findOne({ username: PersonValues.username })
            .then(Person => {
              //Username already exists
              if (Person) {
                res.status(400).json({ username: "Username already exists" });
              }
              //save user
              new Person(PersonValues)
                .save()
                .then(Person => res.json(Person))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching profile" + err));
  }
);

// @type    DELETE
//@route    /api/profile/
// @desc    route for deleting user based on ID
// @access  PRIVATE

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id });
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        Person.findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ success: "delete was a success" }))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
