var mealPlanArray = [];

var recipesArray = [];

//change to live site url
const base_url = 'http://localhost:8080';

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




$(function() {

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
    $('.selection').show('slow');
    $('.choose').show('slow');
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
  //THIS IS END POINT #1
  $('#submitrecipesbtn').on('click', function() {
    event.preventDefault();

    var mealPlanName = $('#datepicker').val();

    if ($('#datepicker').val().trim().length == 0) {
      alert("Please choose a date");
      return false;
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
    .then(mealPlan => {
      return fetch(base_url + '/shoppingList/api/' + mealPlan._id, {
        method: 'POST',
      })
    })
    .then(res => res.json())
    .then(res => {
      window.location = 'mealPlan/view/' + res.mealPlan._id
    })

  })



  //Meal Plan page

  //event listener to go back to edit meal plan (return to recipes.html)
  //THIS IS END POINT #2
  $('#gobackbtn').on('click', function() {
    window.history.back();
    // MealPlan
    //   .findOne().sort({created_at: -1}).exec(function(err, post) { ... });
  });

  //event listener to start a new meal plan (return to recipes.html)
  $('#newmpbtn').on('click', function() {
    window.location = '/recipes.html';
  });

  //need something to delete meal plan
  //THIS IS END POINT #3


  //event listener to access previous meal plans
  //THIS IS END POINT #4
  // $('#previous').on('click', function() {
  //
  //   fetch(base_url + '/mealPlan/api', {
  //     method: 'GET',
  //     // body: JSON.stringify,
  //     headers: new Headers({
  //       'Content-Type': 'application/json'
  //     })
  //   })
  //   .catch(error => console.error('Error:', error))
  //   // .then(res => {
  //   //   console.log(res);
  //   //   // recipesArray = res.hits;
  //   //   // displayRecipes(res.hits);
  //   //   )}
  // )};


  //Shopping List page

  //event listener for button click to add an item to shopping list
  //THIS IS END POINT #5
  $('#additembtn').on('click', function(event) {

    event.preventDefault();

    if ($('.shoppingList-entry').val().length == 0) {
      alert("Please enter an item");
      return false;
    }

    const newItemName = $('.shoppingList-entry').val();
    $('.shoppingList-entry').val('');

    const update = {
      id: $('#shoppinglistid').val(),
      newItemName: newItemName
    }

    fetch(base_url + `/shoppingList/api/${update.id}/additem`, {
      method:'PUT',
      body: JSON.stringify(update),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .catch(error => console.error('Error:', error))
    .then(res => res.json())
    .then(res => {
        $('.my-added-items')
          .append(`<li><span class="non_edit"><input type="checkbox" class="check">
          <label class="new">${newItemName}</label><input type="text" hidden></span>
            <span class="edit">
              <input type="text" class="textedit" value="${newItemName}"/>
              <button class="editsubmitbtn">Submit</button>
            </span>
            <div class="editbtn" data-key="${res.key}">edit</div>
            <i class="fa fa-trash del"></i>
              </li>`);
        })
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
  //THIS IS END POINT #6
  $('.shopping-list').on('click', '.editbtn', function(e) {
    $('.editable').removeClass('editable'); //if another item is already open/editable when edit is clicked, this changes it to noneditable
    $(e.target).parent().addClass('editable'); //this makes item editable
    $('.editsubmitbtn').on('click', function(e) { //this click submit is to make the changes
      const editItem = $('.textedit').val(); //need to capture updated text
      $('.editable').removeClass('editable'); //changes item back to noneditable
      console.log(editItem);
    });
  });

  //event listener to delete shopping list item
  //THIS IS END POINT #7
  // $('.shopping-list').on('click', '.fa', function(e) {
  $('.shopping-list').on('click', '.del', function(event) {

    // const itemToDelete = document.getElementById('label').innerHTML;

    const itemToDelete = $(event.currentTarget).parent().find('label.new').text();

    console.log('Target to Delete: ', itemToDelete);

    // const hello = `${additionalItemNames.item}`;
    // console.log(hello);

    const deleteItem = {
      id: $('#shoppinglistid').val(),
      itemToDelete: itemToDelete
    }

    fetch(base_url + `/shoppingList/api/${deleteItem.id}/delitem`, {
      method:'PUT',
      body: JSON.stringify(deleteItem),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .catch(error => console.error('Error:', error))
    .then(res => {
      $(event.currentTarget).parent().remove();
    })
  });

  //date picker
  $('#datepicker').datepicker({ dateFormat: 'DD, MM dd, yy' }).val();



});
