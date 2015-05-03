$(document).ready(function(){
  console.log("Linked");

  var colors = ['blue', 'green', 'red', 'orange', 'purple', 'teal'];
  //initial ajax call to database to retrieve categories
  $.ajax({
      url: '../categories',
      method: 'GET',
      contentType: 'application/JSON'
    }).done(function(catData){
      console.log(catData);
      //nested ajax call to database to retrieve individual contact info
      $.ajax({
        url: '../contacts',
        method: 'GET',
        contentType: 'application/JSON'
      }).done(function(contactData){
        console.log(contactData);
          var totalContacts = contactData.length;
          console.log(totalContacts);
          var $container = $('.ui.categories-container');
          var $allContactsBlock = "<div class='ui blue inverted piled segment'><h4 class='ui header'>All Contacts</h4><h5 class='ui header'>" + totalContacts + " Contacts</h5></div>";
          $container.append($allContactsBlock);
          var i = 1;
          catData.forEach(function(e){
            var $catBlock = "<div class='ui " + colors[i] + " inverted piled segment'><h4 class='ui header'>" + e.name + "</h4><h5 class='ui header'>" + "" + " Contacts</h5></div>";
            $container.append($catBlock);
            if (i === 5){
              i = 0;
            } else {
              i++;
            }
        });
      });
    });

  var $newCatButton = $(".ui.fluid.three.item.menu").children(".new-cat").first();
  var $allCatsButton = $(".ui.fluid.three.item.menu").children(".all-cats").first();

  $newCatButton.on("click", function(){
    console.log("clicked!");
    $('.ui.modal').modal('show');
    $newCatButton.addClass("blue active");
    $allCatsButton.removeClass("blue active");
  });
  


  var $aboutLink = $(".ui.fluid.three.item.menu").children(".about").last();
  

});