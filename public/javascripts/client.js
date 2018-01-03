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
    photo: "http://assets.kraftfoods.com/recipe_images/opendeploy/55039_640x428.jpg",
    ingredients: ["3 quesadilla shells", "5 oz cheddar cheese"],
    instructions: "Lorem ipsum",
    recipeId: 000002},
    {name: "Sausage and cabbage",
    photo: "http://myketorecipes.com/wp-content/uploads/2016/11/fried-cabbage-with-sausage.jpg",
    ingredients: ["14 oz sausage", "6 cups cabbage", "1 cup onion"],
    instructions: "Lorem ipsum",
    recipeId: 000003},
    {name: "Turkey chili",
    photo: "https://assets.epicurious.com/photos/54b26f03a801766f773f5134/master/pass/388569_turkey-chili_1x1.jpg",
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




function getRecipeDataFromApi(searchTerm, callback) {
  const query = {
    q: `${searchTerm}`,
    to: 50
  }
  $.ajax({
    url:'https://api.edamam.com/search?app_id=c5e83e4d&app_key=63b608e29d4873fd592f2304be5930d1',
    method:'GET',
    data: query,
    dataType:"jsonp"
  }).done(res => {
    var recipeResults = res.hits;
    for (var i=0; i<recipeResults.length; i++){
      var recipeReturn = recipeResults[i].recipe;
      var recipeReturnName = recipeReturn.label;
      var recipeReturnImage = recipeReturn.image;
      var recipeReturnInstructionsUrl = recipeReturn.url;
      var recipeReturnIngredients = recipeReturn.ingredients;
      var ingredientList = $('<ul>');
      for (var j=0; j<recipeReturnIngredients.length; j++) {
        var returnIngredient = recipeReturnIngredients[j].text;
        var li = $('<li>').html(returnIngredient);
        ingredientList.append(li);
      }
      var recipe_name = $('<p>').html(recipeReturnName);
      var recipe_image = $('<img>').attr('src', recipeReturnImage);
      var label = $('<p>').html('Ingredients');
      // var recipe_instructions = $('<a href').html('recipeReturnInstructionsUrl');
      $(".recipesReturned").append(recipe_name, recipe_image, label, ingredientList);
    }
    if($.isEmptyObject(recipeResults)){
      $('.noresults').prop('hidden', false);
    }
  })
};




function getFoodDataFromApi(searchterm, callback) {
  const queryFood = {
    ingr: `${searchterm}`
  }
  $.ajax({
    url:'https://api.edamam.com/api/food-database/parser?app_id=10d53124&app_key=25887721367184b9b11f25937af1f6d',
    method:'GET',
    data: queryFood,
    dataType:"jsonp"
  }).done(res => {
})
};



function getRecipes(callbackFn) {
  setTimeout(function(){ callbackFn(mockRecipes)}, 1);
};

function displayRecipes(data) {
  for (index in data.recipes) {
    $('.recipes').append(
      '<input class="recipe-checkbox" name="check" type="checkbox">' +
      '<p class="recipeName">' + data.recipes[index].name + '</p>' +
      '<img src="' + data.recipes[index].photo + '" class="recipeImage"></br>');
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

  //event listener for button click from home page to recipes page
  $('#beginbtn').on('click', function() {
    window.location = 'recipes.html';
  });

  //event handler for counter of recipes selected for meal plan
  $('.recipes').on('change', '.recipe-checkbox', function(e){
    var totalRecipesSelected = $('input[type=checkbox]:checked').length;
    $('.counter').html(
      `<h2>Recipes selected: ${totalRecipesSelected}</h2>`
    )
  });

  //event listener for button click for recipe search
  $('.recipe-search').submit(event => {
    $('.recipes').hide();
    event.preventDefault();
    const queryText = $('.recipeSearch-entry').val();
    $('.recipeSearch-entry').val('');
    getRecipeDataFromApi(queryText);
  });

  //event listener to select recipes for meal plan
  $('.recipePhoto').on('click', function() {
    console.log("hello");
  });

  //event listener for button click from recipe selection page to meal plan summary page
  $('#addrecipebtn').on('click', function() {
    //need something here to capture checked recipes
    //need something here to bring ingredients to shopping list
    window.location = 'mealPlan.html';
  });

  //event listener to delete items on shopping list if recipe is deleted from meal plan



  //event listener for button click to go from meal plan page to shopping list page
  $('#seelistbtn').on('click', function() {
    window.location = 'shoppingList.html';
  });

  //event listener for button click to add an item to shopping list
  $('.additembtn').on('click', function() {
    console.log('hello');
    event.preventDefault();
    const newItemName = $('.shoppingList-entry').val();
    console.log(newItemName);
    $('.shoppingList-entry').val('');
    addToShoppingList(newItemName);
  });

  //event listener for click to cross off shopping list item
  var list = document.querySelector('ul');
  list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

  // event listener to hideitem from shopping list
    $('.closebtn').on('click', function() {
      var close = document.getElementsByClassName("closebtn");
      var i;
      for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
          var div = this.parentElement;
          div.style.display = "none";
        }
      }
    });


  //event listener to edit shopping list item
  $('.editbtn').on('click', function() {
    console.log("hi");
  })


});
