const mockShoppingList = {
  "shoppingList": [
    {name: "pasta", unit: "pound(s)", amount: 1, section: "ethnic", recipe: "Baked ziti"},
    {name: "Parmesan cheese", unit: "cup(s)", amount: 1, section: "deli & cheese", recipe: "Baked ziti"},
    {name: "mozzarella cheese", unit: "cup(s)", amount: 1, section: "deli & cheese", recipe: "Baked ziti"},
    {name: "pasta sauce", unit: "cup(s)", amount: 2, section: "ethnic", recipe: "Baked ziti"},
    {name: "quesadillas", unit: "shell(s)", amount: 3, section: "bakery & bread", recipe: "Quesadillas"},
    {name: "cheddar cheese", unit: "ounce(s)", amount: 5, section: "deli & cheese", recipe: "Quesadillas"},
    {name: "sausage", unit: "ounce(s)", amount: 14, section: "meat", recipe: "Sausage & cabbage"},
    {name: "cabbage", unit: "cup(s)", amount: 6, section: "produce", recipe: "Sausage & cabbage"},
    {name: "onion", unit: "cup(s)", amount: 1, section: "produce", recipe: "Sausage & cabbage"},
    {name: "onion", unit: "cup(s)", amount: 1, section: "produce", recipe: "Turkey chili"},
    {name: "ground turkey", unit: "pound(s)", amount: 2, section: "meat", recipe: "Turkey chili"},
    {name: "ground cumin", unit: "teaspoon(s)", amount: 2, section: "spices", recipe: "Turkey chili"},
    {name: "eggs", unit: "whole", amount: 1, section: "dairy & eggs", recipe: "none"}
  ]
};

const mockRecipes = {
  "recipes": [
    {name: "Baked ziti",
    photo: "http://georgesmarket.com/wp-content/uploads/2015/02/Baked-Ziti.jpg",
    ingredients: ["1 pound pasta", "1 cup Parmesan cheese", "1 cup mozzarella cheese", "2 cups pasta sauce"],
    instructions: "Lorem ipsum",
    recipeId: 000001},
    {name: "Quesadillas",
    ingredients: ["3 quesadilla shells", "5 oz cheddar cheese"],
    instructions: "Lorem ipsum",
    recipeId: 000002},
    {name: "Sausage and cabbage",
    ingredients: ["14 oz sausage", "6 cups cabbage", "1 cup onion"],
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
    recipeNames: ["Baked ziti", "Sausage & cabbage", "Turkey chili"],
    mealPlanID: 010118}
  ]
};

const edamam_recipes_url = 'https://api.edamam.com/search?app_id=c5e83e4d&app_key=63b608e29d4873fd592f2304be5930d1&q=salad&to=100';


// function getRecipeDataFromApi(searchTerm, callback) {
//   const query = {
//
//   }
//   $.getJSON(edamam_recipes_url, query, callback);
// }


function getRecipes(callbackFn) {
  setTimeout(function(){ callbackFn(mockRecipes)}, 1);
};

function displayRecipes(data) {
  for (index in data.recipes) {
    $('.recipes').append(
      '<input class="recipe-checkbox" type="checkbox">' +
      '<p>' + data.recipes[index].name + '</p>' +
      '<img src="' + data.recipes[index].photo + '">');
  }
};


function getShoppingList(callbackFn) {
  setTimeout(function(){ callbackFn(mockShoppingList)}, 1);
};

function displayShoppingList(data) {
  for (index in data.shoppingList) {
    $('.shopping-list').append(
      '<li>' + data.shoppingList[index].name + ', ' + data.shoppingList[index].amount + ' ' + data.shoppingList[index].unit + '<div class="closebtn">&times;</div>' + '  ' + '<div class="editbtn">edit</div>' + '</li>');
  }
};
//       '<input id="shopping-item-checkbox" type="checkbox">' +
//       '<p>' + data.shoppingList[index].name + '</p>' +
//       '<p>' + data.shoppingList[index].amount + ' ' + data.shoppingList[index].unit + '</p>' +
//       '<button class="edit-shopping-list-item">edit</button>' + '<button class="delete-shopping-list-item">delete</button>');

function addToShoppingList(itemName) {
  mockShoppingList.shoppingList.push({name: itemName});
  $('.shopping-list').append(
    '<li>' + itemName + '</li>');
    // '<input id="shopping-item-checkbox" type="checkbox">' +
    // '<p>' + itemName + '</p>'
};


function getMealPlan(callbackFn) {
  setTimeout(function(){ callbackFn(mockMealPlan)}, 1);
};

function displayMealPlan(data) {
  for (index in data.mealPlan) {
    $('.meal-plan').append(
      '<h2>' + data.mealPlan[index].name + '</h2>' +
      '<h3>' + data.mealPlan[index].recipeNames + '</h3>');
  }
};


$(function() {
  getRecipes(displayRecipes);
  getShoppingList(displayShoppingList);
  getMealPlan(displayMealPlan);

  //event listener for button click to add an item to shopping list
  $('#shopping-list-add').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.shoppingList-entry').val();
    $('.shoppingList-entry').val('');
    addToShoppingList(newItemName);
  });

  //event listener for click to cross off shopping list item
//   var list = document.querySelector(".shopping-list-items");
//   list.addEventListener('click', function(ev) {
//   if (ev.target.tagName === 'LI') {
//     ev.target.classList.toggle('checked');
//   }
// }, false);
//
//   // event listener to delete item from shopping list
//     $('.closebtn').on('click', function() {
//       var div = this.parentElement;
//       div.style.display = "none";
//     });
  // $('.closebtn').on('click', funcion() {
  //   const itemDelete = getItemIndexFromElement(event.currentTarget);
  //   mockShoppingList.shoppingList.splice(itemIndex, 1);
  // });

  //event handler for counter of recipes selected for meal plan
  $('.recipes').on('change', '.recipe-checkbox', function(e){
    var totalRecipesSelected = $('input[type=checkbox]:checked').length;
    $('.recipe-counter').html(
      `<h2>Recipes selected: ${totalRecipesSelected}</h2>`
    )
  });

  //event listener for button click from recipe selection page to meal plan summary page
  $('#recipe-to-mealPlan').on('click', function() {
    window.location = 'mealPlan.html';
  });



});
