mean.controller('HomeCtrl', ['$scope', 'Api', function ($scope, Api) {

  // create the notes array, bond to the controller scope
  $scope.notes = [{
    title   : 'testing',
    created : 'may 16, 1991',
    content : 'This is my first note'
  }, {
    title   : 'my other note',
    created : 'Mar 16, 2014',
    content : 'another test note to see how everything works. this on is longet se I can make usre line wrap works. Wooo Hoooo, isnt this fun'
  }];

  // define notes request
  $scope.requestNotes = function (name) {
    Api.notes.read(function (result) {

      $scope.notes = result && result.notes ? result.notes : [];
    });
  }

  // invoke notes request
  // $scope.requestTeams();
}]);