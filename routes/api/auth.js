const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");
const jwt_decode = require("jwt-decode");
const axios = require("axios");



// @type    POST
//@route    /api/auth/register
// @desc    route for registration of users
// @access  Private route for admin
router.post("/register", passport.authenticate("jwt", { session: false }), (req, res) => {
  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";
  if (des == des1 || des == des2) {
    Person.findOne({ emailId: req.body.emailId })
      .then(person => {
        if (person) {
          return res.status(400).json({
            message: "This Email Id is already registered in our system",
            variant: "error"
          });
        } else {
          Person.findOne({
            mobile: req.body.mobile,
            mobile: !null
          })
            .then(person => {
              if (person) {
                return res.status(400).json({
                  message: "This Contact Number is already registered in our system",
                  variant: "error"
                });
              } else {
                const newPerson = new Person({
                  name: req.body.name,
                  designation: req.body.designation,
                  joiningDate: req.body.joiningDate,
                  mobile: req.body.mobile,
                  address: req.body.address,
                  state: req.body.state,
                  pinCode: req.body.pinCode,
                  emailId: req.body.emailId,
                  password: req.body.password,
                  value: req.body.password,
                  remarks: req.body.remarks,
                  salary: req.body.salary,
                  duration: req.body.duration,
                  beneficiary: req.body.beneficiary,
                  bankName: req.body.bankName,
                  acNo: req.body.acNo,
                  abaNo: req.body.abaNo,
                  branch: req.body.branch,
                  guest: req.body.guest
                });
                // end of getting values

                // If File not found then dont store anything
                // if (req.file !== undefined) newPerson.documents = req.file.location;
                // if (req.file !== undefined) newPerson.userImage = req.file.location;
                // Save the file name into database into profile model
                if (req.body.userImage) {
                  newPerson.userImage = req.body.userImage;
                 
                };
                newPerson.documents = req.body.documents;
                // Encrypt Password using bcrypt

                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newPerson.password, salt, (err, hash) => {
                    if (err) throw err;
                    newPerson.password = hash;
                    newPerson
                      .save()
                      .then(() =>
                        res.json({
                          message: " New employee created Successfully ",
                          variant: "success"
                        })
                      )
                      .catch(err =>
                        res.status(404).json(
                          {
                            message: "Problem in saving",
                            variant: "error"
                          } + err
                        )
                      );
                  });
                });
              }
            })
            .catch(err => res.status(404).json({ message: "Problem in type of person", variant: "error" } + err));
        }
      })
      .catch(err => res.status(404).json({ message: "problem in filter", variant: "error" } + err));
  } else {
    res.json({
      message: "You are not authorised ",
      variant: "error"
    });
  }
});

// @type    POST
//@route    /api/auth/login
// @desc    route for login of users
// @access  PUBLIC

router.post("/login", (req, res) => {
  const emailId = req.body.emailId;

  const password = req.body.password;

  Person.findOne({ emailId })
    .then(person => {
      if (!person) {
        return res.json({
          message: "This Email doesn't exist in our system",
          variant: "error"
        });
      }
      bcrypt
        .compare(password, person.password)
        .then(isCorrect => {
          if (isCorrect) {
            // res.json({

            // });
            //use payload and create token for user
            const payload = {
              id: person._id,
            
              designation: person.designation ,
              userImage: person.userImage,

              name: person.name
            };
            jsonwt.sign(payload, key.secret,  (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              id: person._id,

                message: "login success",
                emailId: person.emailId,
                userImage: person.userImage,
                designation: person.designation ,
                name: person.name
              });
              const decoded = jwt_decode(token);
             
            });
          } else {
            res.json({ message: "Incorrect Password ! Try Again ", variant: "error" });
          }
        })
        .catch(err => console.log(`error in password matching in login:${err}`));
    })
    .catch(err => console.log(`error in login ${err}`));
});
// @type    GET
//@route    /api/auth/person
// @desc    route for user profile
// @access  PRIVATE

router.get("/person", passport.authenticate("jwt", { session: false }), (req, res) => {
  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";

  if (des == des1 || des == des2) {
    Person.find({})
      .sort({ date: -1 })
      .then(Person => res.json(Person))
      .catch(err =>
        res.status(404).json({
          message: "No User Found",
          variant: "error"
        })
      );
  } else {
    res.json({
      message: "You are not authorised ",
      variant: "error"
    });
  }
});

// @type    GET
//@route    /api/auth/guest
// @desc    route for user profile
// @access  PRIVATE

