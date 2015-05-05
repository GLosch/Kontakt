//sets the homepage path to '...#/' so that the refreshCategories function can run on initial page load
document.location.href = '#/';

var $container = $('.ui.categories-container');
var $allCatsButton = $(".ui.fluid.three.item.menu").children(".all-cats").first();
var $aboutLink = $(".ui.fluid.three.item.menu").children(".about").last();

//Mustache template for Cards
var $personCard = "<div class='ui special cards'>{{#person}}<div data-id='{{id}}' class='card'><a class='dimmable image'><div class='ui dimmer'><div class='content'><div class='center'><div data-id='{{id}}' class='ui inverted button'>Delete</div></div></div></div><img src='{{image}}'></a><div class='content'><p data-type='name' class='header' contenteditable='true'>{{name}}</p><div class='description'><p data-type='city' contenteditable='true'>{{city}}</p><p data-type='phone' contenteditable='true'>{{phone}}</p><p data-type='email' contenteditable='true'>{{email}}</p></div></div></div>{{/person}}</div>";

//get all Contacts
function allContacts(){
  $.ajax({
    url: '../contacts',
    method: 'GET',
    contentType: 'application/JSON'
  }).done(function(data){
    console.log(data);
    // $container.empty();
    // data.forEach(function(e){
    //   var image = e.image_url;
    //   var name = e.name;
    //   var city = e.city;
    //   var phone = e.phone;
    //   var email = e.email;
    //   var personInfo = {image: image, name: name, city: city, phone: phone, email: email};
    //   var $rendered = Mustache.render($personCard, {person: personInfo});
    //   $container.append($rendered);
    // });
  });
}


//initial ajax call to database to retrieve categories
function refreshCategories(){
  var colors = ['blue', 'green', 'red', 'orange', 'purple', 'teal'];
  $container.empty();
  $allCatsButton.addClass("blue active");
  $aboutLink.removeClass("blue active");
  $.ajax({
    url: '../categories',
    method: 'GET',
    contentType: 'application/JSON'
  }).done(function(catData){
    //nested ajax call to database to retrieve individual contact info
    $.ajax({
      url: '../contacts',
      method: 'GET',
      contentType: 'application/JSON'
    }).done(function(contactData){
        var totalContacts = contactData.length;
        var $allContactsBlock = "<a class='category-block' href='#/all'><div class='ui blue inverted piled segment'><h4 class='ui header'>All Contacts</h4><h5 class='ui header'>" + totalContacts + " Contacts</h5></div></a>";
        $container.append($allContactsBlock);
        var i = 1;
        catData.forEach(function(e){
          var $catBlock = "<a data-id='" + e.id + "' class='category-block fadeInDown' href='#/categories/" + e.name + "'><div data-id='" + e.id + "' class='ui " + colors[i] + " inverted piled segment'><h4 data-id='" + e.id + "' class='ui header'>" + e.name + "</h4><h5 data-id='" + e.id + "' class='ui header'>" + "" + " Contacts</h5></div></a>";
          $container.append($catBlock);
          //increment through list of colors and assign the next color in the sequence to each category block
          if (i === 5){
            i = 0;
          } else {
            i++;
          }
      });
    });
  });
}

