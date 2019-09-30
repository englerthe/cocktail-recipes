const mongoose = require('mongoose');
const Celebrity = require('../models/recipes-model.js');

const dbName = 'cocktail-recipes';
mongoose.connect(`mongodb://localhost/${dbName}`);

const recipes = [
{
  title: "Moscow Mule",
  rating: simple,
  servings: 1,
  ingredients: [
  '4 cl Wodka', 
  '2 cl Limettensaft', 
  '200 ml Ginger Ale', 
  '6 Scheiben Gurken'],
  description: "Gurkenscheiben zuerst zerstoßen. Dazu gibt amn 4 cl Wodka und füllt das Ganze mit Ginger Ale auf"
},
{
  title: "Hugo",
  rating: simple,
  servings: 1,
  ingredients: [
  '1 Glass Prosecco', 
  '1/2 Limette', 
  '2 Stängel Minze', 
  'Holunderblütensirup, nach Belieben'
  ],
  description: [
  'Den Saft der Limette in den Prosecco geben.' ,
  'Minze und Holunderblütensirup nach Belieben zugeben.'
  ]
},
{
  title: "Swimmingpool",
  rating: regular,
  servings: 1,
  ingredients: [
  '1 cl Rum', 
  '4 cl Kokossirup', 
  '2 cl Blue Curacao',
  '3 cl Sahne',
  '15 cl Ananassaft'
  ],
  description: [
  'Die Zutaten zusammen mit einigen Eiswürfeln im Shaker schütteln.' 
  ]
}
]


 Recipes.create(recipes, (err) => {
    if (err) { throw(err) }
    console.log(`Created ${recipes.length} recipes`)
    mongoose.connection.close();
  });
  