router.get("/guest", passport.authenticate("jwt", { session: false }), (req, res) => {
  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";

  if (des == des1 || des == des2) {
    Person.find({designation: "Guest"})
      .sort({ date: -1 })
      .then(Person => res.json(Person))
      .catch(err =>
        res.status(404).json({
          message: "No User Found",
          variant: "error"
        })
      );
  } else {
    res.json({
      message: "You are not authorised ",
      variant: "error"
    });
  }
});

// @type    get
//@route    /api/auth/get/:id
// @desc    route for personnal user
// @access  PRIVATE


//bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
router.get("/get/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";
  var myId = req.user._id;

  if (des == des1 || des == des2) {
    Person.find({ _id: req.params.id })

      .then(Person => res.json(Person))
      .catch(err =>
        res.status(404).json({
          message: "No User Found",
          variant: "error"
        })
      );
  } else if (myId == req.params.id){
    Person.find({ _id: req.params.id })

    .then(Person => res.json(Person))
    .catch(err =>
      res.status(404).json({
        message: "No User Found",
        variant: "error"
      })
    );
  } else {
    res.json({
      message: "You are not authorised ",
      variant: "error"
    });
  }
});
//bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
// @type    get
//@route    /api/auth/person/:searchperson
// @desc    route for searching of offer from searchbox using any text
// @access  PRIVATE
router.get("/person/:searchperson", passport.authenticate("jwt", { session: false }), (req, res) => {
  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";
  var des3 = "console";

  if (des == des1 || des == des2) {
    const search = req.params.searchperson;
    //console.log(search);
    Person.find({
      name: new RegExp(search, "i")
    }).then(Person => res.json(Person), () => console.log(Person));
  } else {
    res.json({
      message: "You are not authorised ",
      variant: "error"
    });
  }
});

// @type    POST
//@route    /api/auth/register/:id
// @desc    route for simple update data
// @access  PRIVATE
router.post("/register/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  const id = req.params.id;
  const newPerson = {};
  const decoded = jwt_decode(req.headers.authorization);

  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";

 
   
      if (req.body.name) newPerson.name = req.body.name;
      if (req.body.joiningDate) newPerson.joiningDate = req.body.joiningDate;
      if (req.body.designation) newPerson.designation = req.body.designation;
      if (req.body.mobile) newPerson.mobile = req.body.mobile;
      if (req.body.address) newPerson.address = req.body.address;

      if (req.body.state) newPerson.state = req.body.state;
      if (req.body.pinCode) newPerson.pinCode = req.body.pinCode;
      if (req.body.emailId) newPerson.emailId = req.body.emailId;
      if (req.body.password) newPerson.password = req.body.password;
      newPerson.value = req.body.password;
      if (req.body.remarks) newPerson.remarks = req.body.remarks;
      if (req.body.salary) newPerson.salary = req.body.salary;
      if (req.body.duration) newPerson.duration = req.body.duration;
      if (req.body.beneficiary) newPerson.beneficiary = req.body.beneficiary;
      if (req.body.bankName) newPerson.bankName = req.body.bankName;
      if (req.body.acNo) newPerson.acNo = req.body.acNo;
      if (req.body.abaNo) newPerson.abaNo = req.body.abaNo;
      if (req.body.guest) newPerson.guest = req.body.guest;


      if (req.body.branch) newPerson.branch = req.body.branch;

      if (req.body.userImage) {
        newPerson.userImage = req.body.userImage;
       
      };
      newPerson.documents = req.body.documents;

      //end of getting values


      // Save the file name into database into profile model

      //Encrypt password using bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPerson.password, salt, (err, hash) => {
          if (err) throw err;
          newPerson.password = hash;
        });
      });

      if (des == des1 || des == des2) {
        Person.findById(decoded.id).then(person => {
          if (person) {
            Person.findOneAndUpdate({ _id: id }, { $set: newPerson }, { new: true })
              .then(Person =>
                res.json({
                  message: "Updated successfully!!",
                  variant: "success"
                })
              )
              .catch(err => res.json("unable to update" + err));
          } else {
            res.status(400).json({
              message: "not upading with some prob",
              variant: "error"
            });
          }
        });
      } else {
        res.json({
          message: "You are not authorised ",
          variant: "error"
        });
      }
    
  
});

