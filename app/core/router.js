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
    when('/note/new', {
      templateUrl : 'views/session.html',
      controller  : 'SessionCtrl'
    }).

    // Note - display a single note
    when('/note/:id', {
      templateUrl : 'views/teams.html',
      controller  : 'TeamsCtrl'
    }).

    // 404
    otherwise({
      templateUrl : 'views/404.html',
    });
  }
]);