$(document).ready(function(){

console.log("router linked");
var $container = $(".ui.categories-container");

var $aboutHTML = "<div class='ui segment'><p>This site was designed and built by Gabby Losch using JQuery, Semantic UI, and various JavaScript libraries and modules.</p></div>";

function aboutPage(){
  $container.empty();
  var $aboutLink = $(".ui.fluid.three.item.menu").children(".about").last();
  console.log($aboutLink);
  $allCatsButton.removeClass("blue active");
  $aboutLink.addClass("blue active");
  $container.append($aboutHTML);
}

// function categoryPage(catName){
//   $container.empty();
//     $.ajax({
//       url: '../contacts',
//       method: 'GET',
//       contentType: 'application/JSON'
//     }).done(function(data){
//       data.forEach(function(e){
//         var image = e.image_url;
//         var name = e.name;
//         var city = e.city;
//         var phone = e.phone;
//         var email = e.email;
//         var personInfo = {image: image, name: name, city: city, phone: phone, email: email};
//         var $rendered = Mustache.render($personCard, {person: personInfo});
//         $container.append($rendered);
//       });
//     });
// }

var routes = {
  '/': refreshCategories,
  '/about': aboutPage,
  '/categories': refreshCategories
  // '/all': allContacts
};

var router = Router(routes);

router.init();
});