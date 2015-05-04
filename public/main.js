$(document).ready(function(){
  console.log("Linked");

  //initial ajax call to database to retrieve categories
  function refreshCategories(){
    var $container = $('.ui.categories-container');
    var colors = ['blue', 'green', 'red', 'orange', 'purple', 'teal'];
    $container.empty();
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
          var $allContactsBlock = "<a class='category-block' href='#'><div class='ui blue inverted piled segment'><h4 class='ui header'>All Contacts</h4><h5 class='ui header'>" + totalContacts + " Contacts</h5></div></a>";
          $container.append($allContactsBlock);
          var i = 1;
          catData.forEach(function(e){
            var $catBlock = "<a data-id='" + e.id + "' class='category-block' href='#/categories/" + e.name + "'><div data-id='" + e.id + "' class='ui " + colors[i] + " inverted piled segment'><h4 data-id='" + e.id + "' class='ui header'>" + e.name + "</h4><h5 data-id='" + e.id + "' class='ui header'>" + "" + " Contacts</h5></div></a>";
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

  if(window.location.href === 'http://localhost:3000/'){
    refreshCategories();
  }

  var $newCatButton = $(".ui.fluid.three.item.menu").children(".new-cat").first();
  var $allCatsButton = $(".ui.fluid.three.item.menu").children(".all-cats").first();

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

    // $('.ui.modal').off('click', function(){
    //   defaultActives();
    // });
  });

  // $newCatButton.off("click", $(".ui.modal"), defaultActives());
  
  //end modal//

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

  //expand category
  $('.ui.categories-container').on("click", "a.category-block", function(event){
    var $targetID = ($(this).data().id);
    console.log($targetID);
    // $.ajax({
    //   url: '../'
    // })
  });


  var $aboutLink = $(".ui.fluid.three.item.menu").children(".about").last();
  

});