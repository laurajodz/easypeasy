const mockShoppingList = {
  "shoppingList": [
    {name: "pasta", unit: "pounds", amount: 1},
    {name: "Parmesean cheese", unit: "cups", amount: 1},
    {name: "mozzarella cheese", unit: "cups", amount: 1},
    {name: "pasta sauce", unit: "cups", amount: 2},
    {name: "quesadillas", unit: "shells", amount: 3},
    {name: "cheddar cheese", unit: "ounces", amount: 5},
    {name: "sausage", unit: "ounces", amount: 14},
    {name: "onion", unit: "cups", amount: 2},
    {name: "cabbage", unit: "cups", amount: 6},
    {name: "ground turkey", unit: "pounds", amount: 2},
    {name: "ground cumin", unit: "teaspoons", amount: 2},
    {name: "eggs", unit: "whole", amount: 1}
  ]
};

const mockRecipes = {
  "recipes": [
    {name: "Baked ziti",
    photo: "http://georgesmarket.com/wp-content/uploads/2015/02/Baked-Ziti.jpg",
    ingredients: ["1 pound pasta", "1 cup Parmesean cheese", "1 cup mozzarella cheese", "2 cups pasta sauce"],
    instructions: "Lorem ipsum",
    recipeId: 000001},
    {name: "Quesadillas",
    ingredients: ["3 quesadilla shells", "5 oz cheddar cheese"],
    instructions: "Lorem ipsum",
    recipeId: 000002},
    {name: "Sausage and cabbage",
    ingredients: ["14 oz sausage", "1 cup onion", "6 cups cabbage"],
    instructions: "Lorem ipsum",
    recipeId: 000003},
    {name: "Turkey chili",
    ingredients: ["2 pounds ground turkey", "1 cup onion", "2 tsp ground cumin"],
    instructions: "Lorem ipsum",
    recipeId: 000004}
  ]
};

const mockMealPlan = {
  "mealPlan": [
    {name: "Week of Jan 1 2018",
    recipeIds: [000001, 000003, 000004],
    mealPlanID: 010118}
  ]
};

function getRecipes(callbackFn) {
  setTimeout(function(){ callbackFn(mockRecipes)}, 1);
};

function displayRecipes(data) {
  for (index in data.recipes) {
    $('body').append(
      '<input id="recipe-checkbox" type="checkbox">' +
      '<p>' + data.recipes[index].name + '</p>' +
      '<img src="' + data.recipes[index].photo + '">');
  }
};


$(function() {
  getRecipes(displayRecipes);

  $('#recipe-checkbox').change(function() {
    console.log("hello");
    var totalRecipesSelected = $('input[type=checkbox]:checked').length;
    console.log(totalRecipesSelected);
    $('.recipe-counter').html(
      `<h2>Recipes selected: ${totalRecipesSelected}</h2>`
    )
  });

});
