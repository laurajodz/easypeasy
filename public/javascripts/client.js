var mealPlanArray = [];

var recipesArray = [];

var mockShoppingList = {
  "mock": [
    {"name": "pasta", "unit": "pound(s)", "amount": 1, "section": "ethnic", "recipe": "Baked ziti"},
    {"name": "Parmesan cheese", "unit": "cup(s)", "amount": 1, "section": "deli", "recipe": "Baked ziti"},
    {"name": "mozzarella cheese", "unit": "cup(s)", "amount": 1, "section": "deli", "recipe": "Baked ziti"},
    {"name": "pasta sauce", "unit": "cup(s)", "amount": 2, "section": "ethnic", "recipe": "Baked ziti"},
    {"name": "quesadillas", "unit": "shell(s)", "amount": 3, "section": "bakery & bread", "recipe": "Quesadillas"},
    {"name": "cheddar cheese", "unit": "ounce(s)", "amount": 5, "section": "deli", "recipe": "Quesadillas"},
    {"name": "sausage", "unit": "ounce(s)", "amount": 14, "section": "meat", "recipe": "Sausage & cabbage"},
    {"name": "cabbage", "unit": "cup(s)", "amount": 6, "section": "produce", "recipe": "Sausage & cabbage"},
    {"name": "onion", "unit": "cup(s)", "amount": 1, "section": "produce", "recipe": "Sausage & cabbage"},
    {"name": "onion", "unit": "cup(s)", "amount": 1, "section": "produce", "recipe": "Turkey chili"},
    {"name": "ground turkey", "unit": "pound(s)", "amount": 2, "section": "meat", "recipe": "Turkey chili"},
    {"name": "ground cumin", "unit": "teaspoon(s)", "amount": 2, "section": "spices", "recipe": "Turkey chili"},
    {"name": "eggs", "unit": "whole", "amount": 1, "section": "dairy & eggs", "recipe": "none"}
  ]
};


function getRecipes(searchTerm) {
  const query = {
    q: `${searchTerm}`,
    to: 10
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

function displayRecipes(data) {
    $('.recipesReturned')
      .append(data.map((item, index) => `<li>
          <a href="${item.recipe.url}" target="_blank" class="link">
            <img class="resultsimg" src="${item.recipe.image}" alt="${item.recipe.label}"></a></br>
          <label class="recipeName">${item.recipe.label}
            <input class="recipe-checkbox" type="checkbox" data-key="${index}"></label>
          <p class="added" hidden>Added!</p></li>`))
    // if ($.isEmptyObject(data)) {
    //   $('.noresults').prop('hidden', false); //not working perfectly
    //   $('.recipes').prop('hidden', true);
    // }
};




function getShoppingList(callbackFn) {
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

  //load sample recipes on recipe page

  //event listener for button click for recipe search
  $('.recipe-search').submit(event => {
    $('.recipesSamples').hide();
    event.preventDefault();
    const queryText = $('.recipeSearch-entry').val();
    $('.recipeSearch-entry').val('');
    getRecipes(queryText);
  });

  //event listener for meal plan selector and to handle counter
  $('.recipes').on('change', '.recipe-checkbox', function(e){
    var totalRecipesSelected = $('input[type=checkbox]:checked').length;
    $('.counter').html(
      `<p>Number of recipes selected: ${totalRecipesSelected}</p>`
    )

  //to add to/delete from Selected, show/hide Added!, highlight photo
    if ($(e.target).is(':checked')) {
      var index = $(e.target).data('key');
      recipesArray[index].key = index;
      mealPlanArray.push(recipesArray[index]);
      $('.recipesSelected').html(mealPlanArray.map(recipe => recipe.recipe.label).join(', '));

      $(e.target).parent().siblings('.added').show();
      $(e.target).parent().siblings('.link').find('.resultsimg').addClass('border');
    } else {
      var index = $(e.target).data('key');
      recipesArray[index].key = index;
      console.log(index);
      console.log(recipesArray);
      console.log(mealPlanArray);
      var x = mealPlanArray[index];
      console.log(x);
      mealPlanArray.splice(x, 1);  //DELETE NOT WORKING
      console.log(mealPlanArray);
      $('.recipesSelected').html(mealPlanArray.map(recipe => recipe.recipe.label).join(', '));

      $(e.target).parent().siblings('.added').hide();
      $(e.target).parent().siblings('.link').find('.resultsimg').removeClass('border');
    };

    displayMealPlan(mealPlanArray);
});

  function displayMealPlan(data){
    //event listener for button click from recipe selection page to meal plan summary page
    $('#submitrecipesbtn').on('click', function() {
      //need something here to bring recipes to meal plan page and ingredients to shopping list page
      window.location = 'mealPlan.html';
      $('.meal-plan')
        .append(data.map(item => `<li>
          ${item}</li>`)
        );
    });
  }




  //Meal Plan page

  //event listener for button click to go from meal plan page to shopping list page
  $('#seelistbtn').on('click', function() {
    window.location = 'shoppingList.html';
  });

  //event listener to go back to recipes page from meal plan page to add more
  $('#morerecipesbtn').on('click', function() {
    window.location = 'recipes.html';
  });




  //Shopping List page

  //event listener for button click to add an item to shopping list
  $('#additembtn').on('click', function() {
    event.preventDefault();
    const newItemName = $('.shoppingList-entry').val();
    $('.shoppingList-entry').val('');
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


});
