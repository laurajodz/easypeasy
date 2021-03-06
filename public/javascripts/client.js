var mealPlanArray = [];

var recipesArray = [];

//change to live site url
// const base_url = 'http://localhost:8080';
const base_url = 'https://easypeasyapp.herokuapp.com';

function getRecipes(searchTerm) {
  const query = {
    q: `${searchTerm}`,
    to: 12
  }
  $.ajax({
    url:'https://api.edamam.com/search?app_id=c5e83e4d&app_key=63b608e29d4873fd592f2304be5930d1',
    method:'GET',
    data: query,
    dataType:"json"
  }).done(res => {
    recipesArray = res.hits;
    displayRecipes(res.hits);
  })
};

function constructItem(item, index){
  const button = !item.added ? `<button class="add-recipe" data-key="${index}" >Add</button>` : '<i>Added!</i>';
  return `<li class="recipelist">
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
      `<p class="recipe-counter">Number of recipes selected: ${totalRecipesSelected}</p>`
  )
}




$(function() {


  //Recipes page


  //event listener for button click from home page to recipes page
  $('#beginbtn1').on('click', function() {
    window.location = 'recipes.html';
  });

  $('#beginbtn2').on('click', function() {
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
      $('.summary').show();
      $('.x').show('slow');
      $('.ready').show();
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
        $('.ready').hide();
        $('.x').hide();
      }
      displayMealPlan(mealPlanArray);
      displayRecipes(recipesArray);
    });

  //event listener for button click from recipe selection page to meal plan summary page;
  //adds mealPlanArray to database, displays Meal Plan Page
  //THIS IS END POINT #1
  $('#submitrecipesbtn').on('click', function(event) {
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
      window.location = 'mealPlan/view/' + res.mealPlan._id;
    })

  })


  //Meal Plan page


  //event listener to see all previous meal plans
  $('#previous').on('click', function() {
    window.location = '/mealPlan/view/mealplans';
  });

  //event listener to start a new meal plan (return to recipes.html)
  $('#newmpbtn').on('click', function() {
    window.location = '/recipes.html';
  });


  //Shopping List page


  //event listener for button click to add an item to shopping list
  //THIS IS END POINT #2
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
              <button class="editsubmitbtn1" data-key="${res.key}">Submit</button>
            </span>
            <div class="editbtn1">edit</div>
            <div class="pipe"> | </div>
            <i class="fa fa-trash del1"></i>
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

  // event listener to edit added shopping list item
  //THIS IS END POINT #3
  $('.shopping-list').on('click', '.editbtn1', function(e) {
    $('.editable').removeClass('editable');
    $(e.target).parent().addClass('editable');
  });

  $('.shopping-list').on('click', '.editsubmitbtn1', function(event) {
    const itemToEdit = $(event.target).parent().find('input.textedit').val();

    const key = $(event.target).data('key');

    const editItem = {
      id: $('#shoppinglistid').val(),
      key: key,
      itemToEdit: itemToEdit
    }

    fetch(base_url + `/shoppingList/api/${editItem.id}/edititem1`, {
      method:'PUT',
      body: JSON.stringify(editItem),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .catch(error => console.error('Error:', error))
    .then(res => {
      $('.editable').removeClass('editable')
      $(event.target).parent().parent().find('label.new').text(itemToEdit);
    })
  })

  // event listener to edit recipe shopping list item
  //THIS IS END POINT #4
  $('.shopping-list').on('click', '.editbtn2', function(e) {
    $('.editable').removeClass('editable');
    $(e.target).parent().addClass('editable');
  });

  $('.shopping-list').on('click', '.editsubmitbtn2', function(event) {
    const itemToEdit = $(event.target).parent().find('input.textedit').val();

    const key = $(event.target).data('key');

    const editItem = {
      id: $('#shoppinglistid').val(),
      key: key,
      itemToEdit: itemToEdit
    }

    fetch(base_url + `/shoppingList/api/${editItem.id}/edititem2`, {
      method:'PUT',
      body: JSON.stringify(editItem),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .catch(error => console.error('Error:', error))
    .then(res => {
      $('.editable').removeClass('editable')
      $(event.target).parent().parent().find('label.new').text(itemToEdit);
    })
  })

  //event listener to delete an added shopping list item
  //THIS IS END POINT #5
  $('.shopping-list').on('click', '.del1', function(event) {

    const itemToDelete = $(event.currentTarget).parent().find('label.new').text();

    const deleteItem = {
      id: $('#shoppinglistid').val(),
      itemToDelete: itemToDelete
    }

    fetch(base_url + `/shoppingList/api/${deleteItem.id}/delitem1`, {
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

  //event listener to delete a recipe shopping list item
  //THIS IS END POINT #6
  $('.shopping-list').on('click', '.del2', function(event) {

    const itemToDelete = $(event.currentTarget).parent().find('label.new').text();

    const deleteItem = {
      id: $('#shoppinglistid').val(),
      itemToDelete: itemToDelete
    }

    fetch(base_url + `/shoppingList/api/${deleteItem.id}/delitem2`, {
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
  $('#datepicker').datepicker('setDate', '+' + (8 - new Date().getDay()));

});