// @type    POST
//@route    /api/auth/register/pass/:id
// @desc    route for simple update data
// @access  PRIVATE
router.post("/register/pass/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  const id = req.params.id;
  const newPerson = {};
  const decoded = jwt_decode(req.headers.authorization);

  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";

 
   
      if (req.body.name) newPerson.name = req.body.name;
      if (req.body.joiningDate) newPerson.joiningDate = req.body.joiningDate;
      if (req.body.designation) newPerson.designation = req.body.designation;
      if (req.body.mobile) newPerson.mobile = req.body.mobile;
      if (req.body.address) newPerson.address = req.body.address;

      if (req.body.state) newPerson.state = req.body.state;
      if (req.body.pinCode) newPerson.pinCode = req.body.pinCode;
      if (req.body.emailId) newPerson.emailId = req.body.emailId;
      if (req.body.newPass) newPerson.password = req.body.newPass;
      newPerson.value = req.body.newPass;
      if (req.body.remarks) newPerson.remarks = req.body.remarks;
      if (req.body.salary) newPerson.salary = req.body.salary;
      if (req.body.duration) newPerson.duration = req.body.duration;
      if (req.body.beneficiary) newPerson.beneficiary = req.body.beneficiary;
      if (req.body.bankName) newPerson.bankName = req.body.bankName;
      if (req.body.acNo) newPerson.acNo = req.body.acNo;
      if (req.body.abaNo) newPerson.abaNo = req.body.abaNo;
      if (req.body.guest) newPerson.guest = req.body.guest;


      if (req.body.branch) newPerson.branch = req.body.branch;

      if (req.body.userImage) {
        newPerson.userImage = req.body.userImage;
       
      };
       
     
     if(req.body.documents){ newPerson.documents = req.body.documents;};

      //end of getting values


      // Save the file name into database into profile model

      //Encrypt password using bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPerson.password, salt, (err, hash) => {
          if (err) throw err;
          newPerson.password = hash;
        });
      });

      if (des == des1 || des == des2) {
        Person.findById(decoded.id).then(person => {
          if (person) {
            Person.findOneAndUpdate({ _id: id }, { $set: newPerson }, { new: true })
              .then(Person =>
                res.json({
                  message: "Updated successfully!!",
                  variant: "success"
                })
              )
              .catch(err => res.json("unable to update" + err));
          } else {
            res.status(400).json({
              message: "not upading with some prob",
              variant: "error"
            });
          }
        });
      } else {
        res.json({
          message: "You are not authorised ",
          variant: "error"
        });
      }
    
  
});

// @type    POST
//@route    /api/auth/deleteuser/:id
// @desc    route for personnal user addoffer and to delete a offer for a particular company
// @access  PRIVATE

router.delete("/deleteuser/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";
  const id = req.params.id;
  var own = req.user._id;
  Person.findOne({ _id: id }).then(newPerson => {
    if (Person) {
      if (des !== des1 && des != des2) {
        res.status(404).json({
          message: "You are Not Authorized to delete this records",
          variant: "error"
        });
      } else if (id == own) {
        res.status(404).json({
          message: "You can not delete your own records",
          variant: "error"
        });
      } else {
        Person.findOneAndDelete({
          _id: id
        })
          .then(() =>
            res.json({
              message: "Deleted successfully",
              variant: "success"
            })
          )
          .catch(err =>
            res.json({
              message: "Failed to delete due to this error - ",
              variant: "error"
            })
          );
      }
    } else {
      res.status(400).json({
        message: "User Not Found",
        variant: "error"
      });
    }
  });
});

router.post("/tw", passport.authenticate("jwt", { session: false }), (req, res) => {
  const id = req.body.id;
 
  

  var des = req.user.designation;
  var des1 = "Admin";
  var des2 = "Manager";


      if (des == des1 || des == des2) {
        Person.findOne(
          {"documents._id" : id}
        ).then(person => { 
          f = person.documents;
          if (person) {
            // res.status(400).json({
            //  f
            // });
            db.collection('users').updateOne({user: "some userID"}, {$pull: { hobbies: {title: "Gaming"} }})
            // f = person.documents;
            f.findOneAndDelete({ _id: id })
              .then(Person =>
                res.json({
                  message:  "Delete successfully!!",
                  variant: "success"
                })
              )
              .catch(err => res.json("unable to update" + err));
          } else {
            res.status(400).json({
              message: "not upading with some prob",
              variant: "error"
            });
          }
        });
      } else {
        res.json({
          message: "You are not authorised ",
          variant: "error"
        });
      }
    
  
});

module.exports = router;
