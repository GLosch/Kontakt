console.log("router linked");
var $container = $(".ui.categories-container");

var $aboutHTML = "<div class='ui segment'><p>This site was designed and built by Gabby Losch using JQuery, Semantic UI, and various JavaScript libraries and modules.</p></div>";

var routes = {
  '/about': function(){
    console.log('SWEET!');
    $container.empty();
    $container.append($aboutHTML);
  }
};

var router = Router(routes);

router.init();