$(document).ready(function(){
  console.log("Linked");

  if(window.location.href === 'http://localhost:3000/'){
    refreshCategories();
  }

  var $newCatButton = $(".ui.fluid.three.item.menu").children(".new-cat").first();

  //assign the active class to the Categories button and remove it from the All Categories button
  function defaultActives(){
    $newCatButton.removeClass("blue active");
    $allCatsButton.addClass("blue active");
  }

  //open modal 
  $newCatButton.on("click", function(){
    console.log("clicked!");
    $('.ui.modal').modal('show');
    $newCatButton.addClass("blue active");
    $allCatsButton.removeClass("blue active");
    $('.ui.modal').on("click", "[data-action='save']", function(event){
      console.log("clicked save");
      var $newCatInput = $('.ui.modal').find("input").val();
      $.ajax({
        url: '../categories',
        method: 'POST',
        contentType: 'application/JSON',
        data: JSON.stringify({name: $newCatInput})
      }).done(function(){
        refreshCategories();
      });
      defaultActives();
    });
    $('.ui.modal').on("click", "[data-action='cancel']", function(event){
      defaultActives();
    });
  });

  //end modal//

  //expand category and show contacts within it
  $('.ui.categories-container').on("click", "a.category-block", function(event){
    var $targetID = ($(this).data().id);
    $container.empty();
    $.ajax({
      url: '../contacts',
      method: 'GET',
      contentType: 'application/JSON'
    }).done(function(data){
      var categoryResults = _.where(data, {category_id: $targetID});
      $container.append("<div data-id='" + $targetID + "' class='ui green button createContact'>Add Contact</div><br>");
      $container.on("click", ".ui.green.button", function(){
        console.log("clicked the add button");
        //create blank Card when Add Contact button is clicked
        $.ajax({
          url: '../contacts',
          method: 'POST',
          contentType: 'application/JSON',
          data: JSON.stringify({image: 'https://team.org/static/images/generic_avatar_300.gif', name: 'Name', city: 'City', phone: 'Phone Number', email: 'email'})
        }).done(function(data){
          console.log(data.id);
          var personInfo = {image: data.image, name: data.name, city: data.city, phone: data.phone, email: data.email};
          var rendered = Mustache.render($personCard, {person: personInfo});
          $container.append(rendered);
        });
      });
      if(categoryResults.length === 0){
        $container.append("<div class='ui segment'><p>There are no contacts in this category</p></div>");
      } else{
        categoryResults.forEach(function(e){
          var id = e.id;
          var image = e.image_url;
          var name = e.name;
          var city = e.city;
          var phone = e.phone;
          var email = e.email;
          var personInfo = {id: id, image: image, name: name, city: city, phone: phone, email: email};
          var $rendered = Mustache.render($personCard, {person: personInfo});
          $container.append($rendered);
          // $rendered.hide().appendTo($container).fadeIn(1000);
            $('.special.cards .image').dimmer({
              on: 'click'
            });
        });
      }
    });
  });

  //update contact info (from within a person Card)
  $('.ui.categories-container').on("blur", "[contenteditable='true']", function(event){
    var clickedCard = $(event.target).parents('.card');
    var $typeOfData = ($(event.target).data().type);
    var valueOfField = $(event.target)[0].innerText.trim();
    var cardID = clickedCard.data().id;
    //switch case to determine which field has been edited, and make an ajax call to edit only that field
    switch($typeOfData){
      case 'name':
        $.ajax({
          url: '../contacts/' + cardID,
          method: 'PATCH',
          contentType: 'application/JSON',
          data: JSON.stringify({name: valueOfField})
        }).done(function(){
          console.log("updated");
        });
      break;

      case 'city':
        $.ajax({
          url: '../contacts/' + cardID,
          method: 'PATCH',
          contentType: 'application/JSON',
          data: JSON.stringify({city: valueOfField})
        }).done(function(){
          console.log("updated");
        });
      break;

      case 'phone':
        $.ajax({
          url: '../contacts/' + cardID,
          method: 'PATCH',
          contentType: 'application/JSON',
          data: JSON.stringify({phone: valueOfField})
        }).done(function(){
          console.log("updated");
        });
      break;

      case 'email':
        $.ajax({
          url: '../contacts/' + cardID,
          method: 'PATCH',
          contentType: 'application/JSON',
          data: JSON.stringify({email: valueOfField})
        }).done(function(){
          console.log("updated");
        });
      break;
    }
  });

  //modal for confirming deletion of a contact Card
  var $deleteModal = "<div class='ui basic modal'><i class='close icon'></i><div class='header'>Delete Contact?</div><div class='content'><div class='image'><i class='archive icon'></i></div><div class='description'><p>Are you sure you want to delete this contact?</p></div></div><div class='actions'><div class='two fluid ui inverted buttons'><div class='ui red basic inverted button'><i class='remove icon'></i>No</div><div class='ui green basic inverted button'><i class='checkmark icon'></i>Yes</div></div></div>";

  //delete contact from Card
  $(".ui.categories-container").on("click", ".ui.inverted.button", function(event){
    console.log("delete button clicked");
    var cardID = ($(event.target).data().id);
    // $(".ui.categories-container").append($deleteModal);
    // $(deleteModal).modal('show');
    $.ajax({
      url: '../contacts/' + cardID,
      method: 'DELETE'
    }).done(function(data){
      console.log(data);
      console.log("contact deleted");
      refreshCategories();
    });
  });


});


//fade effects that need adjustment
  // $(".ui.categories-container").on("mouseenter", ".category-block", function(){
  //   console.log("mouse enter");
  //   $(this).css("opacity", 0.5);
  // });

  // $(".ui.categories-container").on("mouseleave", ".category-block", function(){
  //   console.log("mouse leave");
  //   $(this).css("opacity", 1);
  // });

  //fade effect when hovering over categories
  // $('.ui.categories-container').hover(
  //  function(){
  //     $(this).stop().fadeTo('fast', 1);
  //  },
  //  function(){
  //     $(this).stop().fadeTo('fast', 0.8);
  //  });
