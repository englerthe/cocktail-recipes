const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const recipesSchema = new Schema({
    title: {type: String},
    rating: {type: String, enum: ['simple', 'regular', 'tough']},
    servings: {type: Number},
    ingredients: [],
    description: {type: String},
    imageUrl: {type: String},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    reviews: [] // we will update this field a bit later when we create review model
  });

const Recipes = mongoose.model("Recipes", recipesSchema);

module.exports = Recipes;