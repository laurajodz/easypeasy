var mealPlanArray = [];

var recipesArray = [];

//change to live site url
const base_url = 'http://localhost:8080';

var mockShoppingList = {
  "mock": [
    {"name": "pasta", "unit": "pound(s)", "amount": 1, "recipe": "Baked ziti"},
    {"name": "Parmesan cheese", "unit": "cup(s)", "amount": 1, "recipe": "Baked ziti"},
    {"name": "mozzarella cheese", "unit": "cup(s)", "amount": 1, "recipe": "Baked ziti"},
    {"name": "pasta sauce", "unit": "cup(s)", "amount": 2, "recipe": "Baked ziti"},
    {"name": "quesadillas", "unit": "shell(s)", "amount": 3, "recipe": "Quesadillas"},
    {"name": "cheddar cheese", "unit": "ounce(s)", "amount": 5, "recipe": "Quesadillas"},
    {"name": "sausage", "unit": "ounce(s)", "amount": 14, "recipe": "Sausage & cabbage"},
    {"name": "cabbage", "unit": "cup(s)", "amount": 6, "recipe": "Sausage & cabbage"},
    {"name": "onion", "unit": "cup(s)", "amount": 1, "recipe": "Sausage & cabbage"},
    {"name": "onion", "unit": "cup(s)", "amount": 1, "recipe": "Turkey chili"},
    {"name": "ground turkey", "unit": "pound(s)", "amount": 2, "recipe": "Turkey chili"},
    {"name": "ground cumin", "unit": "teaspoon(s)", "amount": 2, "recipe": "Turkey chili"},
    {"name": "eggs", "unit": "whole", "amount": 1, "recipe": "none"}
  ]
};


function getRecipes(searchTerm) {
  const query = {
    q: `${searchTerm}`,
    to: 12
  }
  $.ajax({
    url:'https://api.edamam.com/search?app_id=c5e83e4d&app_key=63b608e29d4873fd592f2304be5930d1',
    method:'GET',
    data: query,
    dataType:"jsonp"
  }).done(res => {
    recipesArray = res.hits;
    displayRecipes(res.hits);
  })
};

function constructItem(item, index){
  const button = !item.added ? `<button class="add-recipe" data-key="${index}" >Add</button>` : '<i>Added!</i>';
  return `<li>
          <a href="${item.recipe.url}" target="_blank">
            <img class="resultsimg" src="${item.recipe.image}" alt="${item.recipe.label}"></a></br>
          <div class="recipe-name">${item.recipe.label}</div>
          <div class="source">Source: ${item.recipe.source}</div>
          ${button}
          </li>`;
}

function displayRecipes(data) {
    $('.recipesReturned')
      .html(data.map(constructItem));
};

function constructMealItem(item, index){
  return `<div class="mealitem">
        ${item.recipe.label}, ${item.recipe.source} <button class="remove-meal-item" data-key="${index}">x</button>
    </div>`;
}

function displayMealPlan(mealPlanArray){
  $('.recipesSelected').html(mealPlanArray.map(constructMealItem));
  var totalRecipesSelected = mealPlanArray.length;
  $('.counter').html(
      `<p>Number of recipes selected: ${totalRecipesSelected}</p>`
  )
}
    // if ($.isEmptyObject(data)) {
    //   $('.noresults').prop('hidden', false); //not working perfectly
    // }




function getShoppingList(callbackFn) {

//
//   $.ajax({
//     url:`/${mealPlanId}/shoppinglist`,
//     method:'GET',
//     dataType:"jsonp"
//   }).done(res => {
//     displayShoppingList(res);
//   })
// };
    setTimeout(function(){ callbackFn(mockShoppingList)}, 1);
  };

function displayShoppingList(data) {
  for (index in data.mock) {
    //KEEP - will eventually display items from recipes added to meal plan
    $('.shopping-list-items')
        .append(data.mock.map(item => `<li>
              <span class="non_edit">
                <input type="checkbox" class="check"><label class="new">${item.name}, ${item.amount} ${item.unit} </label><input type="text" hidden></span>
              <span class="edit">
              <input type="text" class="textedit" value="${item.name}, ${item.amount} ${item.unit}"/>
              <button class="editsubmitbtn">Submit</button>
              </span>
              <div class="editbtn">edit</div>
              <i class="fa fa-trash"></i>
              </li>`));
  }
};




