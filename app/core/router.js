//
// Routing
//

// $routeprovider allows us to define clientside routing
mean.config(['$routeProvider', function ($routeProvider) {

  $routeProvider.

    // Home - display a list of notes
    when('/', {
      templateUrl : 'views/home.html',
      controller  : 'HomeCtrl'
    }).

    //  New Note - note submission
    when('/new', {
      templateUrl : 'views/note_action.html',
      controller  : 'NoteActionCtrl'
    }).

    //  Edit Note - note submission
    when('/edit/:id', {
      templateUrl : 'views/note_action.html',
      controller  : 'NoteActionCtrl'
    }).

    // 404
    otherwise({
      templateUrl : 'views/404.html',
    });
  }
]);