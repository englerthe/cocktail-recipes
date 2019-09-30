const express = require('express');
const router  = express.Router();
const User = require("../models/user-model");
//const Reciepes = require("../models/recipes-model");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;



router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    const getUser = req.body.username;
    const getemail = req.body.email;
    const getPass = req.body.password;
    
    if (getUser === "" || getPass === "" || getemail === "") { //check if post values are not empty
      res.render("auth/signup", { // create signup error message in signup page
        errorMessageSignup: "Please enter all necessary fields to sign in." 
      });
      return;
    }
    User.findOne({ "username": getUser }) // check if username exists
      .then(user => {
        if (user !== null) {
          res.render("auth/signup", { // create signup error message in signup page
            errorMessageSignup: "The username "+getUser+" already exists!"
          });
          return;
        } 
        const salt = bcrypt.genSaltSync(bcryptSalt); //create user / pw in database
        const hashPass = bcrypt.hashSync(getPass, salt);
        User.create({
          username: getUser,
          email: getPass,
          password: hashPass
        })
          .then(() => {
            req.session.currentUser = user; // combine user --> session 
            res.redirect("/");
          })
          .catch(error => {
            next(error); 
          })
      })
      .catch(error => {
        next(error);
      })
  });

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post("/login", (req, res, next) => {
    const getUser = req.body.username;
    const getPass = req.body.password;
    if (getUser === "" || getPass === "") { //check if post values are not empty
      res.render("auth/login", { // create login error message in login page
        errorMessageLogin: "Login only possible with username and password"
      });
      return;
    }
  
    User.findOne({ "username": getUser }) // check if username exists
    .then(user => {
        if (!user) { // if user does not exist
          res.render("auth/login", { // create login error message in login page
            errorMessageLogin: "The entered username doesn't exist." 
          });
          return;
        }
        if (bcrypt.compareSync(getPass, user.password)) { // if user exists, compare pw
          req.session.currentUser = user; // save session
          res.redirect("/"); // if pw ok, then goto startpage
        } else { // if pw doesnt match
          res.render("auth/login", { // create error message in login page
            errorMessageLogin: "Incorrect password"
          });
        }
    })
    .catch(error => {
      next(error);
    })
});

router.get("/logout", (req, res) => { //logout option
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

/*
router.get("/main", (req, res, next) => {
  Room.find()
  .then(listofRooms => {
    console.log(listofRooms);
    res.render("auth/main", {listofRooms});
  })
  .catch(error => {
    next(error);
  })
});
*/
module.exports = router;
  