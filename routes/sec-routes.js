const express = require("express");
const router = express.Router();
const Recipes = require("../models/recipes-model.js");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.render("auth/login" , {Message: "You have to log in to access your personal recipe page."});         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
let condition = false;

/*
router.get("/my-recipes", (req, res, next) =>{
  condition = true;
  console.log(condition);
  res.render("restricted/own-recipes", {condition});
});
*/

router.get("/my-recipes", (req, res, next) => {
  Recipes.find({})
  .populate('owner')
  .then(responseFromDB => {
    console.log(responseFromDB);
    res.render("restricted/own-recipes", { recipes: responseFromDB });
  })
  .catch(error => console.log(error));
});


router.get("/add-recipes", (req, res, next) =>{
  res.render("restricted/add-recipes");
});


router.post("/recipes/create-recipes", (req, res, next) => {
  const title = req.body.title;
  const rating = req.body.rating;
  const servings = req.body.servings;
  const ingredients = req.body.ingredients;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const owner = req.session.currentUser._id;
  const reviews = req.body.reviews;
  console.log(title, rating, servings, ingredients, description, imageUrl, owner, reviews);
  
  if (title === "") { //check if post values are not empty
    res.render("restricted/add-recipes", { // create signup error message in signup page
      errorMessageCreate: "Enter all necessary data."
    });
    return;
  }
  Recipes.findOne({ "title": title }) // check if recipe exists
    .then(thisRecipes => {
      if (thisRecipes !== null) {
        res.render("restricted/add-recipes", { // create signup error message in signup page
          errorMessageCreate: "The recipe " + title + " already exists!"
        });
        return;
      }
    Recipes.create({
      title: title,
      rating: rating,
      servings: servings,
      ingredients: ingredients,
      description: description,
      imageUrl: imageUrl,
      owner: owner,
      reviews: reviews
      })
        .then(() => {
          res.render("restricted/add-recipes", { errorMessageCreate: "The recipe " + title + " has been created successfully!" });
        })
        .catch(error => {
          console.log("Create recipe failed: " + error);
        })
    })
    .catch(error => {
      next(error);
    })
});

router.get("/edit-recipes", (req, res, next) =>{
  res.render("restricted/edit-recipes");
});

router.post("/my-recipes/edit", (req, res, next) => {
  const title = req.body.title;
  const rating = req.body.rating;
  const servings = req.body.servings;
  const ingredients = req.body.ingredients;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const reviews = req.body.reviews;

  if (title === "") { //check if post values are not empty
    res.render("restricted/edit-recipes", {
      Message: "Enter all necessary data."
    });
    return;
  }
  Recipes.findOne({ title: title })
    .then(thisRecipes => {
      if (req.session.currentUser._id.equals(thisRecipes.owner)) {
        Recipes.update({ _id: thisRecipes._id }, { $set: { title, rating, servings, ingredients, description, imageUrl, reviews } })
        .then(() => {
          res.render("restricted/edit-recipes", { Message: "The recipe " + title + " has been edited successfully!" })
        })
        .catch(error => {
          next(error);
        })
      } else {
        res.render("restricted/edit-recipes", { Message: "The recipe " + title + " has not been edited!" })
      }  // end if
    })
    .catch(error => {
      next(error);
    })
  });

  router.get("/delete-recipes", (req, res, next) =>{
    res.render("restricted/delete-recipes");
  });

  router.post('/recipes/:id/delete', (req, res, next) => {
    Room.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/my-recipes');
    })
    .catch(err => next(err));
  })


/*
  router.post("/my-recipes/delete", (req, res, next) => {
    const title = req.body.title;
  
    if (title === "") { //check if post values are not empty
      res.render("restricted/add-recipes", {
        Message: "Enter all necessary data."
      });
      return;
    }
    Recipes.findOne({ title: title })
      .then(thisRecipes => {
        if (req.session.currentUser._id.equals(thisRecipes.owner)) {
          Recipes.findByIdAndDelete(thisRecipes._id)
          .then(() => {
            res.render("restricted/add-recipes", { Message: "The recipe " + title + " has been deleted successfully!" })
          })
          .catch(error => {
            next(error);
          })
        } else {
          res.render("restricted/add-recipes", { Message: "The recipe " + title + " has not been deleted!" })
        }  // end if
      })
      .catch(error => {
        next(error);
      })
  });
*/
  module.exports = router;