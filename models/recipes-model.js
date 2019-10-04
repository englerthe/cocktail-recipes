const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const recipesSchema = new Schema({
    title: {type: String},
    rating: {type: String, enum: ['simple', 'regular', 'tough']},
    servings: {type: Number},
    ingredients: [],
    description: {type: Array},
    imageUrl: {type: String},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }] 
  });

const Recipes = mongoose.model("Recipes", recipesSchema);

module.exports = Recipes;