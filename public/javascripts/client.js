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



function getRecipes() {
     return new Promise((resolve, reject) => {
       $.ajax({
         url: 'mocks/recipes.json',
         dataType:'json',
       }).done(data => {
          resolve(data);
       }).fail(err => {
         console.log(err);
       });
     });
  };

function displayRecipes(data) {
  for (index in data.recipes) {
    $('.recipes').append(
      '<input class="recipe-checkbox" name="check" type="checkbox">' +
      '<p class="recipeName">' + data.recipes[index].name + '</p>' +
      '<img src="' + data.recipes[index].photo + '" class="recipeImage"></br>');
  }
};




function getShoppingList() {
   return new Promise((resolve, reject) => {
     $.ajax({
       url: '../mocks/shoppinglist.json',
       dataType:'json',
     }).done(data => {
        resolve(data);
     }).fail(err => {
       console.log(err);
     });
   });
};

function displayShoppingList(data) {
  $('.shopping-list-items')
      .append(data.map(item => `<li>
            <span class="non_edit">${item.name}, ${item.amount} ${item.unit} </span>
            <span class="edit">
                <input type="text" value="${item.name}"/>
                <button>Submit</button>
            </span>
            <div class="closebtn">&times;</div>
            <div class="editbtn">edit</div>
            </li>`));
};



function addToShoppingList(itemName) {
  $('.added-items')
    .append('<li>' + itemName + '</li>');
    // '<input id="shopping-item-checkbox" type="checkbox">' +
    // '<p>' + itemName + '</p>'
};




function getMealPlan() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'mocks/mealplan.json',
      dataType:'json',
    }).done(data => {
       resolve(data);
    }).fail(err => {
      console.log(err);
    });
  });
};

function displayMealPlan(data) {
  for (index in data.mealPlan) {
    $('.meal-plan').append(
      '<h2>' + data.mealPlan[index].name + '</h2>' +
      '<h3>' + data.mealPlan[index].recipeNames + '</h3>');
  }
};




$(function() {
  // getRecipes()
  //   .then(data => {
  //     displayRecipes(data);
  //   });

  getShoppingList()
      .then(data => {
        displayShoppingList(data);
      });

  // getMealPlan()
  //   .then(data => {
  //     displayMealPlan(data);
  //   });

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
      //need something here to capture checked recipes and display their names
      console.log('hold');
  });

  //event listener for button click from recipe selection page to meal plan summary page
  $('#addrecipebtn').on('click', function() {
    //need something here to bring recipes to meal plan page and ingredients to shopping list page
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
  $('.shopping-list-items').on('click', '.editbtn', function(e) {
    $('.editable').removeClass('editable');
    $(e.target).parent().addClass('editable');
  })

});
