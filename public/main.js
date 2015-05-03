$(document).ready(function(){
  console.log("Linked");

  $.ajax({
      url: '../categories',
      method: 'GET',
      contentType: 'application/JSON'
    }).done(function(data){
      console.log(data);
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