$(function() {

  // getMealPlan()
  //   .then(data => {
  //     displayMealPlan(data);
  //   });

  // getShoppingList()
  //   .then(data => {
  //     displayShoppingList(data);
  //   });

  getShoppingList(displayShoppingList);




  //Recipes page

  //event listener for button click from home page to recipes page
  $('#beginbtn').on('click', function() {
    window.location = 'recipes.html';
  });

  //event listener for button click for recipe search
  $('.recipe-search').submit(event => {
    event.preventDefault();
    const queryText = $('.recipeSearch-entry').val();
    $('.recipeSearch-entry').val('');
    getRecipes(queryText);
  });

  //event listener for meal plan add recipe
  $('.recipes').on('click', '.add-recipe', function(e){
      var index = $(e.target).data('key');
      recipesArray[index].added = true;
      mealPlanArray.push(recipesArray[index]);
      $('#submitrecipesbtn').removeAttr('disabled');
      displayMealPlan(mealPlanArray);
      displayRecipes(recipesArray);
  });

  //event listener for meal plan delete recipe
  $('.recipesSelected').on('click', '.remove-meal-item', function(e){
      const index = $(e.target).data('key');
      mealPlanArray[index].added = false;
      mealPlanArray.splice(index, 1);
      if (mealPlanArray.length > 0) {
        $('#submitrecipesbtn').removeAttr('disabled');
      } else {
        $('#submitrecipesbtn').attr('disabled','disabled');
      }
      displayMealPlan(mealPlanArray);
      displayRecipes(recipesArray);
    });

  //event listener for button click from recipe selection page to meal plan summary page;
  //adds mealPlanArray to database
  //displays Meal Plan Page
  $('#submitrecipesbtn').on('click', function() {
    var mealPlanName = $('#datepicker').val();

    if ($('#datepicker').val().trim().length == 0) {
      alert("Please choose a date");
    }

    const q = {
      name: mealPlanName,
      recipeNames: mealPlanArray.map(r => ({
        name: r.recipe.label,
        source: r.recipe.source,
        image: r.recipe.image,
        url: r.recipe.url,
        ingredients: r.recipe.ingredients.map(i => i.text)
      }))
    }
    console.log(q);

    fetch(base_url + '/mealPlan/api', {
      method: 'POST',
      body: JSON.stringify(q),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => res.json())
    .then(res => {
      window.location = 'mealPlan/view/' + res._id
    })

  })



  //Meal Plan page

  //event listener for button click to go from meal plan page to shopping list page
  //need something here to bring ingredients to shopping list page (same as above)
  $('#seelistbtn').on('click', function() {
    window.location = 'shoppingList.html';
    getShoppingList();
  });

  //need something to edit or delete meal plan, and see previous meal plans




  //Shopping List page

  //event listener for button click to add an item to shopping list
  $('#additembtn').on('click', function() {

    const newItemName = $('.shoppingList-entry').val();
    $('.shoppingList-entry').val('');

      $.ajax({
        url:'/mealplan',
        method:'PUT',
        data: newItemName,
        dataType:"jsonp"
      }).done(res => {
            $('.my-added-items')
              .append(`<li><span class="non_edit"><input type="checkbox" class="check">
              <label class="new">${newItemName}</label><input type="text" hidden></span>
                <span class="edit">
                  <input type="text" class="textedit" value="${newItemName}"/>
                  <button class="editsubmitbtn">Submit</button>
                </span>
                <div class="editbtn">edit</div>
                <i class="fa fa-trash"></i>
                  </li>`);
      });
  })


  //event listener for click to cross off shopping list item
  $('.shopping-list').on('change', '.check', function(e) {
    if ($(e.target).is(':checked')) {
      $(e.target).parent().addClass('checked');
    } else {
      $(e.target).parent().removeClass('checked');
    }
  });

  // event listener to edit recipe shopping list item
  $('.shopping-list').on('click', '.editbtn', function(e) {
    $('.editable').removeClass('editable'); //if an item is already green/editable when edit is clicked, this changes it to noneditable
    $(e.target).parent().addClass('editable'); //this makes item editable
    $('.editsubmitbtn').on('click', function(e) { //this click submit is to make the changes
      // var editItem = $('.textedit').val(); //need to capture updated text
      $('.editable').removeClass('editable');
    });
  });

  //event listener to delete recipe shopping list item
  $('.shopping-list').on('click', '.fa', function(e) {
      $(e.target).parent().remove();
  });

  //date picker
  $('#datepicker').datepicker({ dateFormat: 'DD, MM dd, yy' }).val();



});
