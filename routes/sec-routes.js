const express = require("express");
const router = express.Router();
const Recipes = require("../models/recipes-model.js");

router.get("/", (req, res, next) => {
  res.render("index");
});

let condition = false;
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.render("auth/login" , {Message: "You have to log in to access your personal recipe page."});         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
condition = true;

router.get("/my-recipes", (req, res, next) => {
  Recipes.find().populate('owner')
  .then(responseFromDB => {
    let myRecipes = [];
    responseFromDB.forEach(everyRecipe => {
      if(req.session.currentUser){
        if(everyRecipe.owner._id.equals(req.session.currentUser._id)){
          myRecipes.push(everyRecipe);
        }
      }
    })
    res.render("restricted/own-recipes", {recipes: myRecipes, condition});
  })
  .catch(error => console.log(error));
});

router.get("/add-recipes", (req, res, next) =>{
  res.render("restricted/add-recipes", {condition});
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
    res.render("restricted/add-recipes", { // create error message in create page
      errorMessageCreate: "Enter all necessary data.", condition
    });
    return;
  }
  Recipes.findOne({ "title": title }) // check if recipe exists
    .then(thisRecipes => {
      if (thisRecipes !== null) {
        res.render("restricted/add-recipes", { // create error message in create page
          errorMessageCreate: "The recipe " + title + " already exists!", condition
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
          condition = true;
          res.render("restricted/add-recipes", { errorMessageCreate: "The recipe " + title + " has been created successfully!", condition});
        })
        .catch(error => {
          console.log("Create recipe failed: " + error);
        })
    })
    .catch(error => {
      next(error);
    })
});

router.post("/edit/:id/recipes", (req, res, next) =>{
  Recipes.findById(req.params.id)
  .then(cocktail =>{
    res.render("restricted/edit-recipes", {cocktail: cocktail, condition});
  })
  .catch(error => {
    next(error);
  })
});

router.post("/edit-recipes/:id/edit", (req, res, next) => {
  const title = req.body.title;
  const rating = req.body.rating;
  const servings = req.body.servings;
  const ingredients = req.body.ingredients;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const owner = req.session.currentUser._id;
  const reviews = req.body.reviews;
  if (title === "") { //check if post values are not empty
    res.render("restricted/edit-recipes", {
      Message: "Enter all necessary data.", condition
    });
    return;
  }
  Recipes.findById(req.params.id)
    .then(thisRecipes => {
        Recipes.update({ _id: thisRecipes._id }, { $set: { title, rating, servings, ingredients, description, imageUrl, owner, reviews } })
        .then(() => {
          res.render("restricted/edit-recipes", { Message: "The recipe " + title + " has been edited successfully!", condition })
        })
        .catch(error => {
          next(error);
        })
    })
    .catch(error => {
      next(error);
    })
  });

  router.post("/delete/:id/recipes", (req, res, next) =>{
    Recipes.findById(req.params.id)
    .then(cocktail =>{
      res.render("restricted/delete-recipes", {cocktail: cocktail, condition});
    })
    .catch(error => {
      next(error);
    })
  });
  
  router.post('/recipes/:id/delete', (req, res, next) => {
   Recipes.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/my-recipes');
    })
    .catch(err => next(err));
    
  })

  router.post("/comment/:id", (req, res, next) =>{
    Recipes.findById(req.params.id)
    .then(responseFromDB => {
      res.render("restricted/review", {comment: responseFromDB, condition})
    })
    .catch(error =>{
      next(error);
    })
  });
    
 
    

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