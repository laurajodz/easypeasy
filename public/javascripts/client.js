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
    displayRecipes(res.hits);
  })
};

function displayRecipes(data) {
    $('.recipesReturned')
      .append(data.map(item => `<li>
          <a href="${item.recipe.url}" target="_blank"><img class="resultsimg" src="${item.recipe.image}" alt="${item.recipe.label}"></a></br>
          <label class="recipeName">${item.recipe.label}<input class="recipe-checkbox" name="check" type="checkbox"></label></li>`))
    if ($.isEmptyObject(data)) {
      $('.noresults').prop('hidden', false);
      $('.recipes').prop('hidden', true);
    }
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




// function getFoodDataFromApi(searchterm) {
//   const queryFood = {
//     ingr: `${searchterm}`
//   }
//   $.ajax({
//     url:'https://api.edamam.com/api/food-database/parser?app_id=10d53124&app_key=25887721367184b9b11f25937af1f6d',
//     method:'GET',
//     data: queryFood,
//     dataType:"jsonp"
//   }).done(res => {
//     populateDropdown(res);
//   })
// };

// function populateDropdown() {
//   let dropdown = $('#food-dropdown');
//
//   dropdown.empty();
//   dropdown.append('<option selected="true" disabled>Add an item</option>');
//   dropdown.prop('selectedIndex', 0);
//
//   const url = 'https://api.edamam.com/api/food-database/parser?app_id=10d53124&app_key=25887721367184b9b11f25937af1f6d';
//
//   // Populate dropdown with list of provinces
//   $.getJSON(url, function (data) {
//     $.each(data, function (key, entry) {
//       dropdown.append($('<option></option>').text(entry.text));
//     })
//   });
// };

// function getShoppingList() {
//    return new Promise((resolve, reject) => {
//      $.ajax({
//        url: '../mocks/shoppinglist.json',
//        dataType:'json',
//      }).done(data => {
//         resolve(data);
//      }).fail(err => {
//        console.log(err);
//      });
//    });
// };

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




$(function() {
  // getRecipes()
  //   .then(data => {
  //     displayRecipes(data);
  //   });

  // getSampleRecipes()
  //load the recipes page with 5 sample recipes

  // getMealPlan()
  //   .then(data => {
  //     displayMealPlan(data);
  //   });

  // getShoppingList()
  //     .then(data => {
  //       displayShoppingList(data);
  //     });
// populateDropdown();



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

  //event listener to select recipes for meal plan and handle counter
  $('.recipes').on('change', '.recipe-checkbox', function(e){
    var totalRecipesSelected = $('input[type=checkbox]:checked').length;
    $('.counter').html(
      `<h2>Recipes selected: ${totalRecipesSelected}</h2>`
    )
    var recipeName = $('.recipeName').val();
    $('recipesSelected').append(
      `<li>recipeName</li>`
    )
  });

  //event listener for button click from recipe selection page to meal plan summary page
  $('#submitrecipesbtn').on('click', function() {
    //need something here to bring recipes to meal plan page and ingredients to shopping list page
    window.location = 'mealPlan.html';
  });




  //event listener for button click to go from meal plan page to shopping list page
  $('#seelistbtn').on('click', function() {
    window.location = 'shoppingList.html';
  });

  //event listener to go back to recipes page from meal plan page to add more

  //event listener to create new meal plan

  //event listener to delete recipes from meal plan (and its items on shopping list)




  //event listener for button click to add an item to shopping list
  $('.additembtn').on('click', function() {
    console.log('hello');
    event.preventDefault();
    const newItemName = $('.shoppingList-entry').val(); //change shoppinglist-entry
    console.log(newItemName);
    $('.shoppingList-entry').val(''); //change shoppinglist-entry
    addToShoppingList(newItemName);
  });

  //event listener for click to cross off shopping list item
  var list = document.querySelector('ul');
  list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

  // event listener to hide item (delete) from shopping list
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
